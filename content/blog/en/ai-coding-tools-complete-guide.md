---
title: "AI Coding Tools: The Complete Guide to Claude Code, OpenCode & Modern Development"
description: "From zero to production: Master AI-assisted development with Claude Code and OpenCode. A complete guide covering fundamentals, CLAUDE.md configuration, context management, MCP, skills, and choosing the right tool."
date: "2026-01-24"
slug: "ai-coding-tools-complete-guide"
mediumUrl: "https://senrecep.medium.com/ai-coding-tools-the-complete-guide-to-claude-code-opencode-modern-development-eb9da4477dc1"
imageUrl: "/images/The-Complete-Guide-to-Claude-Code-OpenCode-Modern-Development.webp"
---

## Introduction: The AI Coding Revolution

If you're still copying code from ChatGPT or Claude.ai into your editor, you're missing a fundamental shift in software development. Modern AI coding tools don't just answer questions - they **directly interact with your codebase**, read your files, run commands, and write code for you.

This guide will take you from complete beginner to power user, covering:

- What AI coding tools are and why they matter
- Core concepts every developer must understand
- Claude Code: Anthropic's official terminal-based assistant
- OpenCode: The open-source alternative with multi-agent capabilities
- How to choose the right tool for your situation
- Advanced techniques for production development

**Quick Setup**: If you prefer hands-on learning, share this gist with your AI coding tool:

```
Read this gist and set up my project: https://gist.github.com/senrecep/98d3583717581a4138bac62344261f6f
```

## Part 1: Fundamentals

### What Are AI Coding Tools?

AI coding tools are terminal-based assistants that can:

- **Read and write files** directly in your project
- **Execute commands** (build, test, deploy)
- **Understand context** from your entire codebase
- **Generate, refactor, and debug code** based on your instructions

Unlike web-based AI (ChatGPT, Claude.ai), these tools integrate directly with your development environment.

## The Two Major Players (January 2026)

| Tool | Developer | Model Support | Cost |
|---|---|---|---|
| **Claude Code** | Anthropic (official) | Claude only | $17-200/month |
| **OpenCode** | Community (open-source) | 75+ providers | Free + API costs |

## Five Limitations You Should Know

Before diving in, understand what current AI coding tools cannot do perfectly:

**1. Single-Agent Problem**
Most tools use one general-purpose AI for all tasks. It's like asking one person to be a doctor, lawyer, and architect simultaneously.

**2. Hallucination Risk**
AI can generate plausible but incorrect code - inventing APIs that don't exist or using deprecated patterns.

**3. Context Loss**
In long conversations, AI "forgets" earlier decisions. You'll find yourself repeating architectural choices.

**4. Quality Gaps**
Generated code isn't automatically tested. You must manually verify security, types, and test coverage.

**5. Workflow Fragmentation**
Requirements -> coding -> testing -> documentation requires separate conversations.

## Part 2: Core Concepts

### CLAUDE.md - Your Project's Brain

A markdown file at your project root that gives AI context. **Both Claude Code and OpenCode read this file**.

### The Golden Rules

1. **Keep under 100 lines** - Long files dilute attention
2. **WHAT / WHY / HOW structure** - Clear organization
3. **Explain WHY** - AI makes better decisions with context
4. **Add NOT TO DO** - Prevent known AI tendencies
5. **Link to detailed docs** - Progressive disclosure

### Example CLAUDE.md

```
# MyApp

## WHAT - Project Overview
React Native app with NX monorepo.

### Tech Stack
- TypeScript 5.8, React Native 0.79
- UI: Tamagui | State: RTK Query

## WHY - Architecture Decisions
Library-first because parallel development needed.

## HOW - Conventions
- Use Tamagui primitives - cross-platform consistency
- No console.log - production performance

## Boundaries
- Always: Run tests before commits
- Ask first: New dependencies
- Never: Commit secrets
```

### Context Window - The Critical 20-40% Rule

**Important insight**: Quality doesn't degrade at 100% context - it starts at **20-40%**.

After 60% context usage, AI:

- Forgets previous instructions
- Repeats the same mistakes
- Edits wrong files
- Produces lower quality code

### Best Practices

1. **One conversation = one feature**
2. **Use `/compact` regularly**
3. **Clear with `/clear` when context bloats**
4. **Update SCRATCHPAD.md for session memory**

### Red Flags

| Signal | Action |
|---|---|
| AI repeats itself | `/clear` |
| Forgets previous context | SCRATCHPAD -> `/clear` |
| Edits wrong files | Clear context |
| Quality drop | `/compact` + `/clear` |

### MCP (Model Context Protocol)

A standard for connecting AI tools to external services (databases, APIs, documentation).

**Critical**: Claude Code and OpenCode use **different MCP formats**:

| Feature | Claude Code | OpenCode |
|---|---|---|
| Key | `mcpServers` | `mcp` |
| Command | `"command": "x"` + `"args"` | `"command": ["x", "y"]` |
| Type | Not required | `"type": "local"` required |
| Toggle | N/A | `"enabled": true/false` |

**Claude Code (`~/.claude/mcp.json`):**

```json
{
  "mcpServers": {
    "opencontext": {
      "command": "oc",
      "args": ["mcp"]
    }
  }
}
```

**OpenCode (`~/.config/opencode/opencode.json`):**

```json
{
  "mcp": {
    "opencontext": {
      "type": "local",
      "command": ["oc", "mcp"],
      "enabled": true
    }
  }
}
```

### Skills - Reusable Knowledge

Skills are instruction sets that extend AI capabilities. They're **shared between Claude Code and OpenCode**.

**Directory search order (OpenCode):**

| Priority | Directory | Shared with Claude Code? |
|---|---|---|
| 1 | `.opencode/skills/` | No |
| 2 | `.claude/skills/` | Yes |
| 3 | `~/.config/opencode/skills/` | No |
| 4 | `~/.claude/skills/` | Yes |

**Key insight**: This is **provider-agnostic** - works the same whether you use Claude, GPT, Gemini, or GLM.

**Recommendation**: Use `~/.claude/skills/` for skills shared between both tools.

## Part 3: Claude Code Mastery

### Installation

```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
```

### Essential Plugins

```
/plugin install commit-commands
/plugin install code-review
/plugin install github
/plugin install firebase
/plugin install serena
/plugin install context7
```

### Plugin Categories

**LSP (Language Server Protocol):**

- `csharp-lsp`, `typescript-lsp`, `pyright-lsp`, `gopls-lsp`
- Makes Claude understand types, detect errors, suggest imports

**Development Workflow:**

- `commit-commands` - `/commit`, `/commit-push-pr`
- `code-review` - Quality and security review
- `pr-review-toolkit` - Silent failure hunting, type analysis

**Integration:**

- `github`, `atlassian`, `notion`, `firebase`, `linear`, `figma`

**Browser Automation:**

- `playwright` - E2E testing
- `dev-browser` - Claude-controlled browser for verification

### Custom Agents

Create specialized AI assistants in `.claude/agents/`:

```
---
name: security-reviewer
description: OWASP-focused code review
tools: Read, Grep, Bash
model: sonnet
---
You are a security auditor focused on OWASP Top 10.

## Approach
1. Identify vulnerabilities
2. Rate severity (critical/high/medium/low)
3. Provide specific fixes
```

### Speckit Integration

Structured development for complex features:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init . --ai claude
```

### Critical Step: Constitution Analysis

**For existing projects, run this immediately after installation:**

```
/speckit.constitution
```

This analyzes your codebase and extracts:

- Code patterns and conventions
- Architecture decisions
- Tech stack specifics
- Naming conventions

### Feature Development Workflow

```
/speckit.specify "user authentication"
/speckit.clarify
/speckit.plan
/speckit.tasks
/speckit.implement
```

## Part 4: OpenCode Mastery

### Installation

```bash
curl -fsSL https://opencode.ai/install | bash
opencode --version
```

### Authentication

```bash
opencode auth login
# Select provider based on subscription:
# - Anthropic (if Claude subscription)
# - OpenAI (if ChatGPT Plus)
# - Google (if Gemini)
```

### oh-my-opencode - Multi-Agent System

oh-my-opencode transforms OpenCode into a multi-agent orchestration system.

**Subscription Levels Explained**

| Flag | Requirement | Effect |
|---|---|---|
| `--claude=max20` | Claude Pro/Max + 20x | Full Sisyphus orchestrator |
| `--claude=yes` | Claude Pro/Max | Standard Sisyphus |
| `--claude=no` | No Claude | Sisyphus may fail |
| `--openai=yes` | ChatGPT Plus | GPT-5.2 for Oracle |

### Agent System

| Agent | Model | Purpose |
|---|---|---|
| **Sisyphus** | Claude Opus 4.5 | Main orchestrator |
| **Oracle** | Claude Opus 4.5 / GPT-5.2 | Debugging, architecture |
| **Librarian** | GLM-4.7 (free) | Code search, context |
| **Frontend** | Claude Opus 4.5 | UI/UX engineering |
| **Document Writer** | Claude Opus 4.5 | Documentation |

### Ultrawork Mode

Trigger parallel agent execution:

```
ulw: implement authentication with tests and documentation
```

**Warning**: "Token Furnace" - can cost $50-100 per session.

## Part 5: Head-to-Head Comparison

### Performance (Real-World Tests)

Based on community benchmarks with Opus 4.5:

| Metric | Claude Code | OpenCode |
|---|---|---|
| Same task completion | 14 min | 27 min |
| Token usage | ~191k | ~278k |
| Speed | 2x faster | - |
| Cost | 30% cheaper | - |

**Note**: OpenCode's UX is widely praised as superior.

### Feature Comparison

| Feature | Claude Code | OpenCode |
|---|---|---|
| Model options | Claude only | 75+ providers |
| Local models | No | Yes (Ollama) |
| Context management | Excellent | Good |
| Subagents | Built-in | Not native |
| Remote workspaces | No | Yes |
| GitHub integration | Yes | Limited |
| Web interface | Yes | No |

### Quality Observations

**Claude Code advantages:**

- Better instruction following
- Fewer corrections needed
- Faster completion

**OpenCode advantages:**

- Wrote more tests
- Better UX
- Model flexibility

## Part 6: Choosing Your Tool

### Quick Decision Matrix

| If You Want... | Choose |
|---|---|
| Official support + stability | **Claude Code** |
| Free + model flexibility | **OpenCode** |
| Maximum automation | **oh-my-opencode** |

### Scenario-Based Recommendations

**AI Coding Beginner** - Recommendation: OpenCode

Why:
- Free to start
- Experiment with different models
- Learn without financial commitment
- Large community for help

**Professional Developer** - Recommendation: Claude Code

Why:
- Official support
- Better instruction following
- Faster execution
- Enterprise SLAs available

**Cost-Conscious Team** - Recommendation: OpenCode + ChatGPT Plus

Why:
- $20/month per developer
- Good quality with GPT-4.1
- No vendor lock-in

**Quality-Critical Project** - Recommendation: Claude Code

Why:
- Best code quality
- Better instruction following
- Fewer corrections needed

## Part 7: Using Both Tools Together

### What's Automatically Shared

| Directory | Claude Code | OpenCode |
|---|---|---|
| `~/.claude/skills/` | Reads | Reads |
| `~/.config/opencode/skills/` | No | Reads |
| `.claude/skills/` | Reads | Reads |

**Result**: Skills in `~/.claude/skills/` work with both tools automatically.

### What Needs Manual Sync

| Config | Claude Code | OpenCode | Note |
|---|---|---|---|
| MCP Servers | `mcp.json` | `opencode.json` | Format conversion required |
| Commands | `.claude/commands/` | `.opencode/command/` | Rename directory |
| Agents | `.claude/agents/` | `.opencode/agent/` | Different frontmatter |

## Part 8: Advanced Topics

### Autonomous Mode (YOLO Mode)

> **USE WITH EXTREME CAUTION** - These modes skip all permission prompts. Only use in trusted, isolated environments.

### Claude Code

```bash
claude --dangerously-skip-permissions
```

**Safety restrictions:**

- Will NOT run as root or with sudo
- Runs unattended until completion
- No file edit or bash command confirmations

### OpenCode

```json
{
  "permission": {
    "*": "allow"
  }
}
```

### When to Use

Appropriate:

- Isolated Docker containers
- Disposable VMs
- CI/CD pipelines with controlled scope
- Automated testing environments

Never use on:

- Production servers
- Systems with sensitive data
- Shared development machines
- When running untrusted prompts

### Hooks & Continuous Learning

Claude Code supports event-based automation through hooks:

| Hook | When It Runs |
|---|---|
| `PreToolUse` | Before a tool is called |
| `PostToolUse` | After a tool is called |
| `SessionStart` | At session start |
| `UserPromptSubmit` | When user sends a message |
| `Stop` | When agent stops |

**Example: Auto-lint after edits**

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "npx eslint --fix \"$CLAUDE_FILE_PATH\""
      }]
    }]
  }
}
```

### Claudeception: Continuous Learning System

**The problem:** Claude starts fresh every session. A 45-minute debugging session is forgotten in the next session.

**The solution:** [Claudeception](https://github.com/blader/Claudeception) automatically extracts non-obvious discoveries and saves them as reusable skills. Next time the same problem occurs, Claude already knows the solution.

### OpenCode: No Native Hook System

| Feature | Claude Code | OpenCode |
|---|---|---|
| Event hooks | Yes (5 hook types) | No |
| Continuous learning | Yes (Claudeception) | Manual only |
| Auto-lint | Yes (PostToolUse) | External tools |
| Session memory | Yes (Hooks + Skills) | Skills only (stateless) |

**Workaround for OpenCode:** Use external automation (shell scripts, make targets) or wait for community plugins.

### Community Resources

**Templates & Skills**

- [aitmpl.com](https://aitmpl.com/) - Agents, commands, templates
- [skills.sh](https://skills.sh/) - 200+ installable skills
- [Context7 CLI](https://github.com/upstash/context7) - Cross-platform skills

**Installation:**

```bash
npx skills add vercel/react-best-practices
npx ctx7 skills install better-icons
```

## Appendix: Quick Reference

### Command Comparison

| Task | Claude Code | OpenCode |
|---|---|---|
| Start | `claude` | `opencode` |
| Clear context | `/clear` | `/clear` |
| Compact | `/compact` | N/A |
| Plan mode | `Shift+Tab` | Similar |
| Commit | `/commit` | `/commit` |

### Directory Structure

```
# Global (user-level)
~/.claude/
├── CLAUDE.md           # Global context
├── mcp.json            # MCP servers
├── settings.json       # Hooks, preferences
└── skills/             # Shared skills (works with OpenCode too)

# Project-level
.claude/
├── CLAUDE.md           # Project context
├── agents/             # Custom agents
│   ├── code-reviewer.md
│   └── security-auditor.md
├── commands/           # Custom slash commands
│   └── git-pr.md
└── skills/             # Project-specific skills
```

---

*This guide was written using Claude Code CLI. Updated January 2026.*
