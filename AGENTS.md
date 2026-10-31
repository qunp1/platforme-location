# Project-local skills

Third-party skills are installed in `.agents/skills`. See `SKILLS.md` for scope,
runtime requirements and source provenance; see `skills-lock.json` for revisions.

Use only the skills relevant to the current request. Do not load every design
collection or combine competing visual styles. Preserve the user's brief and
the project's chosen stack when applying opinionated third-party guidance.

When the user explicitly invokes `grill-me`, read and follow
`.agents/skills/grilling/SKILL.md` directly: the upstream wrapper's instruction
to call a Skill tool is intended for another agent runtime.

For the four Founder skills (user-interviews, competitor-matrix, go-to-market,
metrics-dashboard), resolve `${CLAUDE_PLUGIN_ROOT}` as this project's
`.agents/founder` directory and `$ARGUMENTS` as the user's request. Read their
shared/conventions.md there. Use available tools rather than Claude-specific
tool names. Existing docs/product-discovery.md, docs/mvp-spec.md and current
project records provide context even when founder/ outputs do not exist yet.
Preserve Nadorly's agency marketplace and commission model; do not invent
traction, partner agreements, or SaaS subscription requirements.
