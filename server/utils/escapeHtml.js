/**
 * Escapes user-supplied strings before embedding them in HTML (e.g. email bodies).
 * Prevents HTML injection / phishing via email templates.
 */
const escapeHtml = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

module.exports = { escapeHtml };
