# Founder collection assessment — 2026-10-22

Source: https://github.com/emotixco/claude-skills-founder
Pinned revision: a194aaa1919fffbb56b2dea27eaaeff0b3add2f3.

Verdict: useful selectively, not necessary as a complete collection. Installed
four portable skills into .agents/skills using the official skill installer:

| Skill | Value for Nadorly |
| --- | --- |
| user-interviews | Prepare interviews with rental agencies and returning travelers; ask about actual past behavior rather than collecting polite enthusiasm |
| competitor-matrix | Compare relevant services on sourcing, pricing transparency, agency controls and booking flow; identify evidence-based positioning gaps |
| go-to-market | Plan agency recruitment and traveler acquisition around a defined initial market |
| metrics-dashboard | Select useful measures for the current stage, with clear definitions and review cadence; adapt to a rental marketplace rather than SaaS MRR |

Shared conventions and license are preserved under .agents/founder. AGENTS.md
maps the upstream Claude plugin-root placeholder to that directory. No separate
CLI, API key or Claude Code plugin is required for these instruction files.
No founder workflow has been executed just by installing them, and no messages
have been sent to agencies or customers.

The collection adds business-research structure to the existing technical skills.
There is overlap with replica-entrepreneur/recon/launch, but customer interviews
and a reusable founder evidence folder provide a useful additional workflow.

The upstream collection contains thirteen skills; nine were not
installed: validate-idea, product-brief, persona-gen, mvp-scope, pricing-strategy,
landing-page, email-sequence, pitch-deck and fundraise-prep.

Reasons: existing discovery/specification and launch workflows cover much of the
same ground. Pricing-strategy explicitly assumes SaaS pricing and three subscription
tiers; this is a poor default for the agreed rental commission model. Pitch-deck
and fundraise-prep target investment raising rather than agency-partner recruitment.
MVP-scope contains arbitrary feature-cut quotas that should not override approved
booking/account requirements. Persona assumptions must not be mistaken for research.

The selected skills still require judgment: proposed metric targets are hypotheses,
not measured benchmarks; agency signups, interviews, bookings and revenue must come
from real records. Copywriting cannot establish product-market fit.

Use from this app, for example: "Use user-interviews to prepare separate agency
and traveler interview scripts for Nadorly." New skill discovery should refresh
on the next turn. Existing 22 exclusions stay in force.
