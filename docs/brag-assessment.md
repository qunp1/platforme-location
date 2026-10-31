# Brag assessment — 2026-10-27

Source: [latent-spaces/brag](https://github.com/latent-spaces/brag), revision
669ab9286aa28b6c3ee30e75f181ee74319d012a, skills/brag. The supplied URL's trailing
period was removed to resolve the actual repository.

Useful for Nadorly: reads the product source, plans a specific story, writes a
storyboard and composition brief, then uses Hyperframes to render a short
launch video with music, sound effects, poster and share copy. Default length
is 15–25 seconds; supports landscape, vertical and square. Narration is opt-in.
For partner presentations use a polished tone and clearly distinguish working
features from planned ones. Do not invent partners, traction or payment support.

This complements GSAP/Emil skills: those animate the website; Brag creates a
separate video artifact. No existing skills were removed, no video was produced,
and the application was not changed by installation.

Installed the full brag directory with its references, scripts and bundled
audio. Did not add the separate brag-slim entry: its automatic selection is
specific to Claude Opus 5.5, while this project is using Codex.

Runtime follow-up, 2026-10-27: installed the four official Hyperframes guidance
skills (`hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`)
from heygen-com/hyperframes into `.agents/skills/`. Bundled Node v24.19.0 meets
the Node 22+ requirement. Installed a separate Hyperframes rendering runtime,
portable FFmpeg/FFprobe and local GSAP under `brag-output/runtime/`.
The CLI was updated from 0.8.203 to 0.8.208 before final composition checks;
the full check passes with 40/40 visible-text contrast checks and zero errors.
The video shows the existing French prototype with fictional offers, rather
than claiming a production launch. See `brag-output/README.md` for reproduction.
No external publishing service was connected or invoked.

Future request: `$brag --tone polished --format landscape --title Nadorly`.
This runs through the Codex app; the user does not need to operate Codex CLI.
The skill is available from the next turn. Installation provenance is recorded
in skills-lock.json and scripts/install-project-skills.py.
