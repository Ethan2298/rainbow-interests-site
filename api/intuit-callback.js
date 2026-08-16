const MAX_VALUE_LENGTH = 4096;
const STATE_PATTERN = /^[0-9a-f]{32}$/;
const REALM_ID_PATTERN = /^\d{1,32}$/;
const ALLOWED_OAUTH_ERRORS = new Set([
  "access_denied",
  "invalid_request",
  "invalid_scope",
  "server_error",
  "temporarily_unavailable",
  "unauthorized_client",
  "unsupported_response_type",
]);

function getQueryString(request, key) {
  const value = request.query?.[key];
  return typeof value === "string" ? value : null;
}

module.exports = function handler(request, response) {
  response.setHeader("Cache-Control", "no-store, no-cache, max-age=0");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("X-Content-Type-Options", "nosniff");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).end();
    return;
  }

  const state = getQueryString(request, "state");
  const code = getQueryString(request, "code");
  const realmId = getQueryString(request, "realmId");
  const error = getQueryString(request, "error");

  if (!state || !STATE_PATTERN.test(state)) {
    response.status(400).end();
    return;
  }

  const hasSuccess = Boolean(
    code &&
      code.length <= MAX_VALUE_LENGTH &&
      realmId &&
      REALM_ID_PATTERN.test(realmId) &&
      !error,
  );
  const hasError = Boolean(
    error && ALLOWED_OAUTH_ERRORS.has(error) && !code && !realmId,
  );

  if (hasSuccess === hasError) {
    response.status(400).end();
    return;
  }

  const forwarded = new URLSearchParams({ state });
  if (hasSuccess) {
    forwarded.set("code", code);
    forwarded.set("realmId", realmId);
  } else {
    forwarded.set("error", error);
  }

  const target = `http://localhost:9477/api/intuit-callback?${forwarded.toString()}`;
  response.setHeader("Location", target);
  response.status(302).end();
};
