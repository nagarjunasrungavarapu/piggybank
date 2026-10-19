'use strict';
/* Piggy Bank web app: screens and interaction. Data/backup logic lives in store.js. */

const AVATARS = ['🦁', '🐼', '🐯', '🦊', '🐵', '🐸', '🦄', '🐶', '🐱', '🐰', '🐧', '🦋'];

const ICONS = {
  bank: 'M4,10v7h3v-7H4zM10,10v7h3v-7h-3zM2,22h19v-3H2v3zM16,10v7h3v-7h-3zM11.5,1L2,6v2h19V6l-9.5,-5z',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
  down: 'M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z',
  up: 'M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z',
  history: 'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z',
  person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
  eyeoff: 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z',
  logout: 'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  warn: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  check: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  bksp: 'M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z',
  moon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z',
  cloud: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z',
  download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
  upload: 'M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z',
  share: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z',
  chev: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
};
const ico = (n, s = 24) => `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${ICONS[n]}"/></svg>`;

const ui = {
  screen: 'welcome', params: {}, currentId: null,
  pin: '', pinMsg: '', onPin: null,
  su: { step: 0, name: '', avatar: AVATARS[0], opening: '', pin1: '' },
  ed: { name: '', avatar: '' },
  money: null, balVisible: true, hist: 'all', pending: null,
  deferredInstall: null, persisted: null,
};
const cur = () => getAccount(ui.currentId);
const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// ---------------------------------------------------------------- helpers
const av = (a, cls = '', big = false) => `<span class="avatar ${cls} ${big ? 'lg' : ''}">${a.avatar}</span>`;

function header(title, back, extra = '') {
  return `<div class="header"><div class="col"><div class="hbar">${back
    ? `<button class="iconbtn" data-action="back" aria-label="Back">${ico('back')}</button>` : '<span class="sp"></span>'}<h1>${esc(title)}</h1></div>${extra}</div></div>`;
}

function keypad() {
  const k = (v, label) => `<button class="key" data-action="key" data-k="${v}" aria-label="${v === 'bk' ? 'Delete' : v}">${label || v}</button>`;
  return `<div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => k(n)).join('')}<span></span>${k(0)}${k('bk', ico('bksp', 26))}</div>`;
}

function pinPad(title) {
  return `<div class="pin-title">${esc(title)}</div><div class="pin-dots"><i></i><i></i><i></i><i></i></div>
    <div class="pin-msg">${ui.pinMsg ? `<span class="err">${esc(ui.pinMsg)}</span>` : ''}</div>${keypad()}`;
}

function tabbar(sel) {
  const t = (id, label, icon) => `<button class="tab ${sel === id ? 'on' : ''}" data-action="tab" data-to="${id}">${ico(icon)}<span>${label}</span></button>`;
  return `<nav class="tabbar"><div class="col">${t('home', 'Home', 'home')}${t('history', 'History', 'history')}${t('profile', 'Profile', 'person')}</div></nav>`;
}

function txnRow(t) {
  const cr = t.type === 'DEPOSIT';
  const sub = [txnRemark(t), fmtDateTime(t.time)].filter(Boolean).join('  •  ');
  return `<div class="txn"><span class="tic ${cr ? 'cr' : 'dr'}">${ico(cr ? 'down' : 'up', 20)}</span>
    <div class="mid"><b>${txnTitle(t)}</b><span>${esc(sub)}</span></div>
    <div class="amt"><b class="${cr ? 'cr-t' : 'dr-t'}">${cr ? '+' : '−'}${rupees(t.amount)}</b><span>Bal ${rupees(t.balanceAfter)}</span></div></div>`;
}

function showModal(html) {
  closeModal();
  const d = document.createElement('div');
  d.className = 'modal-back';
  d.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  d.addEventListener('click', (e) => { if (e.target === d) closeModal(); });
  document.body.appendChild(d);
}
function closeModal() { const m = document.querySelector('.modal-back'); if (m) m.remove(); }
function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4200);
}
function applyTheme() {
  document.documentElement.dataset.theme = db.settings.dark ? 'dark' : 'light';
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.content = db.settings.dark ? '#002E5D' : '#004C8F';
}

async function requestPersist() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      ui.persisted = (await navigator.storage.persisted()) || (await navigator.storage.persist());
    } else ui.persisted = null;
  } catch (e) { ui.persisted = null; }
}

// ---------------------------------------------------------------- navigation
function go(screen, params = {}) {
  closeModal();
  ui.screen = screen; ui.params = params; ui.pin = ''; ui.pinMsg = '';
  render();
  window.scrollTo(0, 0);
}

function goBack() {
  switch (ui.screen) {
    case 'signup':
      if (ui.su.step > 0) { ui.su.step = 0; ui.su.pin1 = ''; ui.pin = ''; ui.pinMsg = ''; render(); } else go('welcome');
      break;
    case 'select': go('welcome'); break;
    case 'login': go(db.accounts.length > 1 ? 'select' : 'welcome'); break;
    case 'money': case 'success': case 'history': case 'profile': go('home'); break;
    case 'edit': case 'delete': go('profile'); break;
    case 'backup': go(cur() ? 'profile' : 'welcome'); break;
    default: break;
  }
}

// ---------------------------------------------------------------- views
function vWelcome() {
  const has = db.accounts.length > 0;
  let install = '';
  if (!isStandalone()) {
    if (ui.deferredInstall) install = `<button class="btn soft sm" data-action="install">${ico('download', 20)} Install Piggy Bank app</button>`;
    else if (isIOS()) install = `<div class="tip"><b>On iPad / iPhone:</b> tap the <b>Share</b> button, then <b>Add to Home Screen</b>, and open Piggy Bank from there. Do this <b>before</b> creating accounts &mdash; the browser and the Home Screen app keep separate data.</div>`;
  }
  return `<div class="screen"><div class="hero"><div class="logo">${ico('bank', 60)}</div><h1>Piggy Bank</h1><p>Learn banking, the smart way</p></div>
    <div class="sheet"><div class="col pad">
      ${install}
      ${has ? '<button class="btn" data-action="to-login">Login</button><button class="btn outline" data-action="to-signup">Sign Up</button>'
            : '<button class="btn" data-action="to-signup">Sign Up</button>'}
      <button class="link" data-action="to-backup">${ico('upload', 18)} Restore from backup</button>
      <p class="note">A safe place to practise banking.<br>No real money is used.</p>
    </div></div></div>`;
}

function vSelect() {
  return `<div class="screen">${header('Login', true, '<div class="hsub">Select your profile</div>')}
    <div class="col pad list" style="flex:1">${db.accounts.map((a) => `<div class="card"><button class="prof" data-action="pick" data-id="${esc(a.id)}">${av(a)}
      <div><b>${esc(a.name)}</b><span>A/c ${maskedAcc(accountNumber(a))}</span></div>${ico('chev')}</button></div>`).join('')}</div></div>`;
}

function vLogin() {
  const a = getAccount(ui.params.id);
  if (!a) return vWelcome();
  return `<div class="screen" style="background:var(--card)">${header('Login', true,
    `<div class="who">${av(a, 'onnavy')}<div><small>Welcome back,</small><b>${esc(a.name)}</b><span>A/c ${maskedAcc(accountNumber(a))}</span></div></div>`)}
    <div class="col pad" style="flex:1;padding-top:24px">${pinPad('Enter your 4-digit MPIN')}</div></div>`;
}

function vSignup() {
  const s = ui.su;
  const titles = ['Personal details', 'Create your MPIN', 'Confirm your MPIN'];
  const top = header('Sign Up', true, `<div class="steps"><small>Step ${s.step + 1} of 3</small><b>${titles[s.step]}</b><div class="bar"><i style="width:${(s.step + 1) * 100 / 3}%"></i></div></div>`);
  if (s.step === 0) {
    return `<div class="screen">${top}<div class="col pad stack" style="flex:1">
      <div class="card cardp stack">
        <div><label class="f" for="su-name">Full Name</label><input class="in" id="su-name" maxlength="20" autocomplete="off" autocapitalize="words" placeholder="Type your name" value="${esc(s.name)}"></div>
        <div><label class="f" for="su-open">Opening Balance (optional)</label><div class="pre"><span>₹</span><input class="in" id="su-open" inputmode="numeric" maxlength="7" placeholder="0" autocomplete="off" value="${esc(s.opening)}"></div><div class="help">The amount you have right now.</div></div>
      </div>
      <div class="card cardp"><div class="sectitle">Choose your avatar</div><div class="avgrid" style="margin-top:14px">${AVATARS.map((e) => `<button class="avbtn ${e === s.avatar ? 'on' : ''}" data-action="su-avatar" data-a="${e}">${e}</button>`).join('')}</div></div>
    </div><div class="bottombar"><div class="col"><button class="btn" id="su-go" data-action="su-continue" ${s.name.trim() ? '' : 'disabled'}>Continue</button></div></div></div>`;
  }
  const t = s.step === 1 ? 'Set a 4-digit MPIN' : 'Re-enter your MPIN to confirm';
  return `<div class="screen">${top}<div class="col pad" style="flex:1"><div class="card cardp" style="padding:20px">${pinPad(t)}</div></div></div>`;
}

function vHome() {
  const a = cur();
  if (!a) return vWelcome();
  const due = a.transactions.length > 0 && (!db.settings.lastBackupAt || daysAgo(db.settings.lastBackupAt) >= 14);
  const recent = a.transactions.slice(0, 3);
  return `<div class="screen"><div class="header"><div class="col"><div class="hello">${av(a, 'onnavy')}<div><small>Welcome back,</small><b>${esc(a.name)}</b></div>
      <button class="logoff" data-action="logout">${ico('logout', 22)}<span>Log off</span></button></div><div class="hpad70"></div></div></div>
    <div class="col pad stack" style="flex:1">
      <div class="card cardp pull">
        <div class="balrow"><div><b style="font-size:14px">Savings Account</b><div class="small muted">A/c No. ${maskedAcc(accountNumber(a))}</div></div><span style="color:var(--accent)">${ico('bank', 28)}</span></div>
        <div class="xs muted" style="margin-top:18px">Available Balance</div>
        <div class="balrow"><div class="bal">${ui.balVisible ? rupees(a.balance) : '₹ ••••••'}</div><button class="eye" data-action="eye" aria-label="Show or hide balance">${ico(ui.balVisible ? 'eye' : 'eyeoff', 22)}</button></div>
      </div>
      <div class="card actions">
        <button class="act" data-action="deposit"><i>${ico('down', 26)}</i>Deposit</button>
        <button class="act" data-action="withdraw"><i>${ico('up', 26)}</i>Withdrawal</button>
        <button class="act" data-action="tab" data-to="history"><i>${ico('history', 26)}</i>History</button>
        <button class="act" data-action="tab" data-to="profile"><i>${ico('person', 26)}</i>Profile</button>
      </div>
      ${due ? `<button class="card backup-card" data-action="to-backup" style="width:100%;text-align:left;background:var(--card)"><span style="color:var(--accent)">${ico('cloud', 28)}</span><div><b>Back up your data</b><div class="small muted">${db.settings.lastBackupAt ? 'Last backup ' + daysAgo(db.settings.lastBackupAt) + ' days ago' : 'You have not made a backup yet'}. Tap to save a copy.</div></div></button>` : ''}
      <div class="rowhead"><span class="sectitle">Recent Transactions</span><button class="link" data-action="tab" data-to="history">View All</button></div>
      <div class="card">${recent.length ? recent.map((t, i) => (i ? '<div class="divider"></div>' : '') + txnRow(t)).join('') : '<div class="cardp muted small">No transactions yet. Make a deposit to get started.</div>'}</div>
    </div>${tabbar('home')}</div>`;
}

function vMoney() {
  const a = cur(), m = ui.money;
  if (!a || !m) return vHome();
  const dep = m.type === 'DEPOSIT';
  const remarks = dep ? ['Grandparents', 'Birthday Gift', 'Pocket Money', 'Gift', 'Other'] : ['Toys', 'Snacks', 'Books', 'Gift', 'Other'];
  const amount = parseInt(m.amountText || '0', 10) || 0;
  return `<div class="screen">${header(dep ? 'Deposit' : 'Withdrawal', true)}
    <div class="col pad stack" style="flex:1">
      <div class="card accrow"><span class="avatar" style="color:var(--accent)">${ico('bank', 22)}</span>
        <div class="mid"><div class="xs muted">${dep ? 'Credit to' : 'Debit from'}</div><b>Savings A/c ${accountNumber(a).slice(-4)}</b></div>
        <div class="right"><div class="xs muted">Available Balance</div><b style="color:var(--accent)">${rupees(a.balance)}</b></div></div>
      <div class="card cardp amtbox"><div class="lbl">Enter Amount</div>
        <div class="amtline"><span class="cur">₹</span><span class="num ${amount ? '' : 'zero'}" id="amtnum">${amount ? fmtNum(amount) : '0'}</span></div>
        <div class="small muted" id="amtwords">${amount ? amountWords(amount) : 'Amount in words'}</div></div>
      <div class="chips">${[10, 50, 100, 500, 1000, 2000].map((q) => `<button class="chip ${amount === q ? 'on' : ''}" data-action="qamt" data-v="${q}">${rupees(q)}</button>`).join('')}</div>
      <div class="card cardp">${keypad()}</div>
      <div class="card cardp"><div class="sectitle">${dep ? 'Remarks (received from)' : 'Remarks (purpose)'}</div>
        <div class="chips" style="margin-top:12px">${remarks.map((r) => `<button class="chip ${m.remark === r ? 'on' : ''}" data-action="remark" data-v="${esc(r)}">${esc(r)}</button>`).join('')}</div>
        <div id="cbox" style="margin-top:14px;${m.remark === 'Other' ? '' : 'display:none'}"><label class="f" for="comment">Add a comment</label>
          <input class="in" id="comment" maxlength="40" autocomplete="off" placeholder="Type your comment" value="${esc(m.comment)}"><div class="help"><span id="ccount">${m.comment.length}</span>/40</div></div>
      </div>
    </div>
    <div class="bottombar"><div class="col"><div id="merr">${m.error ? `<div class="err">${esc(m.error)}</div>` : ''}</div>
      <button class="btn" id="proceed" data-action="proceed" ${amount > 0 ? '' : 'disabled'}>Proceed</button></div></div></div>`;
}

function vSuccess() {
  const a = cur();
  const t = a && a.transactions.find((x) => x.id === ui.params.txnId);
  if (!t) return vHome();
  const dep = t.type === 'DEPOSIT', rm = txnRemark(t);
  return `<div class="screen"><div class="header"><div class="col"><div class="okmark" style="color:#fff">${ico('check', 76)}
      <div class="t">${dep ? 'Deposit' : 'Withdrawal'} Successful</div><div class="big">${rupees(t.amount)}</div></div></div></div>
    <div class="col pad" style="flex:1"><div class="card pull">
      ${rm ? `<div class="rrow"><span>Remarks</span><b>${esc(rm)}</b></div><div class="divider"></div>` : ''}
      <div class="rrow"><span>Date &amp; Time</span><b>${fmtDateTime(t.time)}</b></div><div class="divider"></div>
      <div class="rrow"><span>Reference No.</span><b>${txnRef(t)}</b></div><div class="divider"></div>
      <div class="rrow"><span>${dep ? 'Credited to' : 'Debited from'}</span><b>A/c ${maskedAcc(accountNumber(a))}</b></div><div class="divider"></div>
      <div class="rrow"><span>Available Balance</span><b>${rupees(t.balanceAfter)}</b></div></div></div>
    <div class="bottombar"><div class="col"><button class="btn" data-action="tab" data-to="home">Done</button><button class="btn outline" data-action="tab" data-to="history">View History</button></div></div></div>`;
}

function vHistory() {
  const a = cur();
  if (!a) return vWelcome();
  const dep = a.transactions.filter((t) => t.type === 'DEPOSIT').reduce((s, t) => s + t.amount, 0);
  const wd = a.transactions.filter((t) => t.type === 'WITHDRAW').reduce((s, t) => s + t.amount, 0);
  const shown = a.transactions.filter((t) => ui.hist === 'all' || (ui.hist === 'dep' ? t.type === 'DEPOSIT' : t.type === 'WITHDRAW'));
  const f = (id, label) => `<button class="chip ${ui.hist === id ? 'on' : ''}" data-action="hist-filter" data-f="${id}">${label}</button>`;
  return `<div class="screen">${header('History', false, `<div class="stats"><div><small>Total Deposits</small><b>${rupees(dep)}</b></div><div><small>Total Withdrawals</small><b>${rupees(wd)}</b></div></div>`)}
    <div class="col" style="flex:1"><div class="filters">${f('all', 'All')}${f('dep', 'Deposits')}${f('wd', 'Withdrawals')}</div>
      ${shown.length ? `<div class="list" style="padding:0 16px 16px">${shown.map((t) => `<div class="card">${txnRow(t)}</div>`).join('')}</div>`
        : `<div class="empty">${ico('history', 48)}<b>No transactions yet</b>Your deposits and withdrawals will show here.</div>`}</div>${tabbar('history')}</div>`;
}

function vProfile() {
  const a = cur();
  if (!a) return vWelcome();
  return `<div class="screen">${header('Profile', false, `<div class="center" style="padding-bottom:70px">${av(a, 'onnavy', true)}<div style="font-size:22px;font-weight:700;margin-top:8px">${esc(a.name)}</div><div class="small" style="opacity:.85">Account Holder</div></div>`)}
    <div class="col pad stack" style="flex:1">
      <div class="card pull">
        <div class="irow"><span>Account Number</span><b>${groupedAcc(accountNumber(a))}</b></div><div class="divider"></div>
        <div class="irow"><span>Account Type</span><b>Savings Account</b></div><div class="divider"></div>
        <div class="irow"><span>Currency</span><b>Indian Rupee (INR)</b></div><div class="divider"></div>
        <div class="irow"><span>Available Balance</span><b>${rupees(a.balance)}</b></div></div>
      <div class="card">
        <div class="arow">${ico('moon', 22)}<span>Dark mode</span><button class="switch ${db.settings.dark ? 'on' : ''}" data-action="dark" role="switch" aria-checked="${db.settings.dark}" aria-label="Dark mode"></button></div><div class="divider"></div>
        <button class="arow" data-action="to-backup">${ico('cloud', 22)}<span>Backup &amp; Restore</span>${ico('chev')}</button><div class="divider"></div>
        <button class="arow" data-action="to-edit">${ico('edit', 22)}<span>Edit Profile</span>${ico('chev')}</button><div class="divider"></div>
        <button class="arow" data-action="logout">${ico('logout', 22)}<span>Log off</span>${ico('chev')}</button><div class="divider"></div>
        <button class="arow red" data-action="to-delete">${ico('trash', 22)}<span>Delete Account</span>${ico('chev')}</button></div>
    </div>${tabbar('profile')}</div>`;
}

function vEdit() {
  const a = cur();
  if (!a) return vWelcome();
  return `<div class="screen">${header('Edit Profile', true)}<div class="col pad stack" style="flex:1">
    <div class="card cardp"><label class="f" for="ed-name">Full Name</label><input class="in" id="ed-name" maxlength="20" autocomplete="off" autocapitalize="words" value="${esc(ui.ed.name)}"></div>
    <div class="card cardp"><div class="sectitle">Choose your avatar</div><div class="avgrid" style="margin-top:14px">${AVATARS.map((e) => `<button class="avbtn ${e === ui.ed.avatar ? 'on' : ''}" data-action="ed-avatar" data-a="${e}">${e}</button>`).join('')}</div></div>
  </div><div class="bottombar"><div class="col"><button class="btn" id="ed-go" data-action="ed-save" ${ui.ed.name.trim() ? '' : 'disabled'}>Save Changes</button></div></div></div>`;
}

function vDelete() {
  const a = cur();
  if (!a) return vWelcome();
  return `<div class="screen">${header('Delete Account', true)}<div class="col pad stack" style="flex:1">
    <div class="card cardp center"><span style="color:var(--debit)">${ico('warn', 44)}</span><h3 style="margin:8px 0">Delete this account?</h3>
      <p class="small muted" style="line-height:1.5">The account of ${esc(a.name)}, its balance of ${rupees(a.balance)} and all transactions will be permanently deleted from this device. This cannot be undone &mdash; make a backup first if you may need it.</p></div>
    <div class="card cardp" style="padding:20px">${pinPad('Enter your MPIN to confirm')}</div></div></div>`;
}

function vBackup() {
  const a = cur(), share = canShareFiles(), last = db.settings.lastBackupAt;
  const storageTxt = ui.persisted === true ? 'Protected &mdash; the browser will not clear Piggy Bank&rsquo;s data on its own.'
    : ui.persisted === false ? 'Not protected &mdash; the browser may clear data if the device runs low on space. Install the app and keep backups.'
    : 'Cannot be checked in this browser &mdash; keep regular backups.';
  const safety = `<div class="card cardp bk"><h3>Safety check</h3>
    <div class="stat"><span class="dot ${last ? (daysAgo(last) < 14 ? 'ok' : 'no') : 'no'}"></span><div><b>Last full backup:</b> ${last ? (daysAgo(last) === 0 ? 'today' : daysAgo(last) + ' days ago') + ' (' + fmtDate(last) + ')' : 'never &mdash; please make one now'}</div></div>
    <div class="stat"><span class="dot ${ui.persisted === true ? 'ok' : ui.persisted === false ? 'no' : 'na'}"></span><div><b>Browser storage:</b> ${storageTxt}</div></div>
    <div class="stat"><span class="dot ${isStandalone() ? 'ok' : 'no'}"></span><div><b>Installed as an app:</b> ${isStandalone() ? 'yes' : 'no &mdash; you are in the browser. Install it (Add to Home Screen / Install) for safer storage.'}</div></div></div>`;
  const shareBtn = (act, label) => (share ? `<button class="btn" data-action="${act}">${ico('share', 20)} ${label}</button>` : '');
  const full = `<div class="card cardp bk"><h3>Full app backup</h3>
    <p>Everything on this device: <b>every profile</b> with its MPIN, balance, full history and comments. Use it to move to another phone, iPad or PC, or as a safety copy. Keep the file private.</p>
    ${db.accounts.length ? `${shareBtn('save-full', 'Save / Share (Google Drive, Files&hellip;)')}<button class="btn ${share ? 'outline' : ''}" data-action="dl-full">${ico('download', 20)} Download backup file</button>` : '<div class="note">Nothing to back up yet.</div>'}
    <div class="divider" style="margin:16px 0"></div>
    <button class="btn soft" data-action="pick-full">${ico('upload', 20)} Restore from full backup&hellip;</button>
    <input type="file" id="f-full" accept=".json,application/json,text/plain" hidden></div>`;
  const hist = a ? `<div class="card cardp bk"><h3>${esc(a.name)}&rsquo;s transaction history</h3>
    <p>Only this person&rsquo;s transactions and comments &mdash; not the profile or MPIN. Importing adds transactions that are missing (nothing is duplicated).</p>
    ${shareBtn('save-hist', 'Save / Share history')}<button class="btn ${share ? 'outline' : ''}" data-action="dl-hist">${ico('download', 20)} Download history (.json)</button>
    <button class="btn outline" data-action="csv-hist">${ico('download', 20)} Download for Excel / Sheets (.csv)</button>
    <div class="divider" style="margin:16px 0"></div>
    <button class="btn soft" data-action="pick-hist">${ico('upload', 20)} Import history&hellip;</button>
    <input type="file" id="f-hist" accept=".json,application/json,text/plain" hidden></div>` : '';
  const how = `<div class="card cardp bk"><h3>Moving to a new device?</h3><p style="margin:0">1. Here: <b>Save / Share</b> a full backup to Google Drive, iCloud or email it to yourself.<br>2. On the new device open Piggy Bank and tap <b>Restore from backup</b>.<br>3. Choose that file. All profiles, MPINs and history come across.</p></div>`;
  const undo = hasUndo() ? `<button class="btn outline" data-action="undo-import">Undo last import / restore</button>` : '';
  return `<div class="screen">${header('Backup & Restore', true)}<div class="col pad stack" style="flex:1">${safety}${full}${hist}${how}${undo}</div></div>`;
}

const VIEWS = {
  welcome: vWelcome, select: vSelect, login: vLogin, signup: vSignup, home: vHome, money: vMoney,
  success: vSuccess, history: vHistory, profile: vProfile, edit: vEdit, delete: vDelete, backup: vBackup,
};

function render() {
  const view = VIEWS[ui.screen] || vWelcome;
  document.getElementById('app').innerHTML = view();
  applyTheme();
  ui.onPin = PIN_HANDLERS[ui.screen] || null;
  if (ui.screen === 'backup') requestPersist().then(() => { /* status refreshes on next render */ });
}

// ---------------------------------------------------------------- PIN flows
const PIN_HANDLERS = {
  login(pin) {
    const a = getAccount(ui.params.id);
    if (a && hashPin(pin, a.salt) === a.pinHash) { ui.currentId = a.id; ui.balVisible = true; requestPersist(); go('home'); }
    else { ui.pinMsg = 'Incorrect MPIN. Please try again.'; render(); }
  },
  delete(pin) {
    const a = cur();
    if (a && hashPin(pin, a.salt) === a.pinHash) {
      db.accounts = db.accounts.filter((x) => x.id !== a.id);
      saveDb(); ui.currentId = null; toast('Account deleted.'); go('welcome');
    } else { ui.pinMsg = 'Incorrect MPIN. Please try again.'; render(); }
  },
  signup(pin) {
    const s = ui.su;
    if (s.step === 1) { s.pin1 = pin; s.step = 2; ui.pinMsg = ''; render(); return; }
    if (pin === s.pin1) {
      const acc = createAccount(s.name, s.avatar, parseInt(s.opening || '0', 10) || 0, pin);
      ui.currentId = acc.id; ui.balVisible = true; requestPersist(); go('home');
    } else { s.step = 1; s.pin1 = ''; ui.pinMsg = 'The MPINs did not match. Please try again.'; render(); }
  },
};
const usesPin = () => ui.screen === 'login' || ui.screen === 'delete' || (ui.screen === 'signup' && ui.su.step > 0);

function updateDots() {
  document.querySelectorAll('.pin-dots i').forEach((d, i) => d.classList.toggle('on', i < ui.pin.length));
}

function onKey(k) {
  if (ui.screen === 'money') return moneyKey(k);
  if (!usesPin()) return;
  if (k === 'bk') { ui.pin = ui.pin.slice(0, -1); updateDots(); return; }
  if (ui.pin.length >= 4) return;
  ui.pin += k; updateDots();
  if (ui.pin.length === 4) {
    const p = ui.pin;
    setTimeout(() => { ui.pin = ''; if (ui.onPin) ui.onPin(p); }, 140);
  }
}

// ---------------------------------------------------------------- money screen
function moneyAmount() { return parseInt(ui.money.amountText || '0', 10) || 0; }

function updateMoneyDom() {
  const amt = moneyAmount();
  const num = $('#amtnum');
  num.textContent = amt ? fmtNum(amt) : '0';
  num.classList.toggle('zero', !amt);
  $('#amtwords').textContent = amt ? amountWords(amt) : 'Amount in words';
  $('#proceed').disabled = !(amt > 0);
  $('#merr').innerHTML = '';
  ui.money.error = '';
  document.querySelectorAll('[data-action="qamt"]').forEach((c) => c.classList.toggle('on', parseInt(c.dataset.v, 10) === amt));
}

function moneyKey(k) {
  const m = ui.money;
  if (k === 'bk') m.amountText = m.amountText.slice(0, -1);
  else if (m.amountText.length < 7 && !(m.amountText === '' && k === '0')) m.amountText += k;
  updateMoneyDom();
}

function remarkValue() {
  const m = ui.money;
  return m.remark === 'Other' ? (m.comment.trim() || 'Other') : m.remark;
}

function askConfirmMoney() {
  const a = cur(), m = ui.money, amt = moneyAmount(), dep = m.type === 'DEPOSIT';
  if (!dep && amt > a.balance) {
    m.error = `Insufficient balance. Available balance is ${rupees(a.balance)}.`;
    $('#merr').innerHTML = `<div class="err">${esc(m.error)}</div>`;
    return;
  }
  showModal(`<h2>Confirm ${dep ? 'Deposit' : 'Withdrawal'}</h2>
    <div class="kv"><span>Amount</span><b>${rupees(amt)}</b></div>
    <div class="kv"><span>${dep ? 'Credit to' : 'Debit from'}</span><b>Savings A/c ${accountNumber(a).slice(-4)}</b></div>
    <div class="kv"><span>Remarks</span><b>${esc(remarkValue() || '—')}</b></div>
    <p class="xs muted" style="margin-top:8px">${amountWords(amt)}</p>
    <div class="btnrow" style="margin-top:16px"><button class="btn outline sm" data-action="modal-close">Cancel</button><button class="btn sm" data-action="confirm-money">Confirm</button></div>`);
}

// ---------------------------------------------------------------- files: backup / restore
async function outputFile(name, text, { share, markFull, mime }) {
  let done = false;
  if (share) {
    const r = await shareFile(name, text);
    if (r === 'cancelled') return;
    if (r === 'shared') done = true;
    else { downloadFile(name, text, mime); done = true; toast('Sharing is not available here, so the file was downloaded.'); }
  } else {
    downloadFile(name, text, mime); done = true; toast('Saved. Look in your Downloads / Files app.');
  }
  if (done && markFull) { db.settings.lastBackupAt = Date.now(); saveDb(); render(); }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error('The file could not be read.'));
    r.readAsText(file);
  });
}

function problem(msg) {
  showModal(`<h2>Can&rsquo;t use this file</h2><p class="muted" style="line-height:1.5">${esc(msg)}</p><button class="btn" data-action="modal-close">OK</button>`);
}

async function handleFile(input) {
  const file = input.files && input.files[0];
  const which = input.id;
  input.value = '';
  if (!file) return;
  try {
    const parsed = parseBackupText(await readFile(file));
    if (which === 'f-full') {
      if (parsed.kind !== 'full') throw new Error('That is a single-person history file. Open the right person\'s Backup & Restore screen and use "Import history" instead.');
      ui.pending = { parsed, name: file.name };
      showFullPreview();
    } else {
      if (parsed.kind !== 'history') throw new Error('That is a full app backup. Use "Restore from full backup" instead.');
      ui.pending = { parsed, name: file.name };
      showHistoryPreview();
    }
  } catch (e) { problem(e.message); }
}

function integrityBlock(p) {
  if (p.checksumOk === true) return '<div class="good">&#10003; File is intact (checksum verified).</div>';
  if (p.checksumOk === false) return '<div class="warn">This file does not match its checksum &mdash; it may be damaged or was edited. Only continue if you trust it.</div>';
  return '<div class="tip" style="margin:10px 0">Plain accounts file (no checksum).</div>';
}

function showFullPreview() {
  const p = ui.pending.parsed, list = describeFull(p), has = db.accounts.length > 0;
  if (!list.length) return problem('This backup does not contain any profiles.');
  showModal(`<h2>Restore full backup</h2>
    <div class="kv"><span>File</span><b>${esc(ui.pending.name)}</b></div>
    ${p.exportedAt ? `<div class="kv"><span>Saved on</span><b>${esc(fmtDateTime(Date.parse(p.exportedAt)))}</b></div>` : ''}
    <div class="kv"><span>Profiles in file</span><b>${list.length}</b></div>
    ${integrityBlock(p)}${p.skipped ? `<div class="warn">${p.skipped} damaged profile(s) in the file will be skipped.</div>` : ''}
    ${list.map((x) => `<div class="pl"><span class="avatar">${x.avatar}</span><div><b>${esc(x.name)}</b>${x.onDevice ? '<span class="tag">already here</span>' : ''}<div class="xs muted">A/c ${maskedAcc(x.account)}</div></div><div class="r"><b>${rupees(x.balance)}</b><div class="xs muted">${x.count} transaction${x.count === 1 ? '' : 's'}</div></div></div>`).join('')}
    ${has ? `<p class="small muted" style="margin-top:12px;line-height:1.5"><b>Replace</b> removes what is on this device now and uses the file. <b>Merge</b> keeps this device&rsquo;s profiles and only adds what is missing. You can undo once.</p>
      <button class="btn danger" data-action="apply-full" data-mode="replace">Replace everything on this device</button>
      <button class="btn" data-action="apply-full" data-mode="merge">Merge &mdash; add what&rsquo;s missing</button>`
      : '<button class="btn" data-action="apply-full" data-mode="replace">Restore</button>'}
    <button class="btn outline" data-action="modal-close">Cancel</button>`);
}

function showHistoryPreview() {
  const a = cur(), p = ui.pending.parsed, d = describeHistory(p, a);
  if (!d.total) return problem('This history file does not contain any valid transactions.');
  const owner = p.owner ? `${esc(p.owner.name || 'Unknown')}${p.owner.accountNumber ? ' (A/c ' + maskedAcc(p.owner.accountNumber) + ')' : ''}` : 'Unknown';
  showModal(`<h2>Import history</h2>
    <div class="kv"><span>File</span><b>${esc(ui.pending.name)}</b></div>
    <div class="kv"><span>History of</span><b>${owner}</b></div>
    <div class="kv"><span>Importing into</span><b>${esc(a.name)}</b></div>
    <div class="kv"><span>Transactions in file</span><b>${d.total}</b></div>
    <div class="kv"><span>New (will be added)</span><b>${d.fresh}</b></div>
    <div class="kv"><span>Already here (skipped)</span><b>${d.duplicates}</b></div>
    ${integrityBlock(p)}
    ${p.dropped ? `<div class="warn">${p.dropped} invalid entr${p.dropped === 1 ? 'y' : 'ies'} will be ignored.</div>` : ''}
    ${d.sameProfile ? '' : `<div class="warn">This history belongs to a different profile. Make sure you want it added to <b>${esc(a.name)}</b>.</div>`}
    <p class="small muted" style="line-height:1.5"><b>Replace</b> swaps ${esc(a.name)}&rsquo;s whole history for the file. Balances are recalculated either way. You can undo once.</p>
    <button class="btn" data-action="apply-hist" data-mode="merge">Add the ${d.fresh} new transaction${d.fresh === 1 ? '' : 's'}</button>
    <button class="btn danger" data-action="apply-hist" data-mode="replace">Replace history with this file</button>
    <button class="btn outline" data-action="modal-close">Cancel</button>`);
}

// ---------------------------------------------------------------- actions
const ACTIONS = {
  'modal-close': () => closeModal(),
  back: () => goBack(),
  key: (d) => onKey(d.k),
  install: async () => {
    const p = ui.deferredInstall;
    if (!p) return;
    p.prompt();
    try { await p.userChoice; } catch (e) { /* ignore */ }
    ui.deferredInstall = null; render();
  },

  'to-login': () => (db.accounts.length === 1 ? go('login', { id: db.accounts[0].id }) : go('select')),
  'to-signup': () => { ui.su = { step: 0, name: '', avatar: AVATARS[0], opening: '', pin1: '' }; go('signup'); },
  'to-backup': () => go('backup'),
  pick: (d) => go('login', { id: d.id }),
  logout: () => { ui.currentId = null; ui.money = null; go('welcome'); },

  'su-avatar': (d) => {
    ui.su.avatar = d.a;
    document.querySelectorAll('[data-action="su-avatar"]').forEach((b) => b.classList.toggle('on', b.dataset.a === d.a));
  },
  'su-continue': () => { if (ui.su.name.trim()) { ui.su.step = 1; ui.pin = ''; ui.pinMsg = ''; render(); window.scrollTo(0, 0); } },

  eye: () => { ui.balVisible = !ui.balVisible; render(); },
  tab: (d) => go(d.to),
  deposit: () => { ui.money = { type: 'DEPOSIT', amountText: '', remark: '', comment: '', error: '' }; go('money'); },
  withdraw: () => { ui.money = { type: 'WITHDRAW', amountText: '', remark: '', comment: '', error: '' }; go('money'); },
  qamt: (d) => { ui.money.amountText = String(d.v); updateMoneyDom(); },
  remark: (d) => {
    const m = ui.money;
    m.remark = m.remark === d.v ? '' : d.v;
    document.querySelectorAll('[data-action="remark"]').forEach((c) => c.classList.toggle('on', c.dataset.v === m.remark));
    const box = $('#cbox');
    box.style.display = m.remark === 'Other' ? '' : 'none';
    if (m.remark === 'Other') { const i = $('#comment'); i.focus(); box.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  },
  proceed: () => { if (moneyAmount() > 0) askConfirmMoney(); },
  'confirm-money': () => {
    const a = cur(), m = ui.money, out = {};
    const err = transact(a, m.type, moneyAmount(), remarkValue(), out);
    closeModal();
    if (err) { m.error = err; const e = $('#merr'); if (e) e.innerHTML = `<div class="err">${esc(err)}</div>`; return; }
    ui.money = null;
    go('success', { txnId: out.txn.id });
  },

  'hist-filter': (d) => { ui.hist = d.f; render(); },
  dark: () => { db.settings.dark = !db.settings.dark; saveDb(); render(); },
  'to-edit': () => { const a = cur(); ui.ed = { name: a.name, avatar: a.avatar }; go('edit'); },
  'ed-avatar': (d) => {
    ui.ed.avatar = d.a;
    document.querySelectorAll('[data-action="ed-avatar"]').forEach((b) => b.classList.toggle('on', b.dataset.a === d.a));
  },
  'ed-save': () => {
    const a = cur(), n = ui.ed.name.trim();
    if (!n) return;
    a.name = n.slice(0, 20); a.avatar = ui.ed.avatar; saveDb(); toast('Profile updated.'); go('profile');
  },
  'to-delete': () => go('delete'),

  'save-full': () => outputFile(`PiggyBank-FullBackup-${stamp()}.json`, buildFullBackup(), { share: true, markFull: true }),
  'dl-full': () => outputFile(`PiggyBank-FullBackup-${stamp()}.json`, buildFullBackup(), { share: false, markFull: true }),
  'pick-full': () => $('#f-full').click(),
  'save-hist': () => { const a = cur(); outputFile(`PiggyBank-History-${safeName(a.name)}-${stamp()}.json`, buildHistoryFile(a), { share: true }); },
  'dl-hist': () => { const a = cur(); outputFile(`PiggyBank-History-${safeName(a.name)}-${stamp()}.json`, buildHistoryFile(a), { share: false }); },
  'csv-hist': () => { const a = cur(); outputFile(`PiggyBank-History-${safeName(a.name)}-${stamp()}.csv`, buildHistoryCsv(a), { share: false, mime: 'text/csv' }); },
  'pick-hist': () => $('#f-hist').click(),

  'apply-full': (d) => {
    const msg = applyFull(ui.pending.parsed, d.mode);
    ui.pending = null; closeModal(); applyTheme();
    if (d.mode === 'replace' || !cur()) { ui.currentId = null; go('welcome'); toast(msg + ' Please log in.'); }
    else { render(); toast(msg); }
  },
  'apply-hist': (d) => {
    const res = applyHistory(ui.pending.parsed, cur(), d.mode);
    closeModal();
    if (res.error) return problem(res.error);
    ui.pending = null; render(); toast(res.summary);
  },
  'undo-import': () => {
    if (undoLastImport()) {
      if (!cur()) ui.currentId = null;
      applyTheme(); toast('Last import undone.'); cur() ? render() : go('welcome');
    }
  },
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.action];
  if (fn) fn(el.dataset, el, e);
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.id === 'su-name') {
    ui.su.name = t.value;
    $('#su-go').disabled = !t.value.trim();
  } else if (t.id === 'su-open') {
    t.value = t.value.replace(/\D/g, '').slice(0, 7).replace(/^0+(?=\d)/, '');
    ui.su.opening = t.value;
  } else if (t.id === 'ed-name') {
    ui.ed.name = t.value;
    $('#ed-go').disabled = !t.value.trim();
  } else if (t.id === 'comment') {
    ui.money.comment = t.value;
    $('#ccount').textContent = t.value.length;
  }
});

document.addEventListener('change', (e) => {
  if (e.target.type === 'file') handleFile(e.target);
});

document.addEventListener('keydown', (e) => {
  if (document.querySelector('.modal-back') || e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (document.activeElement && document.activeElement.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (/^[0-9]$/.test(e.key)) onKey(e.key);
  else if (e.key === 'Backspace') onKey('bk');
});

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  ui.deferredInstall = e;
  if (ui.screen === 'welcome') render();
});

// Browser / Android back button follows the app's own screens.
history.replaceState({ pb: 0 }, '');
history.pushState({ pb: 1 }, '');
window.addEventListener('popstate', () => {
  if (document.querySelector('.modal-back')) { closeModal(); history.pushState({ pb: 1 }, ''); return; }
  if (ui.screen === 'welcome' || ui.screen === 'home') return;
  goBack();
  history.pushState({ pb: 1 }, '');
});

// ---------------------------------------------------------------- start
applyTheme();
render();
requestPersist();
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
}
