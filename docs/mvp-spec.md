# Nadorly — MVP specification

Status: reviewable first specification, 2026-10-19.
Source of decisions and outstanding team discussions: product-discovery.md.
This specifies the partner demonstration and its reusable application foundation.
Implementation details below are proposals where explicitly marked.

## Purpose

Help Nador residents and visitors, including Moroccans/Rifians living abroad, find
and request cars from local rental agencies in Nador for everyday needs, weekends
and holidays. Neither audience is secondary. Show potential agency partners how they
retain control of inventory, pricing, delivery options and acceptance of requests.

Working brand: Nadorly. Logo deferred. No real agency affiliation implied.

## Scope

- Responsive web application; native mobile apps are outside this first build.
- French, Arabic with right-to-left layouts, and English. Proposed default: French.
- Real email/password authentication and password reset; persistent application
  data and server-enforced account permissions.
- Customer journey, agency workspace, and minimal platform administration.
- Explicit sample agencies, vehicles and conditions; test-mode payments only.
- 10% commission default, configurable per agency, paid by the agency. No extra
  customer platform fee or subscription in this version.

## Customer journey

1. Browse without signing in. Choose pickup location, start/end date and time.
2. See matching sample offers with price, transmission, seats, agency and pickup
   method. Filter by price/category, transmission and collection/delivery.
3. Open a vehicle: photos, specifications, rental conditions, agency information,
   supported pickup/return arrangements, and full price breakdown.
4. Register/sign in before submitting. Preserve the chosen vehicle and dates.
5. Review contact information, pickup details, rental terms and estimated total.
   Submit a request; clearly state that this does not confirm a booking.
6. Track the request in the account. Agency rejection is explained; customer can
   return to results with the same search.
7. After agency acceptance, complete online checkout in test mode. Show success,
   failure and retry states. Only a verified successful payment confirms booking.
8. View confirmation/reference, pickup instructions, terms and support entry.

No real ID/license documents are required for the partner demo. Show eligibility
conditions as sample agency terms without presenting document verification as built.

## Agency workspace

- Agency accounts are provisioned by the platform team; no open self-publishing.
- Overview: requests needing action, upcoming bookings and fleet summary.
- Fleet: create/edit vehicles, photos, specifications, prices and rental terms.
- Availability: block dates per vehicle; inspect requests and confirmed bookings.
- Pickup settings: office collection and optional delivery to supported locations;
  configure delivery fees. No promise that every car is deliverable everywhere.
- Requests: inspect dates, customer details and price; accept or decline.
- Bookings: view payment/booking status and upcoming handovers.
- Commission summary: rental subtotal, applicable rate, platform commission and
  estimated agency share. Delivery and refundable deposits are separate items.
- All data access is restricted to that agency's own vehicles and bookings.

## Platform administration

Minimal operational screens to create agencies/invite their users, configure
commission rates, view bookings and handle booking support. Customers and agency
users cannot grant themselves administrative roles or edit commission settings.
No public analytics claims, fake reviews or invented verified-partner badges.

## Booking and payment states

Proposed state model:

`requested -> awaiting_payment -> confirmed -> completed`

- Agency decline: `requested -> declined`.
- Customer withdrawal before payment: `requested/awaiting_payment -> cancelled`.
- Agency acceptance holds the vehicle while awaiting payment; proposed expiry is
  24 hours, capped at pickup time. Expiry releases the hold and records `expired`.
- Multiple requests may overlap; acceptance must atomically prevent overlapping
  accepted holds and confirmed bookings for the same vehicle.
- Failed payments leave an unexpired accepted booking awaiting payment so the
  customer can retry. Payment state is recorded separately from booking state.
- Never mark a booking paid from a browser success URL alone. Verify payment
  server-side; process repeated events idempotently. Handle late events after
  expiry/cancellation without silently reconfirming a released vehicle.
- Post-payment cancellation is a support request in this MVP. Automated refunds
  and final live cancellation rules require separate implementation decisions.

These timings and edge-case policies are proposed demo defaults, not launch
commitments. Show status changes in the application even if email delivery is
unavailable; do not claim an email was sent when it was not.

## Pricing rules

- Store monetary amounts in integer minor units; MAD is the initial currency.
- Show daily rate, billed duration, rental subtotal, delivery fee and total.
- Display refundable security deposit separately from the online rental charge.
- Proposed demo billing: each started 24-hour period is one rental day, computed
  from actual pickup/return times. Make the rule visible; reject nonpositive spans.
- Use the Africa/Casablanca time zone for local pickup/return; store timestamps
  with zone-aware conversion rather than assuming a fixed UTC offset.
- Snapshot the quoted rate, terms and commission when a request is created.
  Later vehicle/rate edits must not silently alter existing requests.
- Proposed demo payment amount: full rental subtotal plus delivery fee, after
  agency acceptance, excluding security deposit. Live full/partial payment remains
  a team decision.
- Commission applies to rental subtotal; delivery and security deposit excluded
  in the proposed demo calculation. For 2,100 MAD rental subtotal at 10%, record
  210 MAD commission and 1,890 MAD agency rental share before processing costs.
- Real settlement, partner payouts and processing-fee allocation are not built
  merely by showing those figures in the demonstration.

## Application foundation

Core records: user/profile, agency, agency membership, vehicle, vehicle image,
pickup option, vehicle availability block, booking, immutable quote/terms,
booking status event, payment attempt/event, and booking-linked support request.

Choose authentication/database/payment services during technical planning after
checking Morocco support and available project credentials. Do not assume a
provider supports Moroccan merchant onboarding or agency payouts. A simulated
payment adapter is acceptable for the demo only if explicitly labelled simulated;
real authentication must not be replaced by a role dropdown or localStorage login.

If provider credentials are absent, prepare integration and local development
configuration, then clearly report what remains unconnected. Secrets remain on
the server; enforce ownership and roles server-side, not only in navigation.

## Demonstration acceptance criteria

- A visitor can find an offer using dates and a supported pickup arrangement.
- Account creation, sign-in, sign-out and password-reset flow work against the
  selected authentication service when configured.
- A customer can submit and revisit a persistent request.
- An agency can update its fleet/calendar and accept/decline only its requests.
- An accepted request reaches test checkout and a verified test payment confirms
  it; failed checkout supports retry without duplicate bookings or charges.
- Conflicting holds/bookings are prevented, including concurrent acceptance.
- Unsupported pickup methods cannot be selected; all fees and sample rental
  conditions are visible before submission.
- Customer, agency and administrator roles cannot read or mutate unauthorized data.
- French/English and Arabic layouts cover the full journey and meaningful errors.
- The complete journey is usable on a phone and with keyboard navigation.
- Sample data and payment test mode are visibly identified. No real messages,
  payments or partner invitations are sent during the presentation by accident.

## Deferred

Private vehicle owners, additional cities/languages, subscriptions, native apps,
Google sign-in, document verification, automated payouts/refunds, external fleet
sync, dynamic seasonal pricing, and real public reviews.

## Team decisions before live operation

Agencies-only policy; request versus instant confirmation; online full/partial
payment and timing; provider and settlement model; commission economics/contract;
real rental terms and eligibility; delivery/return fees; cancellations/refunds;
support responsibilities; brand availability. These do not require inventing
permanent policies to make the partner demo work.
