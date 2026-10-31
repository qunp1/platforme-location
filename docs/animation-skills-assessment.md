# Animation skill selection — 2026-10-26

Selected the official greensock/gsap-skills collection, installing only four
project-local skills at commit aed9cfd3277740755f6bfc1155c7aa645403b760:

| Skill | Purpose |
| --- | --- |
| gsap-core | Tweens, easing, stagger, responsive conditions and reduced motion |
| gsap-react | React lifecycle, scoped targets, useGSAP and cleanup |
| gsap-timeline | Coordinated sequences, labels, playback and reversal |
| gsap-performance | Transform/opacity choices, batching and avoiding unnecessary work |

Nadorly already has animate, animation-performance, review-animations,
improve-animations, find-animation-opportunities and emil-design-eng. These
provide motion intent, timing and quality review. GSAP adds specific API and
React integration knowledge rather than another general design director.

The application's package.json currently has React and React DOM as runtime
dependencies. Skill installation adds instructions only: gsap and @gsap/react
have not been added, and no animation or application behavior changed. Add
those packages when an approved implementation actually needs GSAP; prefer
existing CSS for simple transitions and preserve the project's motion tokens.
Use GSAP performance advice alongside the existing performance skill: profile
changes and avoid blanket will-change or promises of a particular frame rate.

Not installed:

- Genjutsu: broad creative coding, visual direction and interaction planning,
  including native platforms and whole-site orchestration. More overlap and
  setup than this React rental platform needs for targeted motion work.
- LottieFiles motion-design: useful library-independent timing, easing,
  choreography and feedback principles, but substantially overlaps with the
  existing Emil animation skills. This is guidance, not a Lottie asset library
  or player installation.
- Other GSAP modules: ScrollTrigger, plugins, utilities and other frameworks
  can be installed if a concrete requirement arises.

Sources inspected:
[GSAP](https://github.com/greensock/gsap-skills),
[Genjutsu](https://github.com/AThevon/genjutsu),
[LottieFiles](https://github.com/lottiefiles/motion-design-skill).

Reproduce with scripts/install-project-skills.py; provenance is recorded in
skills-lock.json. No existing skills were removed.
