'use strict';
/* Data layer: storage, accounts, transactions, and the two backup types.
 *
 * Account shape (same as the Android app's accounts.json):
 *   { id, name, avatar, pinHash, salt, balance, transactions: [newest first] }
 * Transaction: { id, type: 'DEPOSIT'|'WITHDRAW', amount, note, time(ms), balanceAfter }
 */

const STORE_KEY = 'piggybank.v1';
const UNDO_KEY = 'piggybank.v1.undo';
const OPENING_NOTE = 'Opening Balance';

function emptyDb() {
  return { accounts: [], settings: { dark: true, lastBackupAt: null } };
}

let db = loadDb();

function loadDb() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      const d = emptyDb();
      d.accounts = (o.accounts || []).map(normAccount).filter(Boolean);
      d.settings = { ...d.settings, ...(o.settings || {}) };
      return d;
    }
  } catch (e) { /* fall through to empty */ }
  return emptyDb();
}

function saveDb() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(db));
    return true;
  } catch (e) {
    return false;
  }
}

// ---------- accounts & transactions ----------
const accountNumber = (acc) => digitsFrom(acc.id, 16);
const txnRef = (t) => 'PB' + digitsFrom(t.id, 10);
const hashPin = (pin, salt) => sha256Hex(salt + pin);
const getAccount = (id) => db.accounts.find((a) => a.id === id) || null;

function txnTitle(t) {
  if (t.note === OPENING_NOTE || t.note === 'Started with') return 'Opening Balance';
  return t.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal';
}
function txnRemark(t) {
  const n = (t.note || '').trim();
  return ['', OPENING_NOTE, 'Started with', 'Money added', 'Money taken out'].includes(n) ? null : n;
}

function createAccount(name, avatar, opening, pin) {
  const salt = newId();
  const now = Date.now();
  const txns = opening > 0
    ? [{ id: newId(), type: 'DEPOSIT', amount: opening, note: OPENING_NOTE, time: now, balanceAfter: opening }]
    : [];
  const acc = { id: newId(), name: name.trim(), avatar, pinHash: hashPin(pin, salt), salt, balance: opening, transactions: txns };
  db.accounts.push(acc);
  saveDb();
  return acc;
}

/** Returns an error message, or null on success. On success `out.txn` is set. */
function transact(acc, type, amount, remark, out) {
  if (!(amount > 0)) return 'Please enter an amount.';
  if (type === 'WITHDRAW' && amount > acc.balance) {
    return `Insufficient balance. Available balance is ${rupees(acc.balance)}.`;
  }
  const balance = type === 'DEPOSIT' ? acc.balance + amount : acc.balance - amount;
  const txn = { id: newId(), type, amount, note: remark, time: Date.now(), balanceAfter: balance };
  acc.balance = balance;
  acc.transactions.unshift(txn);
  if (!saveDb()) {
    acc.transactions.shift();
    acc.balance = type === 'DEPOSIT' ? balance - amount : balance + amount;
    return 'Could not save. Browser storage may be full or blocked.';
  }
  out.txn = txn;
  return null;
}

// ---------- normalising & validating imported data ----------
function normTxn(t) {
  if (!t || typeof t !== 'object') return null;
  const id = String(t.id || '');
  const type = String(t.type || '').toUpperCase();
  const amount = Math.round(Number(t.amount));
  let time = Number(t.time);
  if (!id || !(type === 'DEPOSIT' || type === 'WITHDRAW')) return null;
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1e9 || !Number.isFinite(time)) return null;
  if (time < 1e11) time *= 1000; // the iPad app stores seconds
  return {
    id, type, amount,
    note: String(t.note == null ? '' : t.note).slice(0, 100),
    time: Math.round(time),
    balanceAfter: Math.round(Number(t.balanceAfter) || 0),
  };
}

function normTxnList(list) {
  const seen = new Set();
  const out = [];
  let dropped = 0;
  for (const raw of Array.isArray(list) ? list : []) {
    const t = normTxn(raw);
    if (!t || seen.has(t.id)) { dropped++; continue; }
    seen.add(t.id);
    out.push(t);
  }
  return { list: out, dropped };
}

/** Rebuilds running balances in time order. Returns { list (newest first), balance, negativeAt }. */
function recompute(txs) {
  const arr = txs
    .map((t, i) => ({ t: { ...t }, i }))
    .sort((a, b) =>
      a.t.time - b.t.time ||
      (a.t.type === b.t.type ? 0 : a.t.type === 'DEPOSIT' ? -1 : 1) ||
      a.i - b.i);
  let bal = 0;
  let negativeAt = null;
  for (const x of arr) {
    bal += x.t.type === 'DEPOSIT' ? x.t.amount : -x.t.amount;
    x.t.balanceAfter = bal;
    if (bal < 0 && negativeAt === null) negativeAt = x.t.time;
  }
  return { list: arr.map((x) => x.t).reverse(), balance: bal, negativeAt };
}

function normAccount(a) {
  if (!a || typeof a !== 'object') return null;
  const id = String(a.id || ''), name = String(a.name || '').trim();
  const pinHash = String(a.pinHash || ''), salt = String(a.salt || '');
  if (!id || !name || !pinHash || !salt) return null;
  const { list } = normTxnList(a.transactions);
  const r = recompute(list);
  return { id, name: name.slice(0, 20), avatar: String(a.avatar || '🦁'), pinHash, salt, balance: r.balance, transactions: r.list };
}

function mergeTxns(existing, incoming) {
  const ids = new Set(existing.map((t) => t.id));
  const fresh = incoming.filter((t) => !ids.has(t.id));
  return { list: existing.concat(fresh), added: fresh.length, skipped: incoming.length - fresh.length };
}

// ---------- backup files ----------
const APP_ID = 'PiggyBank';

function wrapFile(kind, data, extra) {
  const json = JSON.stringify(data);
  return JSON.stringify({
    app: APP_ID, kind, formatVersion: 1, exportedAt: new Date().toISOString(),
    ...extra, checksum: sha256Hex(json), data,
  }, null, 2);
}

function buildFullBackup() {
  return wrapFile('full-backup', { accounts: db.accounts, settings: { dark: db.settings.dark } }, {});
}

function buildHistoryFile(acc) {
  return wrapFile('history', { transactions: acc.transactions }, {
    account: { id: acc.id, name: acc.name, avatar: acc.avatar, accountNumber: accountNumber(acc) },
  });
}

function buildHistoryCsv(acc) {
  const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
  const rows = [['Date & Time', 'Type', 'Amount (INR)', 'Remarks', 'Balance (INR)', 'Reference No.']];
  for (const t of [...acc.transactions].reverse()) {
    rows.push([fmtDateTime(t.time), txnTitle(t), (t.type === 'DEPOSIT' ? '' : '-') + t.amount, txnRemark(t) || '', t.balanceAfter, txnRef(t)]);
  }
  return '﻿' + rows.map((r) => r.map(q).join(',')).join('\r\n');
}

/** Parses a backup file. Throws Error with a friendly message. */
function parseBackupText(text) {
  let o;
  try { o = JSON.parse(text); } catch (e) { throw new Error('This file is not a valid backup (it could not be read).'); }
  // Raw accounts.json from the Android app, or a bare accounts list.
  if (Array.isArray(o)) o = { app: APP_ID, kind: 'full-backup', data: { accounts: o }, legacy: true };
  else if (o && Array.isArray(o.accounts)) o = { app: APP_ID, kind: 'full-backup', data: o, legacy: true };
  if (!o || o.app !== APP_ID || !o.data) throw new Error('This file is not a Piggy Bank backup.');
  let checksumOk = null;
  if (o.checksum) checksumOk = sha256Hex(JSON.stringify(o.data)) === o.checksum;
  if (o.kind === 'full-backup') {
    const accounts = (o.data.accounts || []).map(normAccount).filter(Boolean);
    return { kind: 'full', accounts, settings: o.data.settings || {}, exportedAt: o.exportedAt || null, checksumOk, legacy: !!o.legacy,
      skipped: (o.data.accounts || []).length - accounts.length };
  }
  if (o.kind === 'history') {
    const { list, dropped } = normTxnList(o.data.transactions);
    return { kind: 'history', transactions: list, dropped, owner: o.account || null, exportedAt: o.exportedAt || null, checksumOk };
  }
  throw new Error('Unknown backup type.');
}

// ---------- applying imports (with one-step undo) ----------
function snapshotForUndo() {
  try { localStorage.setItem(UNDO_KEY, JSON.stringify({ at: Date.now(), db })); } catch (e) { /* ignore */ }
}
function hasUndo() {
  try { return !!localStorage.getItem(UNDO_KEY); } catch (e) { return false; }
}
function undoLastImport() {
  const raw = localStorage.getItem(UNDO_KEY);
  if (!raw) return false;
  const o = JSON.parse(raw);
  db = { accounts: o.db.accounts.map(normAccount).filter(Boolean), settings: { ...emptyDb().settings, ...(o.db.settings || {}) } };
  saveDb();
  localStorage.removeItem(UNDO_KEY);
  return true;
}

function describeFull(parsed) {
  return parsed.accounts.map((a) => ({
    id: a.id, name: a.name, avatar: a.avatar, balance: a.balance, count: a.transactions.length,
    onDevice: !!getAccount(a.id), account: accountNumber(a),
  }));
}

/** mode: 'replace' | 'merge'. Returns a summary string. */
function applyFull(parsed, mode) {
  snapshotForUndo();
  if (mode === 'replace') {
    db.accounts = parsed.accounts;
    if (typeof parsed.settings.dark === 'boolean') db.settings.dark = parsed.settings.dark;
    saveDb();
    return `Restored ${parsed.accounts.length} profile${parsed.accounts.length === 1 ? '' : 's'}.`;
  }
  let addedProfiles = 0, mergedProfiles = 0, addedTx = 0;
  for (const inc of parsed.accounts) {
    const local = getAccount(inc.id);
    if (!local) { db.accounts.push(inc); addedProfiles++; continue; }
    const m = mergeTxns(local.transactions, inc.transactions);
    if (m.added) {
      const r = recompute(m.list);
      local.transactions = r.list; local.balance = r.balance;
      mergedProfiles++; addedTx += m.added;
    }
  }
  saveDb();
  return `Added ${addedProfiles} new profile${addedProfiles === 1 ? '' : 's'} and ${addedTx} transaction${addedTx === 1 ? '' : 's'} to ${mergedProfiles} existing profile${mergedProfiles === 1 ? '' : 's'}.`;
}

function describeHistory(parsed, acc) {
  const ids = new Set(acc.transactions.map((t) => t.id));
  const fresh = parsed.transactions.filter((t) => !ids.has(t.id)).length;
  return { total: parsed.transactions.length, fresh, duplicates: parsed.transactions.length - fresh,
    sameProfile: !!(parsed.owner && parsed.owner.id === acc.id) };
}

/** mode: 'merge' | 'replace'. Returns { error } or { summary }. */
function applyHistory(parsed, acc, mode) {
  let list;
  let added;
  if (mode === 'replace') { list = parsed.transactions; added = list.length; }
  else { const m = mergeTxns(acc.transactions, parsed.transactions); list = m.list; added = m.added; }
  const r = recompute(list);
  if (r.negativeAt !== null) {
    return { error: `Import cancelled: it would make the balance go below ₹0 on ${fmtDate(r.negativeAt)}. Nothing was changed.` };
  }
  snapshotForUndo();
  acc.transactions = r.list;
  acc.balance = r.balance;
  saveDb();
  return { summary: mode === 'replace'
    ? `History replaced with ${added} transaction${added === 1 ? '' : 's'}. New balance ${rupees(acc.balance)}.`
    : `${added} new transaction${added === 1 ? '' : 's'} added. New balance ${rupees(acc.balance)}.` };
}

// ---------- saving files / sharing ----------
function canShareFiles() {
  try {
    const f = new File(['x'], 'x.json', { type: 'application/json' });
    return !!(navigator.canShare && navigator.canShare({ files: [f] }));
  } catch (e) { return false; }
}

function downloadFile(filename, text, mime) {
  const blob = new Blob([text], { type: mime || 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Opens the system share sheet (Drive, Files, email...). Resolves 'shared' | 'cancelled' | 'failed'. */
async function shareFile(filename, text) {
  const file = new File([text], filename, { type: 'application/json' });
  try {
    await navigator.share({ files: [file], title: 'Piggy Bank backup' });
    return 'shared';
  } catch (e) {
    return e && e.name === 'AbortError' ? 'cancelled' : 'failed';
  }
}

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const safeName = (s) => s.replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 20) || 'profile';
