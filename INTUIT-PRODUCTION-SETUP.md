# Intuit Production Setup

## Public app details

- App name: Rainbow Accounting CLI
- Host domain: www.rainbowinterests.com
- Launch URL: https://www.rainbowinterests.com/quickbooks.html
- Connect or reconnect URL: https://www.rainbowinterests.com/quickbooks-connect.html
- Disconnect URL: https://www.rainbowinterests.com/quickbooks-disconnect.html
- End-user license agreement URL: https://www.rainbowinterests.com/terms.html
- Privacy policy URL: https://www.rainbowinterests.com/privacy.html
- Production OAuth redirect URI: https://www.rainbowinterests.com/api/intuit-callback

## Recommended classification

- Categories: Business Insights, Expenses, Data & documents, Invoicing & payments
- Regulated industries: None of the above
- Hosting country: United States

## Current public DNS addresses

Checked August 16, 2026:

- 216.198.79.1
- 64.29.17.1

These are Vercel anycast addresses returned by current DNS. Recheck them immediately before completing Intuit's hosting questionnaire because managed-hosting addresses can change.

## CLI login

Use the same public callback URI supplied to Intuit:

```text
intuit auth login --profile COMPANY_NAME --env production --redirect-uri https://www.rainbowinterests.com/api/intuit-callback
```

The official CLI listens locally at `http://localhost:9477/api/intuit-callback`. The Vercel function validates the response shape, forwards only approved query parameters, returns an empty redirect response, and sends the browser to that fixed local listener. The Intuit CLI validates the OAuth state before exchanging the authorization code.

## Remaining portal requirements

- Upload a 100 by 100 pixel PNG or JPG app logo.
- Verify the Intuit Developer Portal email address.
- Confirm the business contact name, phone number, and address.
- Complete the app assessment accurately.
- Obtain review of the updated legal pages before publishing them.
- Recheck Vercel DNS addresses immediately before entering the hosting IP fields.
