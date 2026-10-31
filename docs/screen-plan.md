# Nadorly — MVP screen plan

Draft for the first responsive web build; no visual identity or framework selected.

## Customer screens

| Screen | Main purpose | Required states |
| --- | --- | --- |
| Home | Search pickup location and rental dates/times; explain the service | Invalid dates, delivery versus office collection, mobile layout |
| Search results | Compare matching offers and filter | Loading, empty results, filter reset, sample-offer label |
| Vehicle details | Evaluate car, agency, pickup options, conditions and total | Unsupported pickup, date conflict, photo fallback |
| Register / sign in | Email/password account and return to interrupted booking | Validation, wrong credentials, existing email, pending verification if enabled |
| Reset password | Request recovery and set a new password | Neutral recovery response, expired link, success |
| Request review | Confirm quote, customer contact and agency terms | Validation, changed availability, duplicate submission protection |
| My bookings | Track requests, pending payments and confirmed bookings | Empty list, loading/error, status filters |
| Booking details | Show status, timeline, pickup details and relevant next action | Requested, declined, awaiting payment, expired, confirmed, cancelled, completed |
| Test checkout | Pay only an accepted, unexpired request | Test label, success, failure/retry, pending verification |
| Booking support | Send a booking-linked request to platform support | Validation, submitted, failure/retry |
| Account | Update basic profile/contact details and sign out | Save/error states |

Search remains usable before login. Status-specific actions live on booking
details; a declined request never displays a confirmed-reservation heading.

## Agency screens

| Screen | Main purpose | Required states |
| --- | --- | --- |
| Agency sign in | Access an account created by the platform team | Invalid credentials, unauthorized role |
| Overview | Identify requests needing action and upcoming bookings | Empty fleet, no requests |
| Fleet | Browse cars and open create/edit form | Draft/inactive vehicles, empty fleet |
| Vehicle editor | Maintain specifications, photos, price and sample conditions | Validation, unsaved changes, upload failure |
| Availability calendar | Manage manual blocks and view holds/bookings | Conflicts, expired holds, month/mobile view |
| Requests / request details | Review and accept/decline | Concurrent acceptance conflict, repeated actions, customer cancellation |
| Bookings / booking details | Inspect confirmed rentals and handover information | Payment pending/failed, cancelled, completed |
| Agency settings | Office collection, supported delivery points and fees | Unsupported options, missing address, validation |
| Commission summary | Explain commission and estimated rental share | No completed rentals; no claim of actual payouts |

## Platform screens

- Agencies: create sample agency, provision member access and configure commission.
- Bookings: inspect cross-agency status and identify requests needing intervention.
- Support: inspect booking-linked customer requests and record their status.

## Cross-screen behavior

- Language switch preserves the current journey where possible; Arabic uses RTL.
- French is the proposed initial locale; currency starts with MAD only.
- Customer contact accepts international phone country codes.
- Shared navigation responds to the authenticated role without exposing other roles.
- Visible focus, labelled form controls, readable contrast and accessible status
  messages; motion cannot be required to understand a state change.
- Sample agency identities and car listings do not imply real partnerships.
- Working name can be displayed as plain text until logo creation is requested.

## Suggested first implementation slice

Build the reusable account/role/data foundation, then one vehicle's complete
request/accept/test-payment journey. Add fleet editing, filters and additional
sample cars around that working slice. Verify phone layouts and Arabic throughout,
not only after the desktop flow is finished.
