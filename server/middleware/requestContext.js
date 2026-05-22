const crypto = require('crypto');

// Only accept a canonical UUID v4 string from the client.
// Any other value (including log-injection payloads with newlines, ANSI
// codes, etc.) is discarded and replaced with a server-generated UUID.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const requestContext = (req, res, next) => {
  const incoming = req.headers['x-request-id'];
  const requestId =
    typeof incoming === 'string' && UUID_RE.test(incoming)
      ? incoming
      : crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
};

module.exports = { requestContext };

