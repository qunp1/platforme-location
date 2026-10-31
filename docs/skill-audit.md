# Nadorly skill audit — 2026-10-29

User-authorized cleanup: the 22 previous archive/remove candidates were removed on 2026-10-21. Current inventory: 24 recommended skills and 52 optional skills. Four Founder business skills were added on 2026-10-22. This audits project-local skills, not bundled system skills or connected app plugins.

Current project: React/Vite frontend, Node API, Supabase account/request integration and Playwright checks. Agency decisions and live payments remain unfinished according to README.md. The replica/ documents are the active architecture/design records.

Inventory: 76 skills; 24 recommended keep, 52 optional, 0 archive/remove candidates.

Keep means retain in the project, not load on every task. None of these third-party instructions is intrinsically required for the application to run.

scripts/skill-exclusions.json prevents reinstalling the 22 removed folders. docs/removed-skills.json retains their source metadata. The actual replica/ project documents and all standalone tool runtimes are retained.

| Skill name | Folder | Recommendation | Reason |
| --- | --- | --- | --- |
| `agent-reach` | `agent-reach` | Optional | Specialist tool; invoke for a concrete research/analysis need, not every coding task. |
| `animate` | `animate` | Optional | Specialized motion/style advice; use when the UI needs it. |
| `animation-performance` | `animation-performance` | Optional | Specialized motion/style advice; use when the UI needs it. |
| `animation-vocabulary` | `animation-vocabulary` | Optional | Specialized motion/style advice; use when the UI needs it. |
| `api-and-interface-design` | `api-and-interface-design` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `apple-design` | `apple-design` | Optional | Specialized motion/style advice; use when the UI needs it. |
| `ask-sonner` | `ask-sonner` | Optional | Useful for a matching task; not needed as a default on every change. |
| `brag` | `brag` | Optional | Optional product launch videos; complementary to website motion skills. Rendering requires Hyperframes CLI/skills and FFmpeg. |
| `brandkit` | `brandkit` | Optional | Optional image-first brand/design exploration; may add substantial image-generation work. |
| `break-ui` | `break-ui` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `ci-cd-and-automation` | `ci-cd-and-automation` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `code-review-and-quality` | `code-review-and-quality` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `code-simplification` | `code-simplification` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `competitor-matrix` | `competitor-matrix` | Optional | Founder toolkit: agency/customer discovery, positioning, acquisition or marketplace metrics; use for the relevant business task. |
| `constraint-driven-development` | `constraint-driven-development` | Optional | Useful for a matching task; not needed as a default on every change. |
| `context-engineering` | `context-engineering` | Optional | Useful for a matching task; not needed as a default on every change. |
| `debugging-and-error-recovery` | `debugging-and-error-recovery` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `deprecation-and-migration` | `deprecation-and-migration` | Optional | Useful for a matching task; not needed as a default on every change. |
| `documentation-and-adrs` | `documentation-and-adrs` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `doubt-driven-development` | `doubt-driven-development` | Optional | Useful for a matching task; not needed as a default on every change. |
| `emil-design-eng` | `emil-design-eng` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `find-animation-opportunities` | `find-animation-opportunities` | Optional | Specialized motion/style advice; use when the UI needs it. |
| `find-security-vulnerabilities-in-code` | `find-security-vulnerabilities-in-code` | Optional | Useful for a scoped security review; active Strix scans need runtime/provider setup. |
| `fix-security-vulnerabilities-with-strix` | `fix-security-vulnerabilities-with-strix` | Optional | Useful for a scoped security review; active Strix scans need runtime/provider setup. |
| `floorplan` | `floorplan` | Optional | Optional interactive architecture map for understanding and onboarding; overlaps with Graphify analysis but emphasizes a plain-language visual explorer. |
| `frontend-ui-engineering` | `frontend-ui-engineering` | Optional | Useful for a matching task; not needed as a default on every change. |
| `git-workflow-and-versioning` | `git-workflow-and-versioning` | Optional | Useful for a matching task; not needed as a default on every change. |
| `go-to-market` | `go-to-market` | Optional | Founder toolkit: agency/customer discovery, positioning, acquisition or marketplace metrics; use for the relevant business task. |
| `graphify` | `graphify` | Optional | Specialist tool; invoke for a concrete research/analysis need, not every coding task. |
| `grill-me` | `grill-me` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `grilling` | `grilling` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `gsap-core` | `gsap-core` | Optional | Optional official GSAP implementation guidance; complements existing motion design skills. Use CSS for simple transitions; install runtime packages only when implementation needs GSAP. |
| `gsap-performance` | `gsap-performance` | Optional | Optional official GSAP implementation guidance; complements existing motion design skills. Use CSS for simple transitions; install runtime packages only when implementation needs GSAP. |
| `gsap-react` | `gsap-react` | Optional | Optional official GSAP implementation guidance; complements existing motion design skills. Use CSS for simple transitions; install runtime packages only when implementation needs GSAP. |
| `gsap-timeline` | `gsap-timeline` | Optional | Optional official GSAP implementation guidance; complements existing motion design skills. Use CSS for simple transitions; install runtime packages only when implementation needs GSAP. |
| `hallmark` | `hallmark` | Optional | Optional theme-led design and browser linting; strongly overlaps with Taste and partly Impeccable. Choose one lead design workflow. |
| `hyperframes` | `hyperframes` | Optional | Useful for a matching task; not needed as a default on every change. |
| `hyperframes-cli` | `hyperframes-cli` | Optional | Useful for a matching task; not needed as a default on every change. |
| `hyperframes-registry` | `hyperframes-registry` | Optional | Useful for a matching task; not needed as a default on every change. |
| `image-to-code` | `image-to-code` | Optional | Optional image-first brand/design exploration; may add substantial image-generation work. |
| `imagegen-frontend-web` | `imagegen-frontend-web` | Optional | Optional image-first brand/design exploration; may add substantial image-generation work. |
| `impeccable` | `impeccable` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `improve-animations` | `improve-animations` | Optional | Specialized motion/style advice; use when the UI needs it. |
| `incremental-implementation` | `incremental-implementation` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `logo-design` | `logo-design` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `media-use` | `media-use` | Optional | Useful for a matching task; not needed as a default on every change. |
| `metrics-dashboard` | `metrics-dashboard` | Optional | Founder toolkit: agency/customer discovery, positioning, acquisition or marketplace metrics; use for the relevant business task. |
| `mobile-native` | `mobile-native` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `observability-and-instrumentation` | `observability-and-instrumentation` | Optional | Useful for a matching task; not needed as a default on every change. |
| `owasp-top-10-testing` | `owasp-top-10-testing` | Optional | Useful for a scoped security review; active Strix scans need runtime/provider setup. |
| `penetration-testing-with-strix` | `penetration-testing-with-strix` | Optional | Useful for a scoped security review; active Strix scans need runtime/provider setup. |
| `performance-optimization` | `performance-optimization` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `pick-ui-library` | `pick-ui-library` | Optional | Useful for a matching task; not needed as a default on every change. |
| `planning-and-task-breakdown` | `planning-and-task-breakdown` | Optional | Useful for a matching task; not needed as a default on every change. |
| `playwright-skill` | `playwright-skill` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `prototype` | `prototype` | Optional | Useful for a matching task; not needed as a default on every change. |
| `replica-architect` | `replica-architect` | Keep | Retain: the active project already uses the replica/ build and architecture records. |
| `replica-backend` | `replica-backend` | Keep | Retain: the active project already uses the replica/ build and architecture records. |
| `replica-brand` | `replica-brand` | Optional | Useful only when that research, branding or launch stage is requested. |
| `replica-build` | `replica-build` | Keep | Retain: the active project already uses the replica/ build and architecture records. |
| `replica-deploy` | `replica-deploy` | Optional | Useful only when that research, branding or launch stage is requested. |
| `replica-design` | `replica-design` | Keep | Retain: the active project already uses the replica/ build and architecture records. |
| `replica-diff` | `replica-diff` | Optional | Useful only when that research, branding or launch stage is requested. |
| `replica-entrepreneur` | `replica-entrepreneur` | Optional | Useful only when that research, branding or launch stage is requested. |
| `replica-launch` | `replica-launch` | Optional | Useful only when that research, branding or launch stage is requested. |
| `replica-recon` | `replica-recon` | Optional | Useful only when that research, branding or launch stage is requested. |
| `replica-test` | `replica-test` | Keep | Retain: the active project already uses the replica/ build and architecture records. |
| `reverse-engineer-anything` | `reverse-engineer-anything` | Optional | Specialist tool; invoke for a concrete research/analysis need, not every coding task. |
| `review-animations` | `review-animations` | Optional | Specialized motion/style advice; use when the UI needs it. |
| `security-and-hardening` | `security-and-hardening` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `shipping-and-launch` | `shipping-and-launch` | Optional | Useful for a matching task; not needed as a default on every change. |
| `source-driven-development` | `source-driven-development` | Optional | Useful for a matching task; not needed as a default on every change. |
| `spec-driven-development` | `spec-driven-development` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `design-taste-frontend` | `taste-skill` | Optional | Optional alternate art direction; choose this or Impeccable as lead, not both at once. |
| `test-driven-development` | `test-driven-development` | Keep | Directly supports current design, accounts/API, implementation or verification work. |
| `user-interviews` | `user-interviews` | Optional | Founder toolkit: agency/customer discovery, positioning, acquisition or marketplace metrics; use for the relevant business task. |
