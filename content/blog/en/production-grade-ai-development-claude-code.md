---
title: "Production-Grade AI Development with Claude Code: A Comprehensive Ecosystem Guide"
description: "Transform Claude Code from a simple Q&A tool into a professional-grade development environment with plugins, custom agents, skills, MCP servers, and hooks."
date: "2026-01-21"
slug: "production-grade-ai-development-claude-code"
mediumUrl: "https://medium.com/@senrecep/production-grade-ai-development-with-claude-code-a-comprehensive-ecosystem-guide-56d7c4a3b744"
imageUrl: "/images/production-grade-ai-development-with-claude-code.webp"
---

The Claude Code ecosystem: A development environment powered by Plugins, Skills, Hooks, MCP, and Prompts

## **Introduction: “Asking Questions” Isn’t Enough**

Claude Code, Anthropic’s terminal-based AI assistant, is transforming the software development landscape. Yet most developers use Claude Code as a simple Q&A tool, barely scratching the surface of its true potential.

In this article, I’ll share how I transformed Claude Code into a professional-grade development environment across two production projects — a .NET microservices ecosystem and an NX monorepo-based React Native mobile application.

### **Tools that supercharge Claude Code:**

-   **Plugins** — From LSP support to browser automation
-   **Custom Agents** — Project and domain-specific AI assistants
-   **Skills** — Reusable knowledge and workflows
-   **MCP Servers** — External tool and service integrations
-   **Hooks** — Automation and continuous learning mechanisms
-   **Community Resources** — [aitmpl.com](https://www.aitmpl.com/) for templates, [skills.sh](https://skills.sh/) for skills

### **What you’ll learn in this article:**

-   Strategic CLAUDE.md configuration (the Less is More principle)
-   The critical importance of context window management (the 20–40% rule)
-   External memory systems (SCRATCHPAD, OpenContext)
-   Categorized use of the plugin ecosystem
-   Custom agent design strategies
-   External tool integration with MCP servers
-   Automation and continuous learning with Hooks
-   Browser automation for testing and verification
-   Structured feature development with Speckit
-   Team onboarding and knowledge sharing strategies

**⚡ Want to skip ahead?** If you prefer hands-on setup over reading, share this gist with Claude Code:

```
Read this gist and set up my project: https://gist.github.com/senrecep/98d3583717581a4138bac62344261f6f
```

Claude will automatically configure everything based on your project. Come back to this article when you want to understand _why_ each piece matters.

## Section 1: CLAUDE.md — Your Project’s Strategic Brain

### The Role of CLAUDE.md

`CLAUDE.md` is the project instructions file that Claude Code reads at the start of every conversation. Claude starts fresh each session, but this file helps it "know" your project — understanding architectural decisions, code style, and common pitfalls to avoid.

### Common Mistakes and Solutions

**Mistake #1: Writing Everything  
**My first approach was a massive 160+ line CLAUDE.md file. The result? Claude constantly missed important information.

```
Why this is wrong:├── Unnecessary token consumption every session├── Long file = scattered attention└── Critical rules get lost in the noise
```

**Mistake #2: Using It Like a Linter**

```
# WRONG APPROACH- Use semicolons at end of lines- Use 2 spaces instead of tabs- Variable names should be camelCase
```

ESLint,Biome and Prettier already handle this. Using Claude as a linter just fills up context unnecessarily.

**The Right Approach: WHAT / WHY / HOW + Progressive Disclosure  
**I use progressive disclosure for an effective CLAUDE.md structure:

```
CLAUDE.md (70-100 lines)            → Always read├── docs/claude/architecture.md     → Referenced when needed├── docs/claude/patterns.md         → Referenced when needed├── .specify/memory/constitution.md → Non-negotiable rules└── SCRATCHPAD.md                   → Inter-session memory
```

**Backend CLAUDE.md Example (Clean Architecture + CQRS)**

```
# CLAUDE.md> **New to this project?** Run `./scripts/setup-claude.sh`## WHAT - Project Overview.NET 9.0 microservices ecosystem. Clean Architecture + CQRS.### Layer Structure (each service)Core/Domain/       → Entities, Enums (NO EF dependencies - keeps domain pure)Core/Application/  → CQRS handlers, DTOs (business logic lives here)Infrastructure/    → EF Core, Repos (implements Application interfaces)Presentation/      → WebApi (thin layer, delegates to Application)## WHY - Architecture Decisions- **CQRS Split**: Separates reads/writes because we had performance issues mixing them- **Layer Isolation**: Domain has NO infrastructure deps because we had bugs from EF tracking leaking into business logic- **DI per Layer**: Each layer has ServiceRegistration.cs because scattered registrations caused missing dependency bugs## HOW - Code Style (with WHY)- `_camelCase` for private fields → distinguishes from parameters- `sealed` on public classes → prevents unintended inheritance, better performance- Explicit types (avoid `var`) → we had bugs from wrong type inference## What NOT To Do (Claude Tendencies)- **Don't over-engineer**: No extra abstractions I didn't ask for- **Don't add files**: If task can be done in existing file, do it there- **Don't add error handling for impossible scenarios**: Trust internal code
```

**Mobile CLAUDE.md Example (NX Monorepo + React Native)**

```
# Mobile Project## WHAT - Project Overview**NX monorepo** for mobile application supporting iOS, Android, and Web.### Tech Stack- TypeScript 5.8, React Native 0.79, React 18- UI: Tamagui 1.132- State: RTK Query- Backend: Firebase, RevenueCat## WHY - Architecture DecisionsThis project follows a **library-first architecture**. Every feature lives in `libs/`as a self-contained library. This enables parallel development, clear boundaries,and easier testing.## HOW - Code Conventions (with WHY)- Use Tamagui primitives (`Box`, `Text`) not React Native (`View`, `Text`)  → *because Tamagui provides cross-platform consistency*- Use theme tokens for colors/spacing  → *because hardcoded values break when theme changes*- Memoize with `useCallback`/`useMemo`  → *because re-renders cause performance issues on mobile*
```

### The Power of WHY Explanations

```
# Rule (without WHY)- No console.log# Rule (with WHY)- No console.log — *because it causes performance issues in production  and leaks sensitive data*
```

When Claude knows “why,” it makes better decisions even in edge cases. If you say “don’t use console.log,” it won’t use it even during debugging. But if you say “it causes performance issues in production,” it understands that temporary use during development is acceptable.

### Global CLAUDE.md — Instructions That Apply to All Projects

The `~/.claude/CLAUDE.md` file contains global instructions that apply across all projects. For example, I define frequently used CLI tools here:

```
## JSON Tools AvailableI have the following CLI tools installed for JSON processing:- **jq** - JSON query and transformation (`jq '.key' file.json`)- **fx** - Interactive JSON explorer (`fx data.json` or pipe with `| fx`)- **jless** - Terminal JSON viewer with vim-like navigation- **gron** - Makes JSON grep-friendly (`gron file.json | grep "key"`)When working with JSON files:- Use `jless` for quick inspection of large files- Use `gron | grep` to find specific values- Use `fx` for interactive exploration and JavaScript transformations- Use `jq` for complex queries and transformations
```

**Why a global CLAUDE.md?** Instead of defining the same tools repeatedly in every project, I define them once in the global file and use them across all projects. Claude knows which tools it can use when working with JSON files and selects the appropriate one.

**Pro Tip: Subagent Control  
**Claude Code sometimes spawns Sonnet or Haiku subagents even for knowledge tasks. For higher quality output, add this line to your global CLAUDE.md:

```
## Subagent PreferencesAlways launch opus subagents for knowledge-intensive tasks.
```

On large projects, the **Orchestrator + Subagents** combination works far more effectively than vanilla Claude Code.

### CLAUDE.md Golden Rules

```
| Rule                       | Why                                              ||----------------------------|--------------------------------------------------|| **< 100 lines**            | Long files fill up context                       || **Explain WHY**            | Claude makes better decisions when it knows "why"|| **Add NOT TO DO**          | Prevent Claude's known tendencies                || **Progressive disclosure** | Reference details in separate files              |
```

### **Six Areas Every Effective CLAUDE.md Covers**

The WHAT/WHY/HOW structure defines _how_ to present information, while the six areas below define _what types_ of information should be included. Using both together yields the most effective results.

Through trial and error, I noticed that well-functioning CLAUDE.md files share a common structure. Each one covers these six areas:

```
| Area                  | What to Include                                        ||-----------------------|--------------------------------------------------------|| **Commands**          | Executable commands with flags (`npm test --coverage`) || **Testing**           | Test framework, patterns, coverage expectations        || **Project Structure** | Key directories and their purposes                     || **Code Style**        | Examples of good code, not just descriptions           || **Git Workflow**      | Branch naming, commit format, PR process               || **Boundaries**        | What the AI should never touch  
```

**I use a three-tier approach for boundaries:**

```
## Boundaries- ✅ **Always:** Run tests before commits, follow naming conventions- ⚠️ **Ask first:** Database migrations, new dependencies- 🚫 **Never:** Commit secrets, edit lock files, delete tests
```

**The most important thing I learned:** Instead of writing three paragraphs _describing_ your style, include one code snippet _showing_ it. Claude learns far better from examples. Also, put commands at the top of your file — Claude references them frequently.

**How do we fit all this in 100 lines?** Write the _summary_ of each area in CLAUDE.md — detailed patterns, lengthy code examples, and comprehensive explanations live in separate files under `docs/claude/`. For example:

-   CLAUDE.md: “Code style: `_camelCase` for private fields, `sealed` on public classes"
-   `docs/claude/code-style.md`: 20+ lines of detailed examples, edge cases, anti-patterns

## Section 2: Context Window — The Most Critical Topic

### The 20–40% Rule

```
| Metric                          | Value          ||---------------------------------|----------------|| Opus 4.5 Context                | 200,000 tokens || **Quality degradation begins**  | **20-40%**     || Critical degradation            | 60%+           |
```

Most developers assume context works fine until it’s 100% full. The reality is that **quality loss begins around 20–40%**. After 60%, Claude:

-   Forgets previous instructions
-   Repeats the same mistakes
-   Edits wrong files
-   Produces lower quality code

### **The “One Conversation = One Feature” Principle**

```
❌ WRONG: Everything in one conversation├── Build auth system├── Change database schema├── Update UI components└── (Context exploded, quality dropped)✅ RIGHT: Focused conversationsSession 1: Auth planning → Decisions to SCRATCHPADSession 2: Login implementationSession 3: Error handlingSession 4: Profile page
```

### The Copy-Paste Reset Technique

When context bloats:

1.  Copy important information (terminal output, code snippets)
2.  Get a summary with `/compact`
3.  Clear with `/clear`
4.  Paste and continue

```
"We're working on the auth system.- LoginScreen completed- authSlice exists in Redux store- Now we'll do error handlingLet's continue."
```

### Red Flags — When to Clear?

```
| Signal                        | Action                         ||-------------------------------|--------------------------------|| Claude keeps repeating itself | `/clear`                       || Forgetting previous context   | Write to SCRATCHPAD, `/clear`  || Editing wrong files           | Clear context                  || Noticeable quality drop       | `/compact` + `/clear`          |
```

## Section 3: External Memory Systems

Claude is stateless. Every conversation starts from scratch. So how do we carry information between sessions?

### SCRATCHPAD.md — Inter-Session Memory

A `SCRATCHPAD.md` file at the project root:

```
# Scratchpad - External Memory## Current Task[Currently active task]## Key Decisions Made| Decision | Why | Date ||----------|-----|------|| JWT (not session) | Mobile-first, offline support | 2024-01-15 |## Files Modified- file1.cs - Added X- file2.cs - Refactored Y## Notes for Next Session[Important notes for the next session]
```

**Workflow:**

1.  At session start: “Read SCRATCHPAD.md”
2.  When important decision is made: Update the file
3.  At session end: Add notes
4.  After `/clear`: "Read SCRATCHPAD.md"

**Alternative: progress.txt Pattern** — A more minimal approach for autonomous loops (like Ralph):

```
# progress.txt## Completed- [x] Auth module - JWT implementation- [x] User service - CRUD endpoints## Current- [ ] Payment integration - Stripe setup## Decisions- Used repository pattern for data access (testability)## Next Session Notes- Stripe webhook signature verification pending
```

This pattern is especially powerful when combined with `git commit`: progress.txt is updated and committed at the end of each iteration. Future iterations have full context through the git history + progress.txt combination.

### OpenContext — Persistent Memory Across Projects

OpenContext enables you to share knowledge across multiple projects.

```
npm install -g @aicontextlab/cli/opencontext-context  /opencontext-search   /opencontext-create   
```

My global MCP configuration (`~/.claude/mcp.json`):

```
{  "mcpServers": {    "opencontext": {      "command": "oc",      "args": ["mcp"]    }  }}
```

### Claude Code Indexer — Persistent Memory That Understands Your Codebase

Claude Code Indexer is a multi-language code indexing tool that works with a **graph database**. It supports **Python, JavaScript, TypeScript, Java, and AutoIt**.

**Smart File Management:**

-   Automatically ignores `node_modules/` and `.git/` directories
-   Respects `.gitignore` rules — doesn't index unnecessary files
-   This enables fast and efficient operation even on large projects

**Core Capabilities:**

-   **Multi-keyword Search**: Search with multiple keywords
-   **Semantic Indexing**: Understands code relationships through graph structure
-   **LLM Memory**: Stores Claude’s previous analyses — no need to re-analyze the same file
-   **Coding Patterns & Best Practices**: Stores patterns and best practices you’ve established for the project
-   **Critical Components**: Identifies and prioritizes critical components in the project

**MCP Integration:** Works as a native MCP server with Claude Desktop. Installation is automated — no manual configuration needed.

**Why I use it:** Claude doesn’t need to rediscover the codebase every session. Analyses from previous sessions, established patterns, and architectural insights are preserved. This saves significant time, especially on large projects.

```
mcp__claude-code-indexer__index_codebase      mcp__claude-code-indexer__search_code         mcp__claude-code-indexer__get_coding_patterns mcp__claude-code-indexer__store_llm_memory    
```

## Section 4: Plugin Ecosystem — Supercharged Development

The real power of Claude Code lies in plugins. Here’s the distribution of plugins I use by category:

### LSP Plugins (Language Server Protocol)

```
| Plugin           | Language   | Why Critical                         ||------------------|------------|--------------------------------------|| `csharp-lsp`     | C#         | Type errors, IntelliSense in backend || `typescript-lsp` | TypeScript | Type-aware suggestions in mobile     || `pyright-lsp`    | Python     | For scripts and automation           || `gopls-lsp`      | Go         | CLI tool development                 || `kotlin-lsp`     | Kotlin     | Android native development           || `lua-lsp`        | Lua        | Neovim config, game scripting        |
```

**Without LSP** Claude sees code as just text. **With LSP** it detects type errors, missing imports, unused variables — everything.

### Development Workflow Plugins

```
| Plugin              | Description                  | Use Case                             ||---------------------|------------------------------|--------------------------------------|| `commit-commands`   | `/commit`, `/commit-push-pr` | Git workflow automation              || `code-review`       | Code review                  | Pre-PR quality check                 || `pr-review-toolkit` | Detailed PR review agents    | Silent failure hunting, type analysis|| `feature-dev`       | Guided feature development   | Complex feature implementation       || `code-simplifier`   | Code simplification          | Refactoring                          || `security-guidance` | Security best practices      | Vulnerability scanning               |
```

### Integration Plugins

```
| Plugin      | Integration     | Use                          ||-------------|-----------------|------------------------------|| `github`    | GitHub          | Issues, PRs, Actions         || `atlassian` | Jira/Confluence | Task tracking, documentation || `Notion`    | Notion          | Knowledge base               || `firebase`  | Firebase        | Auth, Firestore, hosting     || `linear`    | Linear          | Issue tracking               || `figma`     | Figma           | Design-to-code               |
```

### Semantic Analysis & Documentation

```
| Plugin            | Use                                        ||-------------------|--------------------------------------------|| `serena`          | Semantic code analysis, symbol navigation  || `context7`        | Library documentation lookup               || `greptile`        | Cross-repo semantic search                 || `document-skills` | PDF, spreadsheet, documentation generation |
```

### Browser Automation

```
| Plugin        | Use                                    ||---------------|----------------------------------------|| `playwright`  | Browser testing, E2E automation        || `dev-browser` | Claude-controlled browser for testing  |
```

### Productivity & UI

```
| Plugin                  | Use                        ||-------------------------|----------------------------|| `claude-hud`            | Status line enhancement    || `hookify`               | Custom hooks creation      || `learning-output-style` | Educational output mode    || `design-and-refine`     | Iterative design workflow  || `claude-stt`            | Speech-to-text input       |
```

## Section 5: Custom Agents — Project and Domain-Specific AI Assistants

**💡Find Ready-Made Agents:** Browse community agents at [aitmpl.com/agents](https://www.aitmpl.com/agents) — pre-built agents for code review, debugging, architecture, and more.

### What is an Agent?

An agent is a Claude instance specialized for a specific task. It’s defined by a system prompt + tool restrictions.

### Why I Use Custom Agents

**1\. Domain Expertise**: An agent specialized in Clean Architecture, CQRS, or React Native performance is far more effective than general-purpose Claude.

**2\. Consistent Approach**: Guarantees a consistent approach for the same type of tasks. A security auditor always follows the same checklist.

**3\. Tool Restrictions**: Security layers like preventing a debugger agent from having file deletion permissions.

**4\. Focused Context**: The agent’s system prompt focuses only on its own domain, context doesn’t fill with unnecessary information.

### Agent Categories in Backend Project

**Architecture & Design:**

-   `backend-architect` — API design, microservice boundaries, scalability
-   `database-architect` — Schema design, normalization, indexing strategies
-   `cloud-architect` — Cloud infrastructure, deployment patterns

**Code Quality:**

-   `c-sharp-pro` — Modern C# 12/13 features, async patterns, LINQ
-   `security-auditor` — OWASP Top 10, vulnerability detection
-   `code-reviewer` — Quality, maintainability, best practices

**Maintenance:**

-   `dotnet-upgrade` — .NET version migration
-   `unused-code-cleaner` — Dead code removal
-   `architecture-modernizer` — Legacy to modern architecture

### Agent Categories in Mobile Project

**Development:**

-   `typescript-pro` — Modern TypeScript, generics, utility types
-   `mobile-developer` — Cross-platform mobile patterns
-   `ios-developer` — iOS-specific development, Swift interop

**Performance & Quality:**

-   `react-performance-optimization` — React Native performance, memoization
-   `debugger` — Root cause analysis, stack trace interpretation
-   `performance-engineer` — App performance, memory leaks, startup time

**Process:**

-   `git-flow-manager` — Branch strategy, merge conflicts
-   `context-manager` — Multi-agent coordination

### Agent File Structure

```
---name: c-sharp-prodescription: Write idiomatic C# code with modern language features.tools: Read, Write, Edit, Bashmodel: sonnet---You are a C# and .NET expert specializing in modern, performant enterprise applications.## Focus Areas- Modern C# features (C# 12/13) - primary constructors, collection expressions- Async/await patterns, Task Parallel Library- Clean Architecture, CQRS, Mediator patterns## Approach1. Leverage C# language features for concise, expressive code2. Apply SOLID principles and Domain-Driven Design3. Use async/await properly - avoid blocking calls
```

### Defining Boundaries: The Three-Tier Approach

**Note:** You can use this approach both in CLAUDE.md (project-wide boundaries) and in agent files (agent-specific boundaries). We saw an example for CLAUDE.md in Section 1 above.

My first agents only had a “don’t do” list. But Claude sometimes became overly cautious because it didn’t know what it _could_ do. Now I use a three-tier system:

```
## Boundaries- ✅ **Always do:** Write to `tests/`, run tests before commits, follow naming conventions- ⚠️ **Ask first:** Database schema changes, adding dependencies, modifying CI/CD config- 🚫 **Never do:** Commit secrets, edit `node_modules/`, remove failing tests
```

The advantage of this approach:

-   **“Always do”** shows the agent where it can act confidently
-   **“Ask first”** defines gray areas — risky but sometimes necessary operations
-   **“Never do”** draws hard lines — critical for destructive actions

For example, here’s how I define boundaries for my `test-agent`:

```
## Boundaries- ✅ **Always:** Write to `tests/`, use existing test patterns, run `npm test` to verify- ⚠️ **Ask first:** Adding new test dependencies, changing test configuration- 🚫 **Never:** Modify source code in `src/`, remove failing tests, skip test verification
```

### The Agent Template I Use

When creating a new agent, I follow this structure:

```
---name: your-agent-namedescription: [One-sentence description of what this agent does]tools: Read, Write, Edit, Bashmodel: sonnet---You are an expert [role] for this project.## Your Role- You specialize in [specific domain]- You understand [relevant patterns/technologies]- Your output: [what you produce]## Project Knowledge- **Tech Stack:** [technologies with versions]- **Key Directories:**  - `src/` – [what's here]  - `tests/` – [what's here]## Commands You Can Use- **Build:** `npm run build`- **Test:** `npm test`- **Lint:** `npm run lint --fix`## Boundaries- ✅ **Always:** [safe actions]- ⚠️ **Ask first:** [risky but sometimes needed]- 🚫 **Never:** [destructive actions]
```

## Section 6: Skills — Reusable Knowledge and Workflows

**💡 Discover Skills:** Browse community skills at [skills.sh](https://skills.sh/) — 200+ installable skills with `npx skills add <owner/repo>`

**Cross-Platform Management:** [Context7 CLI](https://github.com/upstash/context7/tree/master/packages/cli) (ctx7) manages skills across Claude Code, Cursor, Codex, and other AI editors:

```
npx ctx7 skills search [term]   npx ctx7 skills install [skill] 
```

### The Difference Between Skill and Agent

```
| Agent                    | Skill                       ||--------------------------|-----------------------------|| Autonomous task executor | Reusable knowledge/workflow || Runs as subagent         | Runs in main conversation   || Has tool restrictions    | Uses all available tools    || Task-focused             | Knowledge-focused           |
```

### Why I Create Custom Skills

**1\. Continuous Learning**: To prevent knowledge learned in each session from being lost. The Claudeception skill exists exactly for this purpose — it automatically extracts non-obvious debugging solutions and project-specific patterns.

**2\. Cross-Project Knowledge**: React Native performance patterns learned in one project apply to other projects too. Once saved as a skill, it becomes globally available.

**3\. Standardized Workflows**: Instead of remembering the same commands for browser automation every time, I use workflows defined within skills.

**4\. Team Knowledge Sharing**: When a new team member starts using Claude Code, they already have access to accumulated skills.

### My Global Skill Categories

**Learning & Knowledge Extraction:**

-   `claudeception` — Automatically extracts knowledge from conversations. Non-obvious debugging solutions and project-specific patterns are saved as skills.

**Browser Automation:**

-   `agent-browser` — Provides standardized workflows for headless browser commands. Offers a consistent interface for operations like element selection, form filling, and taking screenshots.

**Development Best Practices:**

-   `vercel-react-best-practices` — React and Next.js performance optimization patterns. Provides guidance on memoization, lazy loading, and bundle optimization.
-   `react-native-best-practices` (Callstack) — Production-tested optimization skills for React Native and Expo. Years of experience from the Callstack team: startup time, re-renders, list performance, memory management. Why I use this skill pack: Mobile performance issues typically fall into the same patterns — FlatList virtualization, memoization strategies, Hermes optimizations. Instead of doing the same research every time, I can quickly apply proven solutions.

**UI/UX:**

-   `web-design-guidelines` — Accessibility, responsive design, UX best practices. Used in UI code reviews.

**External Integration:**

-   `opencontext-*` — Persistent memory integration across projects. Context loading, search, and new doc creation workflows.

### Claudeception: The Continuous Learning System

The main reason I use Claudeception: **Claude starts fresh every session**. A non-obvious solution discovered in one session is forgotten in the next.

**When do I extract skills?**

1.  **Non-obvious Solutions**: Debugging techniques not found in documentation
2.  **Project-Specific Patterns**: Conventions specific to the project
3.  **Error Resolution**: Error messages and their actual solutions
4.  **Workflow Optimizations**: Multi-step processes

**Quality Criteria:**

-   Will it be reusable in the future?
-   Is it knowledge that required discovery?
-   Can specific trigger conditions be defined?
-   Did the solution actually work?

## Section 7: MCP Servers — External Tool Integration

### What is MCP?

Model Context Protocol — A protocol that adds external tools to Claude.

### Project-Local MCP

**In the mobile project** (`.mcp.json`):

```
{  "mcpServers": {    "nx-mcp": {      "type": "stdio",      "command": "npx",      "args": ["nx-mcp"]    }  }}
```

### Global MCP

`~/.claude/mcp.json`:

```
{  "mcpServers": {    "context7": {      "command": "npx",      "args": ["-y", "@anthropic/context7-mcp"],      "description": "Documentation lookup for libraries"    },    "serena": {      "command": "uvx",      "args": ["serena-mcp"],      "description": "Semantic code analysis"    },    "opencontext": {      "command": "oc",      "args": ["mcp"]    }  }}
```

### MCP Use Cases

```
| MCP Server    | Use                                      ||---------------|------------------------------------------|| `context7`    | Library documentation lookup             || `serena`      | Semantic code navigation, symbol finding || `nx-mcp`      | NX workspace analysis                    || `opencontext` | Cross-project knowledge base             |
```

## Section 8: Hooks — Automation and Continuous Learning

### Hook Types

```
| Hook               | When It Runs               ||--------------------|----------------------------|| `PreToolUse`       | Before a tool is called    || `PostToolUse`      | After a tool is called     || `SessionStart`     | At session start           || `UserPromptSubmit` | When user sends a message  || `Stop`             | When agent stops           |
```

### Claudeception Activator Hook

In my global settings (`~/.claude/settings.json`):

```
{  "hooks": {    "UserPromptSubmit": [      {        "hooks": [          {            "type": "command",            "command": "~/.claude/hooks/claudeception-activator.sh"          }        ]      }    ]  }}
```

**What does this hook do?** It reminds Claude with every prompt:

-   “Did you learn something non-obvious in this task?”
-   “Is there something that would be useful in similar situations in the future?”
-   “If yes, run the claudeception skill”

**Result**: Claude automatically creates new skills and knowledge accumulates.

### PostToolUse: Auto-Lint Hook Example

Running ESLint after every file edit:

```
{  "hooks": {    "PostToolUse": [      {        "matcher": "Edit|Write",        "hooks": [          {            "type": "command",            "command": "bash -c 'if [[ \"$CLAUDE_FILE_PATH\" =~ \\.(ts|tsx)$ ]]; then npx eslint --fix \"$CLAUDE_FILE_PATH\" 2>/dev/null || true; fi'"          }        ]      }    ]  }}
```

## Section 9: Browser Automation — Testing and Verification

### Dev-Browser Plugin

A plugin that enables Claude to control the browser:

```
# Use case examples"Open localhost:3000 and verify the signup flow works""Go to the settings page and figure out why the save button isn't working""Test the checkout process end-to-end"
```

**Features:**

-   **Persistent Pages**: Navigate once, Claude can run multiple scripts
-   **LLM-Optimized DOM Snapshots**: Page inspection optimized for AI
-   **Stateful Server**: State is preserved throughout the session

### Agent-Browser Skill

A command-line tool for headless browser automation:

```
agent-browser open <url>        agent-browser snapshot -i       agent-browser click @e1         agent-browser fill @e2 "text"   agent-browser screenshot        agent-browser close             
```

**Workflow:**

1.  Navigate: `agent-browser open <url>`
2.  Snapshot: `agent-browser snapshot -i` (returns elements with refs like `@e1`, `@e2`)
3.  Interact using refs from the snapshot
4.  Re-snapshot after significant DOM changes

### Security: Docker Sandbox

When coding AFK (Away From Keyboard) — especially in autonomous loops like Ralph — having Claude with full access to your system can be risky. Isolated operation with Docker sandbox:

```
docker sandbox run claude
```

This command runs Claude Code inside a container — your project files are mounted but access to home directory, SSH keys, and system files is blocked. Optional for HITL (Human-in-the-loop) coding, but a critical security layer for autonomous loops running overnight.

## Section 10: Speckit — Structured Feature Development

A 5-step workflow for complex features:

```
/speckit.specify "Feature description"  /speckit.clarify                        /speckit.plan                           /speckit.tasks                          /speckit.implement                      
```

### Constitution

A file that defines project principles — non-negotiable rules:

```
# .specify/memory/constitution.md## Non-Negotiable Principles### I. Clean Architecture & Layer SeparationEvery service MUST follow the four-layer structure with strict dependency rules:- **Domain Layer**: Entities, Enums. MUST NOT reference EF Core.- **Application Layer**: CQRS handlers, DTOs. MUST only depend on Domain.- **Infrastructure Layer**: EF Core, Repositories.- **Presentation Layer**: WebApi, Controllers. Thin layer.### II. CQRS Pattern EnforcementAll data operations MUST follow Command-Query Responsibility Segregation.### III. Build-Test-Commit Workflow (NON-NEGOTIABLE)No code changes may be committed without passing verification:1. **Build**: `dotnet build` MUST succeed with zero errors2. **Test**: Relevant tests MUST pass3. **Commit**: Only after build and tests pass### IV. Code Style Standards- Private fields: `_camelCase`- Interfaces: `IPascalCase`- File-scoped namespaces- Explicit types (avoid `var`)- Public classes: `sealed` unless designed for inheritance### V. Simplicity & YAGNI- Only make changes directly requested- Do not add features beyond scope- Three similar lines > premature abstraction- Delete unused code completely
```

### When to Use Speckit?

```
| Situation            | Approach                    ||----------------------|-----------------------------|| Simple bug fix       | Do directly                 || Small feature        | Plan mode (Shift+Tab)       || Complex feature      | `/speckit.specify` workflow || Multi-service change | Definitely Speckit          |
```

## Section 11: Custom Commands

Define frequently used workflows as commands.

**/git-pr — Commit, Push, PR**

```
# .claude/commands/git-pr.mdCommit staged changes, push to remote, and create a pull request.## Steps1. Run `git status` to see changes2. Run `git diff --staged` to review staged changes3. Run `git log -3 --oneline` for recent commit style4. Create commit with semantic message5. Push to remote with `-u` flag6. Create PR using `gh pr create`## Commit Formattype(scope): descriptionCo-Authored-By: Claude <noreply@anthropic.com>
```

**/git-fix-issue — Fetch and Fix Issue**

```
# .claude/commands/git-fix-issue.md---args: issue_number---Fetch GitHub issue and implement the fix.## Steps1. Fetch issue: `gh issue view $ARGUMENTS`2. Create branch: `git checkout -b fix/issue-{number}`3. Analyze and implement fix4. Run tests5. Commit with `fixes #{number}` reference
```

## Section 12: Team Onboarding

### Project-Local vs Global

```
| Component               | Location     | Scope   | Git? ||-------------------------|--------------|---------|------|| CLAUDE.md               | Project root | Project | ✅   || .claude/agents/         | Project      | Project | ✅   || .claude/commands/       | Project      | Project | ✅   || .claude/skills/         | Project      | Project | ✅   || .mcp.json               | Project root | Project | ✅   || .specify/               | Project      | Project | ✅   || ~/.claude/plugins/      | Home         | Global  | ❌   || ~/.claude/mcp.json      | Home         | Global  | ❌   || ~/.claude/hooks/        | Home         | Global  | ❌   || ~/.claude/settings.json | Home         | Global  | ❌   |
```

### Setup Script

```
#!/bin/bashCRITICAL_PLUGINS=(    "csharp-lsp@claude-plugins-official"    "typescript-lsp@claude-plugins-official"    "context7@claude-plugins-official"    "serena@claude-plugins-official"    "commit-commands@claude-plugins-official"    "code-review@claude-plugins-official"    "github@claude-plugins-official"    "playwright@claude-plugins-official")for plugin in "${CRITICAL_PLUGINS[@]}"; do    claude plugins install "$plugin"doneecho "Claude Code setup complete!"
```

### Onboarding Checklist

For a new developer:

1.  **Clone repo** — project-local configs come with it
2.  **Run setup script**: `./scripts/setup-claude.sh`
3.  **Restart Claude** — plugins become active
4.  **Read onboarding doc**: `docs/AI_SETUP.md`
5.  **Load context**: `/opencontext-context` (if available)

## Section 13: Advanced Tools That Extend the Ecosystem

So far we’ve covered the basic configuration of Claude Code. In this section, I’m introducing community tools that take the ecosystem to the next level — for autonomous coding, persistent memory, and visual workflow design:

### Auto-Claude — Autonomous Multi-Agent Framework

[github.com/AndyMik90/Auto-Claude](https://github.com/AndyMik90/Auto-Claude)

**What does it do?**

-   Autonomous multi-agent coding framework
-   Automates planning, implementation, and validation
-   **Parallel agent terminals** for simultaneous task execution
-   Isolated changes with git worktrees
-   AI-powered merge conflict resolution
-   Three-layer security model (OS-level isolation, filesystem restrictions, command allowlisting)

**Why it matters:** Transforms Claude Code from a single-task tool into a production-grade autonomous development system. Visualizes project management with a desktop application and Kanban board visualization.

### Claude OS — AI Memory System

[github.com/brobertsaz/claude-os](https://github.com/brobertsaz/claude-os)

**What does it do?**

-   Gives Claude **persistent memory**
-   Remembers architectural decisions, coding patterns, project preferences
-   Natural language memory saving (“remember this…”)
-   **Hybrid indexing**: tree-sitter + semantic embeddings
-   Phase 2 selective semantic embedding — top 20% important files
-   One-click setup with community skills
-   4 knowledge bases per project: memories, profile, index, docs

**Why it matters:** Instead of starting from scratch every session, Claude begins to accumulate institutional knowledge. Achieves the same search quality with fewer embedding chunks.

### CC-WF-Studio — Visual Workflow Editor

[github.com/0xSojalSec/cc-wf-studio](https://github.com/0xSojalSec/cc-wf-studio)

**What does it do?**

-   **VSCode extension** as visual workflow editor
-   Drag-and-drop node creation

**Multiple node types:**

-   **Prompt**: Reusable templates with `{{variables}}`
-   **Sub-Agent**: Autonomous AI agents with tool permissions
-   **Skill Nodes**: Integration with existing skills
-   **MCP Tools**: External service connections
-   **Control Flow**: IfElse, Switch, AskUserQuestion
-   **AI-assisted workflow refinement** — improve workflows with natural language
-   One-click export to `.claude/agents/` and `.claude/commands/`
-   Multi-language support (EN, JP, KR, CN)

**Why it matters:** You can visually design complex agent workflows without writing code.

### Browser Automation Tools

**Agent-Browser** ([vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser))

-   Rust implementation + Node.js fallback
-   Reference-based element selection (`@e1`, `@e2`)
-   Accessibility tree extraction
-   Multi-session support
-   CLI-first design for AI agent workflows

**Dev-Browser** ([SawyerHood/dev-browser](https://github.com/SawyerHood/dev-browser))

-   Persistent pages across interactions
-   LLM-optimized DOM snapshots
-   Chrome extension for logged-in sessions

## Section 14: Community Ecosystem — Don’t Build Everything From Scratch

One of the biggest productivity gains comes from leveraging community resources. Two platforms have emerged as essential destinations for Claude Code users:

### AI Templates (aitmpl.com)

[**aitmpl.com**](https://www.aitmpl.com/) — The complete Claude Code template marketplace.

```
| Category       | What You'll Find                                           ||----------------|------------------------------------------------------------|| **Agents**     | Pre-built agents for code review, debugging, architecture  || **Commands**   | Ready-to-use git workflows, deployment scripts             || **Settings**   | Optimized settings.json configurations                     || **Hooks**      | Auto-lint, CI triggers, learning hooks                     || **MCPs**       | Model Context Protocol server configurations               || **Skills**     | Reusable knowledge modules                                 || **Templates**  | Complete project setups (React, Next.js, .NET, etc.)       |
```

**Why it matters:** Instead of writing every agent and command from scratch, start with battle-tested templates. The platform includes 30+ company stacks (OpenAI, Stripe, AWS, GitHub) — configurations proven in production.

**Additional tools:**

-   Analytics dashboard for Claude session monitoring
-   Health check diagnostics for optimization
-   Conversation monitor for response analysis

## Skills.sh — The Agent Skills Directory

[**skills.sh**](https://skills.sh/) — 200+ installable skills for AI agents.

```
npx skills add <owner/repo>
```

```
| Feature              | Details                                          ||----------------------|--------------------------------------------------|| **Skills Count**     | 200+ and growing                                 || **Supported Agents** | 15+ (Claude Code, Cursor, Copilot, Gemini, etc.) || **Contributors**     | Vercel, Anthropic, Expo, community developers    || **Installation**     | Single command via npx                           |
```

**Popular skills include:**

-   React and web design best practices
-   Framework-specific guidance (Expo, Next.js, Remix)
-   Security and testing utilities
-   Development workflow automation

## Best Practices Summary

### CLAUDE.md

-   Keep under 100 lines
-   WHAT / WHY / HOW structure
-   Add WHY explanations
-   Add NOT TO DO section
-   Progressive disclosure (details in separate files)

### Context Management

-   One conversation = one feature
-   Use SCRATCHPAD.md
-   Apply copy-paste reset
-   Watch for red flags
-   Use `/compact` regularly

### Ecosystem

-   Install LSP plugin (for your language)
-   Install critical workflow plugins
-   Define project-local MCP (.mcp.json)
-   Create custom agents (domain-specific)

### Team

-   Create setup-claude.sh script
-   Commit project-local configs to repo
-   Write docs/AI\_SETUP.md documentation

### Workflow

-   Use plan mode (Shift+Tab)
-   Use Speckit for complex features
-   Define constitution
-   Automate with hooks

### Quick Setup: Let Claude Do It For You

Now that you understand the WHY and HOW, here’s the fastest way to set everything up: **let Claude Code do it for you**.

I’ve created a comprehensive gist that serves as both a knowledge base and setup guide. Simply share it with Claude Code, and it will:

1.  **Detect your scenario** — New project or existing codebase
2.  **Create a checklist** — Track what needs to be done
3.  **Set up everything** — CLAUDE.md, agents, commands, directory structure
4.  **Handle cross-platform issues** — Automatically adapts to macOS/Linux/Windows
5.  **Install missing tools** — Detects and offers to install `uv`, `gh`, `node`, etc.

### How to Use

Open Claude Code in your project directory and type:

```
Read this gist and set up my project: https://gist.github.com/senrecep/98d3583717581a4138bac62344261f6f
```

### What Happens Next

**For New Projects (no source code yet):**

Claude will ask discovery questions:

-   What are you building?
-   Which language/framework?
-   What’s the MVP scope?

Then it creates everything: constitution, CLAUDE.md, agents, commands, and helps you start your first feature with Speckit.

**For Existing Projects:**

Claude analyzes your codebase first:

-   Detects tech stack and architecture
-   Identifies build/test/lint commands
-   Notes existing conventions

Then it creates a customized Claude ecosystem that respects your existing patterns.

### The Gist Contains

```
| Section    | Purpose                                                       ||------------|---------------------------------------------------------------|| **Part A** | New project setup flow with checklist                         || **Part B** | Existing project setup flow with checklist                    || **Part C** | Core templates (CLAUDE.md, agents, commands)                  || **Part D** | Plugin & tool installation guides                             || **Part E** | Instructions for Claude (scenario detection, error handling)  |
```

### Cross-Platform Support

The gist includes automatic handling for:

-   **Missing tools**: If `uv` or `gh` isn't installed, Claude detects your OS and offers the correct install command
-   **OS differences**: Unix commands like `cat` and `ls` are automatically adapted for Windows (PowerShell equivalents)
-   **Package managers**: Uses `brew` on macOS, `apt` on Linux, `winget` on Windows

### Why Use the Gist?

```
| Manual Setup           | Gist-Assisted Setup           ||------------------------|-------------------------------|| Read entire article    | Skim article for concepts     || Remember all steps     | Claude tracks checklist       || Copy-paste templates   | Claude customizes templates   || Debug setup issues     | Claude handles errors         || ~1-2 hours             | ~10-15 minutes                |
```

The article explains WHY. The gist tells Claude WHAT to do. Together, they give you a production-grade setup in minutes.

## Conclusion

When properly configured, Claude Code can radically transform your software development process. The configuration I’ve shared in this article — plugins, custom agents, hooks, MCP servers, skills — evolved iteratively over months.

**Key takeaways:**

1.  **CLAUDE.md should be short and concise** — supported with WHY
2.  **Context management is critical** — quality starts degrading at 20–40%
3.  **External memory is essential** — use SCRATCHPAD and OpenContext
4.  **The plugin ecosystem is powerful** — LSP + workflow + integration
5.  **Custom agents are valuable** — domain-specific expertise
6.  **Hooks enable automation** — continuous learning is possible
7.  **Browser automation is necessary for testing** — Dev-browser, agent-browser
8.  **Speckit for complex features** — structured development

Adapt this configuration to your own projects. Every project is different — the important thing is to understand the patterns and customize them to your needs.

_A final note: This article, including all of the above tools, was written entirely using Claude Code CLI — from outline creation, research, drafting, to iterative editing. The best way to test your tools is to use them every day._

## Resources

### Quick Setup

-   [Claude Code Ecosystem Setup Gist](https://gist.github.com/senrecep/98d3583717581a4138bac62344261f6f)

### Official Documentation

-   [Claude Code Documentation](https://docs.anthropic.com/claude-code)
-   [HumanLayer — Writing Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

### Community Resources

-   [AI Templates (aitmpl.com/agents)](https://www.aitmpl.com/agents) — Community-driven platform for Claude Code templates. Find agents, commands, settings, hooks, MCPs, plugins, skills, and complete project templates. A constantly growing ecosystem with community contributions.
-   [Skills.sh](https://skills.sh/) — The Open Agent Skills Ecosystem. 200+ installable skills for Claude Code and other AI agents. Install with `npx skills add <owner/repo>`. Includes skills from Vercel, Anthropic, Expo, and community contributors.
-   [Context7 CLI (Upstash)](https://github.com/upstash/context7/tree/master/packages/cli) — Cross-platform skills registry. Manage AI coding skills across Claude Code, Cursor, Codex, OpenCode, and other editors with `npx ctx7 skills install`.
-   [Awesome Claude Skills (VoltAgent)](https://github.com/VoltAgent/awesome-claude-skills) — Curated skill collection. Includes official Anthropic skills, partner skills, and community contributions. A great resource to start when looking for new skills.

### Tools and Projects

-   [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)
-   [SawyerHood/dev-browser](https://github.com/SawyerHood/dev-browser)
-   [AndyMik90/Auto-Claude](https://github.com/AndyMik90/Auto-Claude)
-   [brobertsaz/claude-os](https://github.com/brobertsaz/claude-os)
-   [0xSojalSec/cc-wf-studio](https://github.com/0xSojalSec/cc-wf-studio)

**About the Author  
**\- Website: [senrecep.com](https://senrecep.com/)  
\- GitHub: [senrecep](https://github.com/senrecep)  
\- LinkedIn: [senrecep](https://linkedin.com/in/senrecep)  
\- X: [@senrecep0](https://twitter.com/senrecep0)