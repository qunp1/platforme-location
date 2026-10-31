# Floorplan — 2026-10-29

Installed project-locally from haydenschmitty/floorplan, skills/floorplan,
revision 59a12f4374f29cee26b002f31dbf60cb6955a917. Tracking parameters were omitted.

Creates a self-contained floorplan/index.html with subsystems, modules, files,
HTTP routes, connections and guided flows described in plain language. Useful
for understanding Nadorly and onboarding teammates. Refreshes an existing map
rather than rebuilding descriptions from scratch.

Overlaps with Graphify's architecture/relationship analysis; Floorplan focuses
on an approachable interactive visual explorer. Its automatic health checks
are hints, not a full security audit.

Requires Node 18+; the bundled Node runtime meets this requirement. The optional
Ask bar uses a local Claude/Codex executable and sign-in. Its runtime discovery
has not been verified here. The self-contained map can also open without it.
No separate user-operated Codex CLI is needed to request a map in this chat.

Installation does not generate a map, start a server or publish project data.
Next turn, request: `$floorplan` or “Make me a floorplan of Nadorly.”

Source: [Floorplan](https://github.com/haydenschmitty/floorplan).
