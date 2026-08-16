# Intuit Production Setup

## Public app details

- App name: Rainbow Accounting CLI
- App logo: `intuit-app-icon.png`, a white square with one centered black dot
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
- Accepted connections: United States only
- Hosting country: United States

## App assessment facts

- Purpose: Private accounting and reporting utility for authorized Rainbow Interests personnel.
- Users: Internal personnel and QuickBooks company administrators expressly authorized by Rainbow Interests.
- Distribution: Private and unlisted. It is not offered to the public or listed in the QuickBooks App Store.
- Companies: Each QuickBooks Online company is separately authorized through Intuit OAuth.
- OAuth scopes: The official CLI requests the standard Accounting and OpenID scopes by default. It does not request the Payments scope.
- Payments and money movement: The app does not process, initiate, verify, accept, decline, or transmit payments. It only accesses accounting records through the Accounting API when an authorized user runs a CLI command.
- Regulated industries: None of the above. The app does not provide lending, insurance, investment or financial-planning, or payments and money-movement services.
- Data storage: The public website does not store QuickBooks records or OAuth tokens in an application database. The official CLI stores encrypted tokens on each authorized local device.
- Hosting: The public website and OAuth relay are hosted by Vercel. The callback function defaults to Vercel's `iad1` US East region, while the public site is delivered through Vercel's global Anycast network.
- Logging: Vercel runtime logs may include the callback request path and search parameters, including a short-lived, single-use authorization code. The current Hobby plan retains runtime logs for up to one hour.
- Vercel plan: The project is currently on Hobby. Vercel restricts Hobby to personal or non-commercial use, so upgrade to Pro or obtain written confirmation from Vercel before using this business integration in production. Pro runtime-log retention is currently one day, so update the Privacy Policy and this guide if the plan changes.

## Current public DNS addresses

Checked August 16, 2026:

- Apex domain `rainbowinterests.com`: 216.198.79.1
- Host domain `www.rainbowinterests.com`: 216.198.79.65 and 64.29.17.65

These are shared Vercel Anycast addresses returned by current DNS, not dedicated application-server addresses. Use the two `www` addresses if Intuit requires the IPs currently serving the configured host domain. Recheck them immediately before completing the hosting questionnaire because managed-hosting addresses can change.

## CLI login

Use the same public callback URI supplied to Intuit:

```text
intuit auth login --profile COMPANY_NAME --env production --redirect-uri https://www.rainbowinterests.com/api/intuit-callback
```

The official CLI listens locally at `http://localhost:9477/api/intuit-callback`. The Vercel function accepts GET only, requires the CLI's exact 32-character lowercase hexadecimal state format, validates success values, forwards only allowlisted OAuth error tokens, discards error descriptions, returns an empty redirect response with no-cache headers, and sends the browser to that fixed local listener. The Intuit CLI validates the OAuth state before exchanging the authorization code.

## Remaining portal requirements

- Upload a 100 by 100 pixel PNG or JPG app logo.
- Verify the Intuit Developer Portal email address.
- Confirm the business contact name, phone number, and address.
- Complete the app assessment accurately.
- Obtain review of the updated legal pages before publishing them.
- Recheck the Vercel DNS addresses immediately before entering the hosting IP fields.
- Upgrade the Vercel project to Pro or obtain written confirmation that the current plan permits this business use, then update the documented runtime-log retention.
- Select United States only under Accepted connections.
- Register the production redirect URI after the assessment unlocks production credentials and redirect settings.
