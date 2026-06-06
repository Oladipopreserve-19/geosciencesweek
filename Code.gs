/* ============================================================
   Geosciences Week 2026 — Registration backend (Google Apps Script)
   ------------------------------------------------------------
   What it does on each form submission:
     1. Appends a row to your Google Sheet.
     2. Sends a personalized confirmation email to the registrant,
        with the event flyer embedded at the bottom (footer).

   SETUP (do this once — see README.md for screenshots/steps):
     - Set SHEET_ID below (already filled from your sheet link).
     - Upload the flyer image to Google Drive, then set FLYER_FILE_ID.
     - Deploy: Deploy > New deployment > Web app
         Execute as:  Me (geoscienceweek@gmail.com)
         Who has access:  Anyone
     - Copy the Web App URL into script.js (SCRIPT_URL).
   ============================================================ */

// ---- CONFIG -------------------------------------------------
const SHEET_ID = "15ebX7XTrpOT0zhj1As8eVYigul_pkVZZWxaQGE33_50";
const SHEET_NAME = "Sheet1"; // change if your tab has a different name

// Google Drive file ID of the flyer image (jpg/png).
// Get it from the share link: drive.google.com/file/d/<THIS_PART>/view
const FLYER_FILE_ID = "PASTE_FLYER_DRIVE_FILE_ID_HERE";

const EVENT_NAME = "Geosciences Week 2026";
const EVENT_DATES = "22nd – 25th June 2026";
const EVENT_VENUE = "University of Ilorin, Geology Lecture Theater";
const REPLY_TO = "geoscienceweek@gmail.com";
// ------------------------------------------------------------

/**
 * Receives the POST from the registration form.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    saveToSheet(data);
    sendConfirmationEmail(data);

    return jsonResponse({ status: "success" });
  } catch (err) {
    console.error(err);
    return jsonResponse({ status: "error", message: String(err) });
  }
}

/** Simple health check when the URL is opened in a browser. */
function doGet() {
  return jsonResponse({ status: "ok", service: EVENT_NAME + " registration" });
}

function saveToSheet(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

  // Add a header row the first time.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "First Name",
      "Last Name",
      "Matric Number",
      "Level",
      "Department",
      "Email",
      "Phone",
    ]);
  }

  sheet.appendRow([
    new Date(),
    data.firstName || "",
    data.lastName || "",
    data.matricNumber || "",
    data.level || "",
    data.department || "",
    data.email || "",
    data.phone || "",
  ]);
}

function sendConfirmationEmail(data) {
  if (!data.email) return;

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const subject = "You're registered for " + EVENT_NAME + " 🎉";

  const inlineImages = {};
  let flyerHtml = "";
  if (FLYER_FILE_ID && FLYER_FILE_ID.indexOf("PASTE_") === -1) {
    try {
      const flyer = DriveApp.getFileById(FLYER_FILE_ID).getBlob();
      inlineImages.flyer = flyer;
      flyerHtml =
        '<tr><td style="padding-top:24px;">' +
        '<img src="cid:flyer" alt="' +
        EVENT_NAME +
        ' flyer" style="display:block;width:100%;max-width:600px;border-radius:12px;" />' +
        "</td></tr>";
    } catch (err) {
      console.error("Could not load flyer: " + err);
    }
  }

  const htmlBody =
    '<div style="font-family:Inter,Arial,Helvetica,sans-serif;color:#1d1d1d;max-width:600px;margin:0 auto;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0">' +
    '<tr><td style="background:#111;color:#fff;padding:24px 28px;border-radius:12px 12px 0 0;">' +
    '<div style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#1ec98f;font-weight:700;">Nigerian Mining &amp; Geosciences Society</div>' +
    '<div style="font-size:26px;font-weight:800;margin-top:6px;">' + EVENT_NAME + "</div>" +
    "</td></tr>" +
    '<tr><td style="background:#fff;border:1px solid #eee;border-top:none;padding:28px;border-radius:0 0 12px 12px;">' +
    '<p style="font-size:16px;margin:0 0 14px;">Hi <strong>' + escapeHtml(data.firstName || "there") + "</strong>,</p>" +
    '<p style="font-size:15px;line-height:1.6;margin:0 0 18px;">Thank you for registering for <strong>' + EVENT_NAME +
    "</strong>. Your spot is confirmed! Here are your details:</p>" +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.8;margin:0 0 18px;">' +
    row("Name", fullName) +
    row("Matric Number", data.matricNumber) +
    row("Level", data.level) +
    row("Department", data.department) +
    row("Phone", data.phone) +
    "</table>" +
    '<div style="background:#f4f5f4;border-radius:10px;padding:16px 18px;font-size:14px;line-height:1.7;margin:0 0 8px;">' +
    "<strong>📅 Dates:</strong> " + EVENT_DATES + "<br/>" +
    "<strong>📍 Venue:</strong> " + EVENT_VENUE + "<br/>" +
    "<strong>🎯 Theme:</strong> Geoscience Beyond Boundaries: Innovation for a Sustainable Future" +
    "</div>" +
    '<p style="font-size:14px;line-height:1.6;margin:18px 0 0;color:#555;">We look forward to seeing you there!<br/>— The ' +
    EVENT_NAME + " Team</p>" +
    flyerHtml +
    "</td></tr>" +
    "</table>" +
    '<p style="font-size:12px;color:#999;text-align:center;margin:18px 0;">For any info: Mustapha Lukman +2347058391388 · Abayomi Gideon +2348028306405</p>' +
    "</div>";

  GmailApp.sendEmail(data.email, subject, plainTextBody(data, fullName), {
    htmlBody: htmlBody,
    inlineImages: inlineImages,
    name: EVENT_NAME,
    replyTo: REPLY_TO,
  });
}

function plainTextBody(data, fullName) {
  return (
    "Hi " + (data.firstName || "there") + ",\n\n" +
    "Thank you for registering for " + EVENT_NAME + ". Your spot is confirmed!\n\n" +
    "Name: " + fullName + "\n" +
    "Matric Number: " + (data.matricNumber || "") + "\n" +
    "Level: " + (data.level || "") + "\n" +
    "Department: " + (data.department || "") + "\n" +
    "Phone: " + (data.phone || "") + "\n\n" +
    "Dates: " + EVENT_DATES + "\n" +
    "Venue: " + EVENT_VENUE + "\n\n" +
    "We look forward to seeing you there!\n— The " + EVENT_NAME + " Team"
  );
}

function row(label, value) {
  if (!value) return "";
  return (
    '<tr><td style="color:#888;padding-right:16px;white-space:nowrap;">' +
    escapeHtml(label) +
    '</td><td style="font-weight:600;">' +
    escapeHtml(String(value)) +
    "</td></tr>"
  );
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
