# Requested integrations — 2026-10-21

All installations are scoped to this project. These are local skills and CLIs,
not seven registered Codex desktop app plugins. Catalog search did not identify
exact matches for the requested tools. Nothing was connected to personal accounts.

Cleanup update: the user approved removal of 22 skill folders on 2026-10-21.
61 remain: 24 core and 37 optional. The historical installation table below
describes the original installation; the Claude recommender, four Addy workflows
and five Strix workflows have since been removed, along with older/niche skills.
All four standalone runtimes remain installed. See optional-skills.md for the
current optional inventory and the distinction between tools and Codex CLI.

| Requested source | What it does | Local installation | Usefulness for Nadorly |
| --- | --- | --- | --- |
| [Claude Code Setup](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup) | Read-only codebase inspection to recommend Claude hooks, skills, MCP servers and subagents | Its `claude-automation-recommender` skill copied; Claude Code plugin itself is not registered (no Claude CLI present) | Low while using Codex; archive candidate |
| [Awesome Free LLM APIs](https://github.com/open-free-llm-api/awesome-freellm-apis) | Directory of model/API providers, free tiers and configuration examples | Reference only; no installable skill or application package | Optional research if we later add an AI feature; does not give API keys or unlimited usage |
| [Agent-Reach](https://github.com/Panniantong/Agent-Reach) | Routes research across websites, RSS, videos and social platforms via backend tools | Main skill plus isolated CLI 1.5.0; backend/account setup remains separate | Optional; native web research already covers ordinary needs |
| [REA](https://github.com/morluto/rea) | CLI/MCP for understanding shipped apps, JavaScript/Electron packages and binaries | Main reverse-engineering skill plus isolated CLI 6.7.0; no MCP registration or native decompiler setup | Specialist; unnecessary for ordinary work on Nadorly source |
| [Graphify](https://github.com/Graphify-Labs/graphify) | Parses code/docs into a queryable dependency/knowledge graph | Isolated CLI 0.9.93 and project-local cross-agent skill/references | Optional now; useful for understanding dependencies as the app grows |
| [Addy Osmani Agent Skills](https://github.com/addyosmani/agent-skills) | 25 engineering workflows covering APIs, implementation, debugging, testing, reviews, performance and delivery | All 25 portable skills installed; Claude command wrappers/subagents are not registered | Most directly useful new collection; select individual skills rather than every workflow |
| [Strix](https://github.com/usestrix/strix) | AI-assisted security analysis and penetration testing | Nine workflow skills plus isolated CLI 1.7.0; version and dependency checks passed after retrying a timed-out install | Valuable for later auth/agency-isolation review; local active scanning requires Docker and a configured AI provider |

## Usage and boundaries

Use `scripts/project-tool.ps1 <tool> <arguments>` for `graphify`, `agent-reach`,
`rea`, or `strix`. Example: `./scripts/project-tool.ps1 rea --version`.
Runtime folders are ignored by Git under `.tools/`; normal application dependencies
are separate. Python environments are independent to avoid dependency conflicts.

Graphify used its official `--project --platform agents` skill-only installation.
No always-on Graphify rules were added to AGENTS.md, and no graph was generated.
The PyPI package version matches the inspected source version; installation is
from PyPI, not a claim that the wheel was byte-compared to the GitHub commit.

REA was installed with lifecycle scripts disabled. Version check passed; native
tools such as Hopper/Ghidra/IDA and advanced instrumentation remain optional and
unconfigured. No global MCP server or application inspection session was started.

Agent-Reach's base package is installed; optional backend CLIs, social cookies,
proxies, browser profiles and credentials were not imported or configured. Its
broad routing instructions do not supply those capabilities automatically.

No Strix scan, cloud source upload, paid model call, automatic billing or device
login was executed. Docker is absent from the current PATH, so installation of
the Python CLI alone does not make local scans ready to run.

New skills become available on the next turn; reopen the chat/session if discovery
does not refresh. Installing third-party instructions does not grant external access.

Reproduction: scripts/install-project-skills.py and skills-lock.json cover portable
skills; scripts/install-research-tools.py installs Python CLIs; REA's exact package
is rea-agents@6.7.0. The Graphify skill is registered with its CLI after installation.

The detailed keep/optional/archive recommendations are in skill-audit.md.
