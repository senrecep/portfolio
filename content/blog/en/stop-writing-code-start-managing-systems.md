---
title: "Stop Writing Code, Start Managing Systems: The Real Potential of AI-Powered Development"
description: "A deep dive into Claude Code production usage across multiple projects - the mindset shift from writing code to orchestrating AI systems, covering CLAUDE.md strategy, context management, hooks, agents, multi-agent workflows, and why verification is the real bottleneck."
date: "2026-02-28"
slug: "stop-writing-code-start-managing-systems"
mediumUrl: "https://senrecep.medium.com/stop-writing-code-start-managing-systems-the-real-potential-of-ai-powered-development-71fafeb144de"
imageUrl: "/images/stop-writing-code-start-managing-systems.webp"
keywords: ["AI-powered development", "Claude Code", "multi-agent workflows", "context window", "CLAUDE.md strategy", "software engineering mindset", "AI orchestration", "developer productivity", "AI verification", "parallel AI agents"]
author: "Recep Şen"
modifiedDate: "2026-08-08"
category: "AI"
faq:
  - q: "What does 'stop writing code, start managing systems' mean in practice?"
    a: "It means shifting from manually typing code to directing AI agents that write, test, and review code on your behalf. Instead of being a code author, you become a system architect who defines constraints, reviews outputs, and orchestrates multiple AI agents working in parallel, like a CTO managing an engineering team."
  - q: "How should I manage context window usage in Claude Code to avoid quality degradation?"
    a: "Keep one conversation focused on one task, run /compact when context usage exceeds 40%, and use SCRATCHPAD.md to persist critical information between sessions. Delegate large exploration tasks to subagents since their context is independent from the main session, and keep CLAUDE.md concise to avoid wasting context on static instructions."
  - q: "What is the Plan → Execute → Verify loop and why is it important?"
    a: "The Plan → Execute → Verify loop is a structured workflow where you first have the AI plan the approach (in read-only plan mode), then execute the implementation, then verify results with tests and linting before accepting the work. This prevents runaway AI changes, makes errors catchable early, and produces more predictable, reviewable outputs."
  - q: "Why is verification the bottleneck in AI-powered development?"
    a: "Because generating code is now cheap and fast, while confirming it actually works still costs human attention. Every parallel agent you add multiplies the review load, so your real throughput is capped by how much verification you can automate with tests, hooks, and reviewer agents rather than by how fast the AI writes code."
---

## Introduction: I Was Already Using AI Tools

I'm not going to start this article with "what is Claude Code and how do you install it." Because most people reading this are already using some AI tool. Cursor, Copilot, Windsurf, maybe ChatGPT; we've tried them all, we've seen their strengths and weaknesses.

I was no different. I've been developing software for years, and in recent years I've been using AI tools intensively. I started with Cursor, got a taste of the comfort of AI-assisted development inside an IDE. But at some point I hit a wall: as my project grew, the quality of AI's responses started to decline. Because IDE-based tools offer you an "assistant": you write, it completes. Nice, but limited.

When I switched to Claude Code, the paradigm shifted. This isn't an assistant, it's a development environment. A system that runs in the terminal, reads your files, executes commands, performs git operations, and can even spawn other AI instances to run in parallel. But the real power lies in how you configure this system.

I've been using Claude Code for months in production across multiple projects, spanning different tech stacks (from .NET backends to React Native mobile apps, Go services to Next.js frontends). This article is the accumulation of those months. What I did right, what I did wrong, which approaches actually worked.

An important note: rather than reading this article as a "click this button, type this command" tutorial, I'd recommend reading it as a thinking framework. Because the real power of AI tools doesn't come from which button you press, but from how you think.

## Section 1: You Need a Mindset Shift

### Think Like a CTO, Not a Junior Developer

The most common mistake in AI-powered development is seeing AI as "a thing that writes code for me." "Write this function," "fix this bug," "add this API"; these are valid requests, but they're only a small piece of the picture.

Real productivity emerges when you approach a project from A to Z like a CTO:

- **Planning**: What are we building and why?
- **Architecture**: How will we structure it?
- **Development**: How will we implement it?
- **Testing**: How will we verify it works correctly?
- **Security**: How will we detect vulnerabilities?
- **Performance**: Is it fast enough?
- **Deployment**: How will we ship it?

The real power of Claude Code is that it can help you at every stage of this lifecycle. Not just the "writing code" stage. And in this article, I'll explain this approach in detail.

### Learn to Think Probabilistically

AI is not a deterministic machine. Give it the same prompt twice, and you might get different results. This isn't a bug, it's the operating principle. Once you understand this principle, your way of working with AI fundamentally changes:

- **Don't expect perfect results on the first try.** Work iteratively. Review the first output, give feedback, try again.
- **Build verification mechanisms.** Just because AI said "done" doesn't mean it's done. Verify that the build works, tests pass, and security scans come back clean.
- **Add deterministic layers.** Hooks, linters, test suites; these are layers of certainty on top of AI's probabilistic nature.

When you start with this mindset, everything else becomes much easier.

### Learn to Work at the Speed of Thought

You know what the biggest bottleneck is when working with AI? It's not AI's speed; it's your speed of providing input. You spot a bug, you need to switch to the terminal, describe the problem, take a screenshot and paste it, switch back again. With every context switch you lose focus, your train of thought evaporates.

The solution: building a workflow where you can give AI input the moment you think of it. For me that means speech-to-text bound to a hotkey (talking is faster than typing, and prompts tolerate messy grammar), a clipboard manager that remembers everything I copied recently, and instant screenshot sharing for visual bugs. Like working with a human, being able to say "look, this part is broken, fix that too, oh and there's also this."

Keep this in mind: when working with AI, the thing slowing you down isn't the AI; it's your speed of transferring information to the AI.

## Section 2: CLAUDE.md: Your Project's Strategic Brain

### The File Every Session Starts With

CLAUDE.md is the project instruction file that Claude Code automatically reads at the start of every conversation. Claude starts from scratch in every session; it doesn't remember previous conversations. But thanks to this file, it "knows" your project.

This file is one of the biggest factors in the quality of your Claude Code experience. A good CLAUDE.md won't replace engineering skill, but a bad one will frustrate even an expert.

### Less is More: The 100-Line Rule

My first CLAUDE.md file exceeded 160 lines. I had written out every rule, every command in detail. The result? Claude was missing important information. Long file = scattered attention.

The solution: keep your CLAUDE.md under 100 lines. Move details to separate files. Claude will look at those files when needed.

```text
CLAUDE.md (70-100 lines)              - Always read
.claude/rules/architecture.md         - Referenced when needed
.claude/rules/security.md             - Referenced when needed
docs/claude/patterns.md               - Referenced when needed
```

This approach is called "progressive disclosure": revealing information gradually.

### The WHAT / WHY / HOW Structure

An effective CLAUDE.md consists of three sections:

**WHAT**: What is the project? Tech stack, architectural structure, core concepts. A single paragraph is enough.

**WHY**: Why did we make these decisions? This part is critical. When Claude knows the "why," it makes much better decisions in edge cases. For example, instead of just saying "don't use console.log," if you say "don't use console.log because it causes performance issues in production and can leak sensitive data," Claude understands that temporary use during development is acceptable.

**HOW**: How do we work? Commands, test patterns, naming conventions. Teach by example here: one good code snippet communicates a convention better than three paragraphs describing it.

### The "Don't" Section

Always add a "Don't" section to your CLAUDE.md. Claude has known tendencies:

- Tendency to over-engineer (extra abstractions, unnecessary interfaces)
- Tendency to create too many files (splits things that could be solved in a single file)
- Tendency to add error handling for impossible scenarios
- Tendency to add docstrings and comments (even when not asked)
- Tendency to create stub files (file exists but is filled with `return null`, `return {}`, `TODO`, `console.log` placeholders; the existence of a file doesn't mean real implementation)

Explicitly stating these tendencies in CLAUDE.md is the cheapest way to avoid unnecessary work.

### 3-Layer Boundary Setting

Tell Claude clearly what it can do, when it should ask, and what it should never do:

- **Always do**: Write tests, run tests, follow naming conventions
- **Ask first**: Database migrations, adding new dependencies, large refactoring
- **Never do**: Committing secrets, editing lock files, deleting tests

These three layers show Claude the space where it can move confidently, while ensuring it informs you in dangerous areas.

### Global CLAUDE.md

The `~/.claude/CLAUDE.md` file contains global instructions that apply to all projects. I define my communication preferences (summaries in Turkish, technical terms in English), frequently used CLI tools, and general working principles here. This way I don't need to repeat them in every project.

### Path-specific Rules: Right Rule, Right File

Here's a scenario: you want to apply the same rules to all your test files. But test files are scattered across 50 different directories. Are you going to put a separate CLAUDE.md in each directory? Of course not.

You can define rules by file pattern in the `.claude/rules/` directory:

```text
---
paths: ["**/*.test.tsx"]
---
Use AAA (Arrange-Act-Assert) pattern in test files.
Prefer real database connections over mocks.
```

The `**/*.test.tsx` pattern catches all test files in the entire codebase, no matter which directory they're in. Same logic applies: `**/*.api.ts` for API endpoints, `terraform/**/*` for Terraform files - each with their own specific rules.

There's a context advantage too: these rules only load when matching files are being edited. They don't take up space in context permanently, they only kick in when relevant.

## Section 3: Context Window: The Most Critical Concept to Understand

### What It Is and Why It Matters

The context window is Claude's working memory. Every message, every file read, every command output accumulates in this shared budget. On Opus, this budget is approximately 200,000 tokens.

Most developers assume things will work smoothly until context hits 100%.

**Reality:** Degradation is gradual and starts well before the bar looks full. Past 60%, Claude forgets previous instructions, repeats the same mistakes, edits the wrong files. My practical rule: act around 40%, never wait for 60%.

But the problem isn't just context "filling up" - it's also actively **decaying**. This is known as "context rot."

Old tool outputs, debug traces from bugs that were already fixed, stale versions of refactored files - all of it accumulates in context. The model can't distinguish what's current from what's outdated. Stale information doesn't just take up space; it actively causes harm. The model treats old data as current and makes decisions on top of it: references renamed variables, follows changed patterns.

This is why so many multi-agent setups fall apart after a handful of tasks. The model didn't get dumber. The context got poisoned.

One caveat: this picture keeps improving. Models hold up better in long sessions with every release, and Claude Code keeps getting smarter about how it compacts, what it summarizes, and what it saves to memory. Today's terminal agents stay coherent in situations that would have derailed them a year ago, sometimes even near a full window. So read the thresholds in this section as a mentality rather than physics: following them makes your sessions noticeably better, but they aren't hard limits.

### One Conversation = One Task

One habit holds regardless of where the thresholds land: one conversation, one task. Auth system + database schema + UI components + writing tests; don't try to do all of them in a single conversation. Each should be a separate session.

You might think "but I just explained the context, do I have to explain it again in a new session?" No. CLAUDE.md knows your project, and your session memory holds the current state (the next subsection covers how). A new session doesn't start from zero.

### Memory Between Sessions

Claude is stateless; every conversation starts from scratch. There are various methods for carrying information between sessions. I use the project-memory feature of the OMC (oh-my-claudecode) plugin: a project-scoped store that keeps tech stack, architectural decisions, conventions, notes, and directives in JSON, and every session reads it automatically.

Whatever tool you use, the principle is the same: save what matters at session end, read it at session start.

### Practical Context Management

**Use the HUD (Heads-Up Display)**: Claude Code has a HUD in the terminal status bar. It shows you real-time information:

- Active model (Opus, Sonnet, Haiku)
- Session duration
- Token count spent
- Current cost and hourly cost rate
- Cache hit rate
- Permission mode (Normal, Auto-Accept, Bypass); toggle with Shift+Tab

**Context fill bar**: the one to watch. Tracking it is the foundation of context management; you'll see the moment it's time to act.

**`/compact` timing**: Run it proactively when the bar reaches the threshold above, before quality starts slipping.

**Clean start with `/clear`**: Start a new session when a task is completed or the topic changes.

**Information ordering matters**: AI models process the beginning and end of long inputs well but can miss information buried in the middle. If you're sending a long analysis result or error log, put the most critical information first. Starting with "there's a null pointer in this function, relevant log output below" is far more effective than a clue buried in the middle of a 500-line log.

**Red flags**: the symptoms listed at the top of this section (repetition, forgotten context, wrong files) mean cleanup is already overdue, not approaching.

### What Goes In Matters as Much as How Much

Volume is only half of context management. The other half is selection. Three filters I apply before feeding anything in:

- **Recency**: Is this data current? Stale API docs or an outdated schema don't just waste space, they mislead. If something might be outdated, make Claude fetch the current version instead of pasting the old one.
- **Relevance**: Does this actually bear on the task? A 500-line log where 20 lines matter is 480 lines of noise the model has to see past.
- **Your own signal**: Tell the model where you stand. "I know this domain well, skip the basics" and "I've never touched Kubernetes, explain your choices" produce different, and correctly calibrated, answers.

### Instructions and Data Are Not the Same Thing

Selection has a companion problem: everything you type into the prompt arrives with your authority attached. The model reads all of it as "this is what the user wants," which becomes a problem when half of it is just reference material: a long log, an API doc, someone else's error report. Sentences inside that material can get picked up as directives, and the model starts acting on text you only meant as background.

Two habits fix this. For short material, wrap it in explicit markers (a fenced block, an XML-style tag) and label it: "the following is reference data, not instructions." For anything long, don't paste it at all. Save it to a file, even a temp one, and give Claude the path along with what you want done with it. The content then enters context as a tool result, which the model treats as data to interpret rather than commands to follow, and it decides for itself which parts are worth keeping. Your prompt stays what it should be: pure intent.

### When Claude Is Stuck in a Loop

Sometimes the model keeps hitting the same error, trying small variations of the same broken fix. More prompting rarely saves a session in this state, because the failed attempts are sitting in context and dragging every new attempt toward them. What works:

1. Revert the broken changes with git.
2. Ask the current session for a short summary: what was tried, what failed, what the error messages said.
3. Start a fresh session and hand it that summary.

The same model that flailed for an hour will often solve the problem in minutes with a clean context. It didn't get smarter; it's just no longer anchored to its own failures.

### The Hidden Cost of CLAUDE.md Size

CLAUDE.md is auto-loaded in every session. A 2,000-token CLAUDE.md adds extra cost to every message. Over 1,000 messages, this becomes a non-trivial hidden cost. Yet another reason to keep your CLAUDE.md short and focused.

## Section 4: Deep Research: Getting Maximum Value from AI

### Why Does It Matter?

Few things have boosted my productivity as much as deep research. Conducting comprehensive research using AI's "deep thinking" mode before starting a project or making a complex decision can reduce hours of trial and error to minutes.

### My Workflow

I don't tie deep research to a single tool. Claude.ai, ChatGPT, Gemini; they all have deep research or similar modes, and each has different strengths. What matters isn't the tool, it's the process:

**Step 1: Start with a conversation.** Chat with AI about the topic. But don't just ask questions; ask the AI to ask you questions. Say "ask me questions about this topic, let's understand my requirements." This step is critical because it surfaces what information the AI needs.

**Step 2: Answer the AI's questions.** The AI will ask you 10-15 questions. Answer them. This process both clarifies your own thinking and provides the AI with rich context.

**Step 3: Generate the deep research prompt.** At the end of the conversation, tell the AI "now create a deep research prompt for me based on this conversation." The AI will produce a detailed, focused research prompt that incorporates all the context from the conversation.

**Step 4: Send it to deep research.** Send this prompt to Claude.ai's extended thinking mode, ChatGPT's deep research mode, or Gemini's deep research feature. Compare the results.

**Step 5: Bring the results to Claude Code.** Bring the research results to your Claude Code session. Now you're starting your project with a solid knowledge foundation.

### When Should You Use Deep Research?

- Choosing a new technology or framework
- Complex architectural decisions (monolith vs microservices, event-driven vs request-driven)
- Performance optimization strategies
- Determining security approach
- Strategy before a major refactoring
- Best practices in an area you're unfamiliar with

### Important Point

Deep research is not "searching on Google." It's having AI synthesize large amounts of information and present a detailed analysis tailored to your specific situation, complete with sources. These outputs can dramatically increase the quality of your Claude Code sessions by being added directly to CLAUDE.md or project documentation.

## Section 5: Permission Modes and the Plan-Execute-Verify Loop

### Permission Modes

In Claude Code, you can toggle between three permission modes with `Shift+Tab`:

**Normal Mode**: Asks for approval on every file edit and command execution. Safest, slowest.

**Auto-Accept Mode**: Automatically approves file edits. The way to say "you know what you're doing, carry on." Still asks for approval on Bash commands.

**Bypass Mode**: Automatically approves all permissions. Speeds things up on trusted, well-defined tasks. It only makes sense once your hook safety net exists (Section 6): the deterministic guardrails do the watching so you don't have to. Bypass without hooks is Normal Mode with the safety removed.

I treat these modes as a trust ladder, not a style preference. Start in Normal Mode on a new project. Once you've watched the model work in your codebase and know where it stumbles, move to Auto-Accept. Extend Bypass only to task types that have earned it, with hooks covering the dangerous edges. Granting full autonomy on day one is how people end up with deleted files and force-pushed branches.

### Plan Mode: A Separate Working Mode

Plan Mode is a working mode independent of permission modes. In this mode, Claude can't make any changes; it only analyzes and proposes plans. Incredibly valuable for strategizing before big changes.

But there's one step before entering Plan Mode: **alignment**. When you tell the AI "build an auth system," it makes 30 decisions in the first 5 minutes: JWT or session, email verification or not, OAuth or password-only, how should error messages look. You don't know which decisions it made until you see the result.

The solution: before planning, have the AI identify the grey areas and ask you concrete questions. Say: "Before planning this feature, identify the grey areas and points where multiple reasonable approaches exist, then ask me." Let the AI present ambiguous points as structured options: "Session management: A) JWT refresh rotation, B) Redis server-side session, C) your preference."

This 10-minute alignment session is far cheaper than correcting course mid-implementation - both in tokens and in time.

### The Plan -> Execute -> Verify Loop

This is the working pattern that pays off most consistently for me, and the practical application of the CTO mindset:

1. **Switch to Plan Mode**: Let Claude analyze the project and plan what to do
2. **Review the plan**: Does it make sense? Is anything missing? Request corrections if needed
3. **Switch to Auto-Accept**: Let Claude implement the plan
4. **Verify**: Does the build work? Do tests pass? Is the expected behavior achieved?

There's a critical distinction here: "all steps completed" is not verification. Real verification is observing outcomes. When defining verification criteria, think in three layers:

- **Behavioral**: "Can the user log in?" You need to run it and observe.
- **Structural**: "Is auth.ts a real implementation, or a stub filled with TODOs and `return null`?" The file existing isn't enough; the content has to be real.
- **Connective**: "Does the login handler actually import and use the function from the auth module?" Files can exist independently while not being connected to each other.

This approach is called "goal-backward verification." Instead of asking "what did I do?" you ask "what was supposed to happen, and is it happening?" Especially critical in AI-powered development, because the most common failure mode of AI is: files exist, build passes, but the pieces aren't connected.

I use this loop especially for changes that affect multiple files. Seeing what Claude will do first, then approving it, both saves time and reduces error risk.

## Section 6: Hooks: Deterministic Safety Nets

### Philosophy

Think of hooks this way: Claude is a probability machine. Most of the time it does the right thing, but sometimes it doesn't. Hooks are mechanical locks that guarantee "it absolutely cannot do things it shouldn't do."

You're adding deterministic guarantees to AI's probabilistic nature. This is the core safety principle of AI-powered development.

The dividing line: if a single failure can cause financial damage or security risk, a deterministic guarantee is essential. The rest can be managed with prompts. That said, cheap hooks that remove daily friction are still worth having; they just aren't mandatory the way the safety-critical ones are.

### Hook Types

Claude Code lets you run hooks at five different points:

- **PreToolUse**: Before a tool is called (ability to block)
- **PostToolUse**: After a tool is called (ability to validate)
- **SessionStart**: When a session starts (environment setup)
- **UserPromptSubmit**: When a user sends a message (input control)
- **Stop**: When the agent stops (cleanup)

### 3 Hooks to Start With

Instead of trying to build the entire hook ecosystem at once, start with these three:

**1. Dangerous Git Protection (PreToolUse:Bash)**: Blocks destructive git commands like `git push --force`, `git reset --hard`, `git checkout .`. This hook alone has saved me numerous times.

**2. Conventional Commits (PreToolUse:Bash)**: Enforces commit messages to follow the `feat(scope): description` format. Without this hook, Claude sometimes creates meaningless commit messages like "fix stuff."

**3. Convention Guard (PostToolUse:Edit|Write)**: Checks your project-specific rules on every file write. For example, in a TypeScript project: `any` type usage, `console.log` leftovers, `@ts-ignore` usage. Note the division of labor: your linter already catches generic style mechanically, so don't burn context teaching Claude what Biome or ESLint enforces for free. The hook is for rules only your project knows.

### Advanced: Architecture Guard

This is the most valuable hook in my backend project. It automatically checks Clean Architecture layer violations on every file change. For example, if there's an EF Core import in the Domain layer or an Infrastructure reference in the Application layer, the hook catches and blocks it.

Domain-specific hooks like this protect your project's architectural integrity against AI-induced mistakes.

## Section 7: Custom Agents: Build Your Expert AI Team

### What Is an Agent?

An agent is a Claude instance specialized for a specific task. They live as markdown files in the `.claude/agents/` directory. Each agent has a system prompt, tool constraints, and a model selection.

### Why Should You Use Custom Agents?

There's a significant quality difference between telling general-purpose Claude to "do a security review" versus telling a security-specialized agent the same thing. Because a custom agent:

- **Carries domain knowledge** (OWASP checklist, project-specific security rules)
- **Only does what it should** thanks to tool constraints
- **Works with focused context** (only information relevant to its domain is loaded)
- **Exhibits a consistent approach** (follows the same checklist every time)

### Essential Agent Strategy

I recommend creating at least these two for every project:

**Code-reviewer agent**: Checks code quality, pattern conformance, SOLID principles, naming conventions. Sonnet is sufficient as the model.

**Debugger agent**: Performs error analysis, root cause identification, log examination. Limit it to Read and Bash tools; you approve the fix.

## Section 8: Multi-Agent Work: The Real Force Multiplier

### Subagents and the Context Advantage

**Subagents** are independent Claude instances created for short-lived, focused tasks. The critical point is this: each subagent has its own independent context. What does this mean?

Even if your main session has already used 40% of its context, a subagent starts with a completely clean context. This is a revolutionary advantage in terms of context management. When you delegate research tasks, code reviews, and file searches to subagents, your main session's context doesn't bloat.

### Teams: Persistent Coordination

Agent Teams let you coordinate multiple Claude Code instances as a team. Unlike subagents: team members are persistent, can message each other, and access a shared task list.

**When to use subagents?**

- One-off tasks: file search, quick code review, format checking
- Tasks where you need to wait for the result before continuing

**When to use teams?**

- Comprehensive PR review (security + quality + performance + test coverage in parallel)
- Large feature development (backend + frontend + test in parallel)
- Complex refactoring (only when the modules are genuinely independent; see Section 14)

### Practical Scenario: Comprehensive Code Review

You need to review a PR. Think like a CTO: don't just ask "is the code nice?", examine all dimensions:

```text
Team Lead (you): Coordination
Teammate 1: Security review (OWASP, input validation, auth)
Teammate 2: Code quality (patterns, SOLID, cleanliness)
Teammate 3: Performance analysis (N+1 queries, memory leaks, caching)
Teammate 4: Test coverage (missing tests, edge cases)
```

4 agents work in parallel, each diving deep in their area of expertise. The results are combined into a comprehensive review report. If you tried to do this alone, it would take hours; with parallel agents, the finding phase is done in minutes.

One honest caveat: four agents produce four reports, and someone still has to reconcile them. Parallelism speeds up discovery, but it multiplies review output. Budget a synthesis step, or better, have one agent merge and deduplicate the findings before they reach you. Section 11 is about why that reconciliation cost, not generation speed, is what caps your throughput.

## Section 9: Model Routing: The Right Model for the Right Job

### Three Models, Three Purposes

**Haiku**: Fast, cheap. Ideal for simple searches, finding files, format checks, quick questions.

**Sonnet**: Balanced. Should be your default choice for standard implementation, debugging, code review, and most day-to-day work.

**Opus**: Deep reasoning. For complex architectural decisions, tough bugs, large refactoring, security audits.

### Strategy

The rule is simple: use Sonnet as the default. Only switch to Opus when you genuinely need it. Route simple tasks to Haiku.

Complexity isn't the only axis, though. Task length matters too: for long autonomous runs, a model's per-step reliability counts for more than its raw intelligence. Section 13 does the math on why.

The cost impact of routing is real. I haven't measured it to the percentage point, but since I stopped running everything on Opus, the difference on my daily spend has been obvious, on the order of half or better.

## Section 10: Cross-Model Orchestration: Using Different AIs Together

### A Single Model Isn't Enough

Using different AI models together has paid off more than I expected.

**Claude Opus**: My orchestrator for deep-reasoning sessions. Complex architectural decisions, multi-step planning, seeing the big picture. This doesn't contradict the Sonnet-default rule from the previous section: daily implementation stays on Sonnet, and Opus earns its cost in sessions where decisions are expensive to get wrong.

**OpenAI Codex/GPT**: Code analysis, planning validation, critical thinking. Especially valuable for providing a different "perspective."

**Google Gemini**: Large context window (1M tokens), useful when a task genuinely requires reading many files in a single pass. A big window isn't immunity, though: the selection rules from Section 3 still apply, and a bloated 1M context decays the same way a bloated 200k one does.

### Why Does It Matter?

Every AI model has its own strengths, weaknesses, and "blind spots." When you're dependent on a single model, you can't notice that model's blind spots. Using different models together provides more robust and versatile analysis.

## Section 11: Verification Is the Bottleneck

### Generating Is Cheap, Checking Is Not

Here's the problem nobody warns you about when you start orchestrating AI: generating code stopped being the constraint. Claude produces in an hour what used to take me a day. But properly verifying that hour of output (reading the diff, running the flows, checking the edges) can eat several hours of my attention.

And attention doesn't scale the way agents do. Follow the incentive to its end: when review costs more than generation, you start skimming. Then you start trusting. Then something broken reaches production, and it turns out "done" was never verified. No one sustains a workflow where checking the work costs ten times more than requesting it.

This puts the earlier sections in a different light. Hooks (Section 6) are automated verification. Tests are verification that runs while your attention is elsewhere. The Plan-Execute-Verify loop from Section 5 works because the Verify step is systematized instead of heroic. The ceiling of AI-powered development isn't how much you can generate. It's how much you can verify without burning out.

### The Producer Should Never Grade Its Own Work

The highest-leverage verification trick I know: never let the session that wrote the code judge the code.

Try this experiment. Have Claude write something genuinely complex, the kind of change that touches several areas at once. When it declares success, open a fresh session, point it at the same diff, and say: "You are reviewing this change. Your job is to find problems." The same model that just said "everything works" will hand you a list of real issues.

This isn't a quirk. It's the same reason companies separate developers from testers: the author's context is contaminated with the intent to finish, while a reviewer with clean context has one goal, finding what's wrong. Different framing, different behavior.

Scale the rigor to the stakes:

- Routine change: one fresh-context review pass
- Important change: a second pass with a different model, for the blind-spot reasons in Section 10
- Money or security on the line: repeat until several consecutive passes come back clean

## Section 12: Turn Every Repeated Error Into a System

Claude's statelessness has a consequence most people never act on: if the model made a mistake once, it will make the same mistake again, because the conditions that produced it haven't changed.

So I follow a simple rule: the second time I see the same error, it gets converted into something permanent. In rough order of preference:

1. **A hook**, if it can be checked mechanically (a blocked command, a forbidden pattern)
2. **A test**, if it's a behavior that can regress
3. **A CLAUDE.md note or a skill**, if it's a convention or workflow the model keeps missing

The first occurrence costs you a fix. The conversion costs you ten minutes. Every occurrence after that costs you nothing, forever.

Skip this and the arithmetic runs the other way. A model working actively in your codebase has dozens of recurring failure modes, and if each one resurfaces even occasionally, your day dissolves into fixing familiar mistakes. Worse, it never improves, because nothing you fixed was persisted anywhere.

The model doesn't learn between sessions, but your system can. Hooks accumulate. Tests accumulate. CLAUDE.md gets sharper. Six months in, the model is the same; your setup is unrecognizable. That's what a self-learning system means in practice: not a smarter model, a smarter harness.

## Section 13: Long-Running Tasks: Reliability Compounds

### Why 99.9% and 99.99% Are Not Almost the Same

Suppose an agent completes each step of a task correctly 99.9% of the time. Sounds excellent. Now give it a long autonomous task, the overnight kind: a thousand steps of reading, editing, running, checking.

0.999 raised to the 1000th power is about 0.37. Your "excellent" agent finishes a clean run 37% of the time.

Now take an agent at 99.99% per step. Same thousand steps: about 90% clean runs. A gap that looks like a rounding error separates an agent you can trust overnight from one you can't.

Two practical consequences:

**Model choice changes with task length.** For a 20-minute task, pick the smartest model. For a 10-hour run, pick the most consistent one, the one that double-checks its own steps. Meticulousness beats brilliance when errors compound.

**Checkpoints break the compounding.** The math above assumes one failure ruins everything, so make failures recoverable instead:

- **Force commits at milestones.** Tell the agent to commit after each completed piece. A mistake then costs a rollback, not the whole run.
- **Keep a run log.** Have the agent maintain a file: what's done, what remains, what went wrong and how it was handled. A fresh agent can resume an interrupted run from this file instead of starting over.
- **Set budgets up front.** Time, tokens, scope. "If tests still fail after three attempts on the same issue, stop and write down what you know" beats letting the agent grind all night on a dead end.

Plan long tasks assuming something will go wrong midway. When nothing does, great. When something does, the run survives it.

## Section 14: Parallelism Done Right

### Agent Count Is Not a Multiplier

The naive assumption: 10 agents = 10x speed. What actually happens when you point 10 agents at the same part of a codebase: each agent needs a coherent picture of the code to make a correct change, and while it's forming that picture, another agent is invalidating it. They overwrite each other's work, break each other's assumptions, and you spend the evening untangling the damage. Ten agents, zero speedup.

Parallelism works when it follows the dependency graph of the work:

- **Split by genuinely independent areas.** Frontend and backend. Two services that don't share code. Separate git worktrees, merged when done. Independence is what makes the speedup real.
- **One writer, many readers.** A single agent makes the changes while parallel subagents feed it research: file discovery, doc lookups, pattern searches. Writes stay serialized, reads run in parallel, nothing conflicts.

### The Safest Thing to Parallelize Is Discovery

Reading has no side effects, which makes research the one place you can parallelize without ceremony. A pattern I keep coming back to: give the same question to two or three agents independently, then have another agent compare their reports.

The comparison is where the value is. When reports disagree, that's a strong signal something is ambiguous or broken there; look yourself. When they agree, treat it as moderate evidence rather than proof. Models trained on similar data share blind spots and can be confidently wrong in the same way. Agreement narrows the search; it doesn't close the case.

One more rule: don't parallelize until the single-agent loop works. If the direction is wrong, ten agents get you to the wrong place ten times faster. Nail the system first (context, verification, checkpoints), and parallelism becomes a multiplier on something that already works.

## Section 15: Testing, Security, and Performance: The CTO Checklist

### Testing in AI-Powered Development

The biggest trap of writing code with AI: "let me finish this quickly, I'll write tests later." Without tests, you can't verify the code AI produces.

**Rule**: When having AI write a feature, ask it to write tests in the same prompt. Say "implement this feature and write its tests, then run the tests." Verification criteria cost you one extra sentence in the prompt and change what comes back.

### Security Scanning

With the CTO mindset, perform security checks before every PR:

1. **Hardcoded secret scanning**: Searching for API keys, passwords, tokens
2. **Input validation check**: Are user inputs being validated?
3. **OWASP Top 10 review**: Are there SQL injection, XSS, CSRF risks?
4. **Dependency security**: Are there packages with known vulnerabilities?

### Performance: Measure Before You Optimize

Performance work with AI has one trap: the model will happily optimize whatever you point at, whether or not it's the actual problem. So the order matters: measure first, then delegate. Ask for the N+1 query check, the missing index, the payload that should be streamed instead of loaded whole. Concrete, checkable requests ("profile this endpoint and show me where the time goes") get real answers; "make it faster" gets guesswork.

## Section 16: Do's and Don'ts

### Do

1. **Write a good CLAUDE.md for every project.** Without this file, Claude doesn't know your project.
2. **Actively manage context.** Monitor the context bar and cost info in the HUD, act early with `/compact`, start clean with `/clear`.
3. **Make Plan Mode a habit.** See what will be done before big changes, then approve.
4. **Provide verification criteria.** Not "write tests," but "write tests that cover edge cases and run them with `npm test`."
5. **Weave a safety net with hooks.** Start with at least 3 essential hooks.
6. **Use subagents generously.** Delegate research, review, and search tasks. Keep your main context clean.
7. **Start with deep research.** On complex tasks, research first, then implement.
8. **Apply model routing.** Haiku for simple tasks, Sonnet as default, Opus for deep analysis.
9. **Teach by example.** Instead of three paragraphs of explanation, show a code snippet.
10. **Keep sessions short.** One conversation = one task. Context explosion means quality collapse.
11. **Turn repeated errors into systems.** The second occurrence of a mistake earns a hook, a test, or a CLAUDE.md note (Section 12).
12. **Separate the producer from the verifier.** A fresh-context review finds what the writing session can't see (Section 11).

### Don't

1. **Don't use Claude as a linter.** ESLint, Biome, Prettier already exist. Rules like "use two spaces" are context waste.
2. **Don't turn CLAUDE.md into a novel.** Keep it under 100 lines. Use progressive disclosure.
3. **Don't trust without verifying.** Claude saying "done" isn't enough. Build, test, security; verify.
4. **Don't let it over-engineer.** Explicitly state in CLAUDE.md: "don't add extra abstractions, don't create unnecessary interfaces."
5. **Don't delay writing tests.** Untested AI output is unverified output.
6. **Don't parallelize before the system works.** Ten agents on a broken loop lose ten times faster (Section 14).

## Conclusion: The Journey Continues

Claude Code started as "AI in the terminal" for me. Now it's a complete development ecosystem. CLAUDE.md strategy, context management, hook pipelines, custom agents, multi-agent orchestration, cross-model usage, self-learning systems; I learned all of these gradually over months.

The most important lesson is this: the real power of AI tools doesn't come from which button you press, but from how you think. Think like a CTO: not just writing code, but planning, testing, ensuring security, measuring performance, and doing all of this systematically.

A fair objection at this point: won't smarter models make all of this setup unnecessary? I'd bet on the opposite. Smarter models raise the ceiling on what you can delegate, and everything in this article (verification, context discipline, checkpoints) is what lets you actually delegate it. Model capability multiplies with operator skill. As capability grows, the gap between people who build systems and people who type prompts widens.

**To get started:**

1. Write a good CLAUDE.md
2. Learn context management (the 40% rule)
3. Set up the 3 essential hooks
4. Make Plan Mode a habit
5. Separate the producer from the verifier

Remember: the best way to sharpen your tools is to use them every day.
