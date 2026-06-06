# Geosciences Week 2026 — Registration Site

A registration website for **Geosciences Week 2026** (University of Ilorin, 22nd–25th June 2026).

Registrants fill a form (first name, last name, matric number, level, department, email, phone). On submit:

1. The data is saved to your **Google Sheet**.
2. They are taken to a **success page**.
3. A **personalized confirmation email** is sent to them, with the **event flyer embedded at the bottom (footer)**.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The registration form |
| `success.html` | The "you're registered" page |
| `styles.css` | Styling (themed to match the flyer) |
| `script.js` | Form logic — **paste your Web App URL here** |
| `Code.gs` | Google Apps Script backend (saves to Sheet + sends email) |

---

## Setup (one time)

Do everything below while logged in as **geoscienceweek@gmail.com** (the sender + Sheet owner).

### 1. Prepare the Google Sheet
- Open your sheet: <https://docs.google.com/spreadsheets/d/15ebX7XTrpOT0zhj1As8eVYigul_pkVZZWxaQGE33_50>
- Make sure the tab name matches `SHEET_NAME` in `Code.gs` (default `Sheet1`). The header row is created automatically on the first registration.

### 2. Upload the flyer to Google Drive
- Upload the flyer image (`.jpg` or `.png`) to Google Drive.
- Right-click it → **Share** → set "Anyone with the link" → **Viewer** (so the script can read it).
- Copy the link. It looks like:
  `https://drive.google.com/file/d/`**`1AbC...xyz`**`/view`
- Copy the bold middle part — that's the **file ID**.

### 3. Create the Apps Script
- Go to <https://script.google.com> → **New project**.
- Delete the default code and paste the contents of `Code.gs`.
- At the top, set:
  - `FLYER_FILE_ID` = the file ID from step 2.
  - (`SHEET_ID` is already filled in from your sheet link.)
- Save.

### 4. Deploy as a Web App
- Click **Deploy → New deployment**.
- Click the gear ⚙ → choose **Web app**.
- Settings:
  - **Description:** Geosciences Week registration
  - **Execute as:** **Me (geoscienceweek@gmail.com)**
  - **Who has access:** **Anyone**
- Click **Deploy**, then **Authorize access** and approve the permissions
  (it needs access to your Sheet, Gmail, and Drive).
- Copy the **Web app URL** (ends in `/exec`).

### 5. Connect the front-end
- Open `script.js`.
- Replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with the Web app URL.

### 6. Host the website (free)
Pick one:

**GitHub Pages**
- Push these files to a GitHub repo.
- Repo → **Settings → Pages** → Source: `main` branch, `/root` → Save.
- Your site goes live at `https://<username>.github.io/<repo>/`.

**Netlify (drag & drop)**
- Go to <https://app.netlify.com/drop> and drag this folder in.

---

## Testing
1. Open the live site, fill the form, submit.
2. You should land on the success page.
3. Check the Google Sheet — a new row appears.
4. Check the registrant's inbox — the confirmation email arrives with the flyer at the bottom.

> Tip: emails may take a few seconds. Daily Gmail send limit on a free account is ~500 emails/day, which is plenty for an event like this.

## Updating the backend later
Whenever you edit `Code.gs`, you must re-deploy:
**Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.**
The Web App URL stays the same.

## Troubleshooting
- **"Setup incomplete" error on submit** → you didn't paste the URL into `script.js`.
- **Row saved but no email** → check `FLYER_FILE_ID` is set and the flyer is shared as "Anyone with the link"; check the Apps Script **Executions** log for errors.
- **Nothing happens at all** → re-check the deployment is "Anyone" access and you copied the `/exec` URL (not `/dev`).
