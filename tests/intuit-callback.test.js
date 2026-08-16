const assert = require("node:assert/strict");
const test = require("node:test");

const handler = require("../api/intuit-callback.js");

const VALID_STATE = "0123456789abcdef0123456789abcdef";

function invoke(query, method = "GET") {
  const headers = {};
  let statusCode;
  let body;
  const response = {
    setHeader(name, value) {
      headers[name] = value;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    end(value) {
      body = value;
      return this;
    },
  };

  handler({ method, query }, response);
  return { body, headers, statusCode };
}

test("forwards a valid success response to the local CLI", () => {
  const result = invoke({
    code: "sample-code",
    state: VALID_STATE,
    realmId: "1234567890",
    ignored: "not-forwarded",
  });

  assert.equal(result.statusCode, 302);
  assert.equal(result.body, undefined);
  assert.equal(
    result.headers.Location,
    `http://localhost:9477/api/intuit-callback?state=${VALID_STATE}&code=sample-code&realmId=1234567890`,
  );
  assert.ok(!result.headers.Location.includes("ignored"));
});

test("forwards only an allowlisted OAuth error token", () => {
  const result = invoke({
    state: VALID_STATE,
    error: "access_denied",
    error_description: "<script>globalThis.compromised=true</script>",
  });

  assert.equal(result.statusCode, 302);
  assert.equal(
    result.headers.Location,
    `http://localhost:9477/api/intuit-callback?state=${VALID_STATE}&error=access_denied`,
  );
  assert.ok(!result.headers.Location.includes("error_description"));
  assert.ok(!result.headers.Location.includes("script"));
});

test("rejects malformed states before redirecting", () => {
  for (const state of [
    "short",
    "0123456789ABCDEF0123456789ABCDEF",
    "g".repeat(32),
    "a".repeat(31),
    "a".repeat(33),
  ]) {
    const result = invoke({ state, code: "sample-code", realmId: "123" });
    assert.equal(result.statusCode, 400);
    assert.equal(result.headers.Location, undefined);
  }
});

test("rejects unknown errors and ambiguous responses", () => {
  const unknown = invoke({ state: VALID_STATE, error: "custom_error" });
  assert.equal(unknown.statusCode, 400);

  const ambiguous = invoke({
    state: VALID_STATE,
    code: "sample-code",
    realmId: "123",
    error: "access_denied",
  });
  assert.equal(ambiguous.statusCode, 400);
});

test("rejects malformed success values and array parameters", () => {
  assert.equal(
    invoke({ state: VALID_STATE, code: "sample-code", realmId: "not-numeric" })
      .statusCode,
    400,
  );
  assert.equal(
    invoke({ state: VALID_STATE, code: "x".repeat(4097), realmId: "123" })
      .statusCode,
    400,
  );
  assert.equal(
    invoke({ state: [VALID_STATE], code: "sample-code", realmId: "123" })
      .statusCode,
    400,
  );
});

test("allows GET only", () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const result = invoke(
      { state: VALID_STATE, code: "sample-code", realmId: "123" },
      method,
    );
    assert.equal(result.statusCode, 405);
    assert.equal(result.headers.Allow, "GET");
    assert.equal(result.headers.Location, undefined);
  }
});

test("sets sensitive-response security headers on every response", () => {
  const result = invoke({});
  assert.equal(result.statusCode, 400);
  assert.equal(
    result.headers["Cache-Control"],
    "no-store, no-cache, max-age=0",
  );
  assert.equal(result.headers.Pragma, "no-cache");
  assert.equal(result.headers["Referrer-Policy"], "no-referrer");
  assert.equal(result.headers["X-Content-Type-Options"], "nosniff");
});
