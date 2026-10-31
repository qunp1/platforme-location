# Hallmark assessment — 2026-10-25

Installed from the official website's linked repository, nutlope/hallmark,
at revision 7ec868225c6caa040558c321ee0fefa0e73f83a8, path skills/hallmark.
Skill version: 2.0.0. This is project-local; no app redesign is authorized by installation.

Hallmark offers curated themes, material/audience discovery, design scaffolding,
photo selection and a rendered-browser design linter called sloplint.
It respects an existing design system and requires an explicit Hallmark request
before redesigning an existing design. Its aesthetic rules are opinionated,
not universal accessibility or product-quality guarantees.

| Installed skill | Overlap and recommended use |
| --- | --- |
| design-taste-frontend (taste-skill folder) | Strong overlap: art direction, researched directions, photos and browser review. Choose one as the lead for a design task. |
| impeccable | Partial overlap: layout, typography, visual critique and polish. Impeccable also covers broader UX, copy and production states. |
| emil-design-eng | Some craft overlap; useful for detailed component and interaction refinement. |
| frontend-ui-engineering | Complementary accessible/responsive component implementation, with some common design rules. |
| replica-design | Existing tokens/components should guide implementation; Hallmark should preserve the project's established design decisions. |
| image-to-code / imagegen-frontend-web | Both help visual exploration, but those focus on image-first references rather than theme scaffolding and browser linting. |

Recommendation: keep Hallmark as an optional experiment. It is helpful for trying
a coherent new visual direction, not necessary for Nadorly to function. Do not
combine its theme rules with Taste's competing directions in the same task.
No existing skills were removed.

Use `$hallmark` explicitly in the next chat turn. Node is required for its helper
scripts; rendered checks also require a working browser. Together AI image
generation is optional and requires a separate key. Installing the skill does
not configure that account or prove every browser workflow is ready.

Sources: [Hallmark website](https://www.usehallmark.com/),
[pinned skill source](https://github.com/nutlope/hallmark/tree/7ec868225c6caa040558c321ee0fefa0e73f83a8/skills/hallmark).
