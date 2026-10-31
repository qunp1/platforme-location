# Rental platform — discovery and decisions

Last updated: 2026-10-19. Discovery is ongoing; this is not a final specification.

## Confirmed direction

- Car rental marketplace/intermediary serving Nador, Morocco.
- Supply through local rental agencies, not the platform's own fleet.
- Primary audience: Moroccans/Rifians living abroad and visiting the region.
- MVP goal: demonstrate the idea to potential agency partners with an interactive
  customer journey and a simple agency workspace.
- Use realistic but explicitly fictional sample offers and agencies. Research
  models and prices; do not imply actual availability or existing partnerships.
- Customer demo: search dates, browse cars, view terms, submit a booking request.
- Require customer registration/login to submit bookings; browsing can remain
  public unless later decided otherwise. User wants a foundation that continues
  into the real platform, including a real authentication service, not just a
  disposable mockup. Authentication provider is not selected yet.
- Agency demo: manage cars, prices and unavailable dates, respond to requests.
- Approved end-to-end journey: customer signs in and requests a car; agency
  accepts/declines; customer sees status in their account; after acceptance,
  customer completes online payment in test mode. No real money in the demo.
- Customer authentication: email/password registration and login, password reset.
  Google sign-in can wait. Agency accounts are provisioned through the platform
  team initially; no unrestricted agency publishing/signup.
- MVP languages: French, Arabic (RTL), English.
- Revenue: commission per rental, with no extra charges for now. Subscription
  plans are a future possibility, not an MVP requirement.
- Agency pays commission; no separate platform fee charged to the renter.
- Each agency chooses office collection and/or delivery to supported pickup
  locations (airport, city, port). Delivery is optional, not universal. Exact
  fees and return arrangements remain to be agreed.
- Intended payment direction is online. The user temporarily accepted payment
  at pickup but explicitly needs to discuss payment with the team. Do not treat
  pay-at-pickup as the final product direction.
- Agency value proposition: additional bookings from customers abroad while
  retaining control of prices and availability.
- Approved demo commission: 10% default, configurable per agency, identical
  percentage across car categories; no subscription or separate customer platform
  fee. Exclude refundable security deposits from commission. Actual partner
  agreements and sustainable live economics remain to be validated.
- Show each offer's deposit, insurance, mileage allowance and cancellation terms.
  Use clearly labelled sample conditions in demo data; agencies may differ.
- Platform is the initial booking-support contact and coordinates with agencies;
  provide a support entry within each booking.
- Working name: Nadorly, accepted by the user. Final brand availability remains
  unchecked. Requested logo-design skill installed; three initial vector concepts
  are in assets/brand/logo-exploration. Direction and full identity kit await choice.
- User rejected the initial logo round: generic N, unclear object inside doorway,
  incomprehensible abstract connection. Doorway had potential. Revised round in
  assets/brand/logo-exploration/round-2 removes the internal object and compares an
  open gateway, a lowercase wordmark and a serif wordmark. Await feedback.
- Logo direction selected on 2026-10-19: B2, "Softer arrival", from
  assets/brand/logo-exploration/round-4. It combines a pointed entrance with a
  front-facing car and horizontal headlights. User authorized a working logo kit;
  the identity remains open to refinement. Files are in assets/brand/nadorly-kit-v1.
  Green/cream are proposed in this version; trademark clearance remains undone.
- Subsequent logo feedback: user preferred the earlier B2 over the round-five
  variants. Selected colour palette B, Coastal blue (#155F8A), warm ivory
  (#F7F2E8), and deep navy (#142D3B). Updated working assets are in
  assets/brand/nadorly-kit-v2; the original green kit is retained as history.

## Provisional decisions — revisit with the team

1. Agencies only for now. User accepted this but has not discussed it with friends.
2. Booking requests require agency confirmation, rather than instant booking.
   User explicitly asked to remember that this needs team discussion. Implement
   this as the demonstration assumption, not an agreed permanent business rule.
3. Payment at pickup is only a temporary fallback. Revisit online payment amount
   (full/partial), timing relative to confirmation, provider and demo test mode
   with the team before implementing checkout.
   Subsequent approval: MVP demonstrates online payment in test mode after agency
   acceptance. Live payment policy, amount and provider still need team review.

## Open decisions

- Live customer payment policy/provider; demo uses test payment after acceptance.
- Commission timing, processing fees, refunds and live partner agreements. Demo
  default of 10% with an agency-specific override has been approved.
- Delivery fees and pickup/return details per agency.
- Authentication provider (email/password and initial account onboarding approved).
- Handling of rejected/expired requests; platform-led support is approved.
- Agency-specific deposits, insurance, mileage, driver eligibility and cancellation.
- Visual identity and final demonstration acceptance criteria; working name set.
- Future Spanish, German and Dutch translations (initially considered by user).

## Market observations for fictional offers

Checked public pages on 2026-10-19. These are advertised examples, not quotes for
specific travel dates or a market-wide price survey. Displayed prices depend on
vehicle, duration, season and rental conditions. Presence on a fleet page does
not establish popularity or current availability.

Sources:

- Etsycars Nador airport fleet:
  https://etsycars.com/fr/airport-car-rental/nador/
  Advertised daily rates in a three-day example: manual Sandero 220 MAD, manual
  Logan 230 MAD, manual Corsa 280 MAD, manual Peugeot 208 290 MAD, automatic
  Clio 5 320 MAD. This operator advertises airport handover.
- Hamburg Car Rental, Nador:
  https://hamburg-car.com/vehicles
  Sandero examples 349–399 MAD/day, manual Corsa 399, automatic Hyundai i20 399,
  automatic Accent 450, automatic Mokka 645, automatic Peugeot 3008 799.
  These are a second supplier's advertised figures, not like-for-like quotes.
- HOLT Car Nador page:
  https://www.holtcar.com/locations/nador.html
  Search-index evidence advertises Logan/Stepway at EUR 35/day and Clio 5 /
  Crossland at EUR 40/day, with port delivery. Direct retrieval failed, so treat
  this as a lead to verify before relying on its terms or exact pricing.

Proposed demo mix, not yet approved: Sandero, Logan, Clio 5, Peugeot 208, Corsa,
and one family SUV. Use MAD as the source currency; any EUR view must disclose
its conversion basis rather than implying that all agencies accept EUR.

Do not transfer competitors' no-deposit, free-delivery, insurance or cancellation
claims onto our sample platform as universal promises. Mark any invented rental
terms as demonstration terms and make them visible before a request is sent.

## User-provided inspiration

- VestraCar Google Play listing:
  https://play.google.com/store/apps/details?id=ma.vestracar.mobile.app
  Describes a network of local agencies and renter/agency functionality.
- MarHire:
  https://marhire.com/en
  Reference for location/date search, car information and booking presentation.
  Its published city coverage does not list Nador; do not use its national
  advertised rates as evidence of Nador inventory or our own partnerships.

Neither reference was selected for copying. Create an original brand and UI.
