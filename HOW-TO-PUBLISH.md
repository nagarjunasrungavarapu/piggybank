# Piggy Bank (web app): publish it for free and use it on any device

This folder is the complete app. It needs **no build step**: any free static web host will do.
Once it is on the internet you open the link on a PC, Android phone/tablet, iPhone or iPad,
and "install" it so it gets its own icon and its own protected storage.

## 1. Try it on your own PC first (optional)
Open a terminal in this folder and run:  `python -m http.server 8090`  then browse to http://localhost:8090

## 2. Publish for free (pick ONE)

### Option A - Netlify Drop (easiest, drag and drop)
1. Go to https://app.netlify.com/drop and sign up (free).
2. Drag this whole folder (the one that contains `index.html`) onto the page.
3. You get an address like `https://something-random.netlify.app`. In Site settings you can rename it
   (e.g. `my-piggybank`). **Pick the final name now and never change it** (see "Important" below).

### Option B - GitHub Pages
1. Create a free GitHub account and a **public** repository called `piggybank`.
2. Upload everything in this folder (so `index.html` is at the top level).
3. Settings -> Pages -> Build and deployment -> Source: "Deploy from a branch" -> Branch: `main` / root -> Save.
4. After a minute it is live at `https://YOURNAME.github.io/piggybank/`.

(Cloudflare Pages and Vercel work the same way if you prefer them.)

## 3. Install it on each device (do this BEFORE creating accounts)
* **iPad / iPhone (Safari):** open the link -> Share button -> **Add to Home Screen** -> open Piggy Bank from the new icon.
  The Safari tab and the Home Screen icon keep SEPARATE data, so always use the icon.
* **Android (Chrome):** open the link -> tap **Install app** (or menu -> Install app / Add to Home screen).
* **PC (Chrome or Edge):** open the link -> install icon in the address bar -> Install.

## 4. Backups (the important part)
Profile -> **Backup & Restore**
* **Full app backup**: all profiles, MPINs, balances, history and comments in one file. Save it to Google Drive /
  iCloud / email. To move to a new device: install the app there -> **Restore from backup** (on the first screen)
  -> pick the file. Choose *Replace* (make it identical) or *Merge* (add what is missing).
* **One person's history**: export that person's transactions (.json to move between devices, or .csv to open in Excel).
  *Import history* adds only the missing transactions (no duplicates) and recalculates the balance; you can also
  choose *Replace*.
* The app reminds you on the Home screen if the last full backup is older than 14 days.
* Every import can be undone once ("Undo last import / restore").
* Backup files contain MPIN fingerprints (not the PINs themselves). Keep them private.

## Important
* Data belongs to the **web address**. If you change the address (rename the site, move host) the app starts empty -
  restore from a backup file to bring everything over.
* Browsers can clear website data (clearing history, "private" windows, very low storage). Installing the app and
  keeping a backup file are what protect you. Make a backup after big changes.
* To publish an update, upload the new files to the same site. Open the app twice to pick up the new version.
