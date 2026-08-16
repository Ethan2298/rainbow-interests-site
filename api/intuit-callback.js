const ALLOWED_PARAMS = ["code", "state", "realmId", "error", "error_description"];
const MAX_VALUE_LENGTH = 4096;

module.exports = function handler(request, response) {
  const forwarded = new URLSearchParams();

  for (const key of ALLOWED_PARAMS) {
    const value = request.query[key];
    if (typeof value === "string" && value.length <= MAX_VALUE_LENGTH) {
      forwarded.set(key, value);
    }
  }

  const hasState = forwarded.has("state");
  const hasSuccess = forwarded.has("code") && forwarded.has("realmId");
  const hasError = forwarded.has("error");

  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Referrer-Policy", "no-referrer");

  if (!hasState || (!hasSuccess && !hasError)) {
    response.status(400).end();
    return;
  }

  const target = `http://localhost:9477/api/intuit-callback?${forwarded.toString()}`;
  response.setHeader("Location", target);
  response.status(302).end();
};
