---
title: "Your Function Signature Is Lying: Managing Errors as Values in TypeScript"
description: "Discover why try/catch falls short in TypeScript, the advantages of managing errors as values with Railway Oriented Programming, and pragmatic functional programming with tsentials' Result<T>, Maybe<T>, RuleEngine and more."
date: "2026-05-16"
slug: "your-function-signature-is-lying"
mediumUrl: ""
imageUrl: "/images/your-function-signature-is-lying.webp"
keywords: ["TypeScript error handling", "Railway Oriented Programming", "Result type", "functional programming", "tsentials", "error as value", "applicative validation", "RuleEngine", "Maybe type", "DDD TypeScript"]
author: "Recep ŞEN"
modifiedDate: "2026-05-16"
category: "TypeScript"
faq:
  - q: "Why should I use a Result type instead of try/catch in TypeScript?"
    a: "With try/catch, errors are invisible in function signatures, the type of the catch variable is unknown, and async rejections are not reflected in the type system. The Result<T> type models errors as return values, providing type safety. It can collect multiple errors at once and is approximately 300 times faster than throwing exceptions."
  - q: "What is Railway Oriented Programming and how is it applied in TypeScript?"
    a: "Railway Oriented Programming models your code as a railway line with success and error tracks. Each function acts like a switch — if successful, it forwards to the next step; if an error occurs, it diverts to the error track. The tsentials library brings this paradigm to TypeScript with Result<T>, chain, and fromAsync APIs."
  - q: "What is the difference between tsentials, neverthrow, and Effect-TS?"
    a: "neverthrow offers a simple Result<T, E> type but lacks multi-error collection. Effect-TS is a comprehensive effect system but has a steep learning curve. tsentials strikes a pragmatic balance between the two: multi-error collection, structured errors, a rule engine, DDD support, and three different API styles — without requiring knowledge of category theory."
  - q: "What does tsentials' RuleEngine do?"
    a: "RuleEngine lets you define business rules as composable functions. RuleEngine.and runs all rules and collects all errors, RuleEngine.linear stops at the first error, and RuleEngine.or requires at least one to pass. Rules are testable, reusable, and inspired by the Specification Pattern in DDD."
---

# Your Function Signature Is Lying: Managing Errors as Values in TypeScript

I've been developing with TypeScript for years. I've worked across different technology stacks — from backend services to React Native mobile apps, from Go microservices to Next.js frontends. I applied the same philosophy first in C#, then carried it over to TypeScript. In every project, every team, every codebase, I ran into the same problem: error handling never worked the way I wanted it to.

`try/catch` blocks, `throw` statements, `Promise.reject`s. I've used them thousands of times. But no matter how much experience I gained, an uncaught error would inevitably surface in production. Our type system was strong, our tests were comprehensive, yet we still had blind spots when it came to error handling.

That is, until I encountered Go and Rust. In these languages, errors are returned as values. They're explicitly visible in the function signature. The compiler warns you when you don't handle an error.

That's when I realized: the problem wasn't me. The problem was the paradigm.

## The problem: Your function signatures are lying to you

Error handling in TypeScript has three fundamental problems. They're interconnected, and together they push developers into "error hope management."

### First: Errors are invisible in function signatures

```typescript
function getUser(id: number): User {
  if (id === 0) throw new Error('User not found');
  return { id, name: 'Test' };
}
```

This signature tells you it only returns a `User`. But the function can actually return two things: either a `User` or an `Error`. You have no way of knowing about the second case from the signature alone. The calling code can invoke this function without `try/catch`, and the compiler won't give any warning. You won't notice the problem until it crashes in production.

Java has the `throws` keyword. TypeScript doesn't. Your function signature provides incomplete information — it's lying to you.

### Second: `catch(error)` type is `unknown`

```typescript
try {
  const user = getUser(0);
} catch (error) {
  // error: unknown — what arrived, where from, what type?
  console.error(error.message); // Compile error
}
```

Since TypeScript 4.4, in `strict` mode, the `catch` variable is typed as `unknown`. You're forced to write an `instanceof Error` check in every `catch` block. Your code gets littered with `try/catch` blocks, and the same type check is repeated in each one.

### Third: Async rejections are not reflected in the type system

```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

It says `Promise<User>`. But `fetch` can throw a network error. `response.json()` can throw a parse error. The server can return a 500. None of these are visible in the type system.

### And fourth: Performance

Throwing exceptions is not cheap. Creating a stack trace, unwinding the call stack, finding the `catch` block — all of these have a cost. Using a Result type in TypeScript is **approximately 300 times faster** than throwing exceptions. This is not a negligible difference; it has a direct impact, especially in high-traffic APIs and validation-heavy business logic.

When these four problems come together, "error handling" effectively becomes "error hope management." *I hope this function doesn't throw an error. I hope this `catch` block is enough. I hope I haven't forgotten about async errors.*

As swyx put it eloquently: "There's an ironic inversion — the things that are actually *exceptional* are routine, and what's routine is our *exception throwing*."

## The solution approach: Railway Oriented Programming

The solution to these problems is hidden in a concept that has been known in the functional programming world for years: **Railway Oriented Programming**. Introduced by Scott Wlaschin on his F# for Fun and Profit site, this approach is based on a simple but powerful metaphor.

Imagine your code as a railway line:

```text
  ─── Success Track ─────────────────────────────────────►
       │              │              │              │
   [validate]    [transform]    [save]        [notify]
       │              │              │              │
  ─── Error Track ───────────────────────────────────────►
```

There are two parallel tracks: the success track and the error track. Each function acts like a railway switch. If the input is successful, it forwards to the next step. If an error occurs, it diverts to the error track. And here's the critical point: **once you enter the error track, subsequent functions are automatically skipped.** The chain doesn't break, the control flow isn't disrupted — the data simply continues along the error track.

This model has three core mechanisms:

- **bind** (flatMap/andThen): Takes the successful value and passes it to a function that produces a new result. If there's an error, it doesn't touch it.
- **map**: Transforms the successful value and automatically wraps the result again. If there's an error, it doesn't touch it.
- **match**: At the end of the chain, it handles success and error cases separately. There's no escape — you must handle both cases.

### Monadic or Applicative?

There's a critical distinction here. Traditional monadic chaining (bind/chain) **stops at the first error**:

```text
User data → [email check ❌] → STOP
             Result: "Email is invalid"
```

But a user filling out a form, if both the email is wrong and the password is too short, wants to know **both at once**. This requires the **applicative validation** approach:

```text
User data → [email check ❌] + [password check ❌] + [age check ✓]
             Result: ["Email is invalid", "Password too short"]
```

As Scott Wlaschin emphasized: "*Validation is being done sequentially. That's why only one error is returned at a time. Wouldn't it be nice if we could return all the validation errors at once?*"

Martin Fowler approaches the same problem from a different angle: "*Replace Throwing Exceptions with Notification in Validations.*" In other words, instead of throwing errors one by one, collect them and report them together.

These two approaches — Railway Oriented Programming and the Notification Pattern — form the philosophical foundation of `tsentials`.

### Should it be used everywhere?

No. Scott Wlaschin himself wrote an article titled "Against Railway-Oriented Programming." Every paradigm has its limits:

- If you need a stack trace, exceptions are more informative
- In a completely irrecoverable situation (panic), throwing an exception is the right thing to do
- Modeling every possible I/O error with Result can be overkill

ROP is ideal for **domain errors** and **business logic validation**. Not for infrastructure errors like a network connection dropping, but for expected errors that need to be handled — like "the user is under 18." tsentials embraces this distinction by providing type-safe error handling in the domain layer without trying to leak into the infrastructure layer.

## tsentials: Pragmatic functional programming

`tsentials` is a library written for TypeScript that pragmatically applies the railway-oriented programming philosophy. Its goal is clear: **to bring the power of functional programming to TypeScript developers without teaching them the jargon of category theory.**

We don't say "Monad," we say "pipeline." We don't say "Functor," we say "map." We don't say "Applicative," we say "collect all errors." The concepts are the same; the barrier to entry is different.

### Result<T>: Making errors visible

At the center of the library is the `Result<T>` type:

```typescript
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; errors: readonly AppError[] };
```

Two states, represented by a discriminated union. If `ok: true`, there's a `value`; if `ok: false`, there are `errors`. Thanks to TypeScript's type narrowing, after an `if (result.ok)` check, the compiler automatically understands the correct branch.

There's a critical design decision here: **errors are held not as a single `Error` object, but as an `AppError[]` array.** This means a function can return multiple errors at once. This makes applicative validation a first-class citizen.

Each `AppError` is structured:

```typescript
interface AppError {
  readonly code: string;           // "User.Email.Invalid"
  readonly description: string;    // "Email format is invalid"
  readonly type: ErrorType;        // Validation, NotFound, Conflict, ...
  readonly metadata?: ErrorMetadata;
}
```

You use `code` for programmatic decisions. You use `description` to show messages to the user. You use `type` to determine the HTTP status code. You use `metadata` to carry context information. Errors are no longer opaque `Error` objects; they are **structured, categorized, and programmable values.**

### Pipeline: The real power of tsentials

The real power of tsentials isn't in creating a single Result, but in **chaining them**. Let's look at a real-world scenario:

```typescript
const profile = await fromAsync(fetchUser(userId)) // fetchUser must return Promise<Result<T>>
  .andThen(user => validateAge(user))
  .ensure(user => user.isActive, Err.validation('User.Inactive', 'Account is not active'))
  .map(user => user.profile)
  .tap(profile => logger.info('Profile loaded', { userId }))
  .match(
    profile => renderProfile(profile),
    errors => renderErrors(errors)
  );
```

Six steps. Zero `try/catch`. Zero `if (error)` checks. Zero chance of an exception being thrown. If an error occurs at any step, the subsequent steps are automatically skipped, and all errors are collectively handled in the second arm of `match`.

If `fetchUser` gives a network error? It switches to the error track; `validateAge` is never called.
If `validateAge` fails? `ensure` is never called.
If `ensure` doesn't pass? `map` is never called.

The control flow is linear, predictable, and type-safe.

### Three styles, one philosophy

There are three different usage styles in the same library. Because teams are different; habits are different.

**Style 1 — Pure functions** (for those who love functional programming):

```typescript
const result = Result.then(
  Result.ensure(
    Result.success(user),
    u => u.age >= 18,
    Err.validation('Age.Underage', 'Must be 18 or older')
  ),
  u => saveUser(u)
);
```

**Style 2 — Fluent chaining** (for those with OOP habits):

```typescript
const result = chain(Result.success(user))
  .bind(u => validateUser(u))
  .ensure(u => u.age >= 18, Err.validation('Age.Underage', 'Must be 18 or older'))
  .map(u => u.profile)
  .unwrap(); // Result<Profile> — exits the chain, not the raw value
```

**Style 3 — Async builder** (for those who love modern async/await):

```typescript
const result = await fromAsync(fetchUser(id))
  .andThen(u => validateUser(u))
  .map(u => u.profile)
  .match(p => p, () => null);
```

You use whichever feels natural to you. Different team members can prefer different styles; the library allows this rather than constraining it.

### Transitioning from the exception world: Result.try

Your existing code has functions that throw exceptions. This is unavoidable. `JSON.parse`, third-party libraries, legacy code... They can all throw exceptions. `Result.try` builds this bridge:

```typescript
const parsed = Result.try(
  () => JSON.parse(rawInput),
  e => Err.validation('Json.Invalid', 'Invalid JSON format')
);
```

A safe transition between the world that throws exceptions and the world that returns Results. The problem of `JSON.parse` throwing a `SyntaxError` is now eliminated.

### Rule engine: Composing business logic

Business rules are usually written as if/else chains. As they grow, they become unreadable, hard to test, and impossible to reuse. tsentials' `RuleEngine` solves this:

```typescript
const isAdult = RuleEngine.fromPredicate<User>(
  u => u.age >= 18,
  Err.validation('Age.Underage', 'Must be 18 or older')
);

const hasValidEmail = RuleEngine.fromPredicate<User>(
  u => isEmail(u.email),
  u => Err.validation('Email.Invalid', `${u.email} is not valid`)
);

const registrationRules = RuleEngine.and(isAdult, hasValidEmail, hasAcceptedTerms);
```

`RuleEngine.and` runs all rules and **collects all errors**. If the user is 16 years old and the email is wrong, they see both errors at once.

`RuleEngine.linear` runs sequentially — it stops at the first error. It's ideal for dependent steps: first check the format, then look up in the database.

`RuleEngine.or` requires at least one to pass. `RuleEngine.if` provides conditional branching.

Rules are just functions. They're testable, composable, and reusable. They're inspired by the Specification Pattern in DDD, but unlike it, they return not just a boolean but **structured errors**.

## More than just error handling

tsentials is not just a Result library. It's a toolkit designed around a consistent philosophy, consisting of 19 modules:

### Maybe<T> — The solution to the "billion-dollar mistake"

Tony Hoare said in 2009 that inventing the null reference was his "*billion-dollar mistake.*" In TypeScript, `T | undefined` covers most cases but lacks composability. `Maybe<T>` fills this gap:

```typescript
const userName = pipe(
  Maybe.from(user),                              // null/undefined → None
  m => Maybe.map(m, u => u.profile),
  m => Maybe.bind(m, p => Maybe.from(p.displayName)),
  m => Maybe.getOrDefault(m, 'Anonymous')
);
```

There are bridge functions between `Result` and `Maybe`. Is a `Maybe`'s `None` an error, or just absence? You make that decision:

```typescript
maybeToResult(Maybe.from(user), Err.notFound('User.Missing', 'User not found'));
```

### These<E, A> — Partial success

`Result` is either success or failure. But in the real world, there's a third state: **partial success**. You're parsing a CSV file; out of 1000 rows, 997 are correct, 3 are erroneous. Should you reject all of them, or swallow the errors? `These<E, A>` offers a third path: carrying both the result and the warnings together. This type doesn't exist in any of the competing libraries.

### pipe and flow — Functional composition

```typescript
const processUser = flow(
  validateAge,
  r => Result.map(r, u => u.email),
  r => Result.ensure(r, isValidEmail, Err.validation('Email.Invalid', '...'))
);

// Now processUser is a reusable pipeline
const result = processUser(user);
```

`pipe` starts with a value and applies functions sequentially. `flow` produces a function. The same concept as fp-ts, built into tsentials.

### NonEmptyArray<T> — Making impossible states unrepresentable

Scott Wlaschin's famous principle: "*Making Illegal States Unrepresentable.*" If you have an array that must not be empty, express this **in the type system**:

```typescript
function head<T>(as: NonEmptyArray<T>): T {  // NOT T | undefined, directly T
  return as[0];
}
```

The `head` function never returns `undefined` because its type excludes empty arrays. The best way to eliminate the possibility of an error is to make the error impossible in the first place.

### DDD patterns — ORM-independent domain model

```typescript
class Order {
  private readonly _base = createEntityBase();
  private readonly _soft = createSoftDeletable();

  get domainEvents() { return this._base.domainEvents; }
  get createdAt()    { return this._base.createdAt; }
  get isDeleted()    { return this._soft.isDeleted; }

  raise(event: DomainEvent) { this._base.raise(event); }
  markAsDeleted(at: Date, by: string) { this._soft.markAsDeleted(at, by); }
}
```

Not inheritance, **composition**. `createEntityBase()` provides domain events and an audit trail. `createSoftDeletable()` adds soft delete. No matter which ORM you use — TypeORM, Prisma, Drizzle — your domain model stays independent.

The `DateTimeProvider` abstraction makes time testable. In production, `SystemDateTimeProvider.utcNow()`; in tests, `createFakeDateTimeProvider(new Date('2024-06-01'))`. Time is now a dependency, not a hardcoded value.

### HTTP and JSON — APIs that never throw

```typescript
// Never throws exceptions. Network errors, 404, 500... all become Result<T>
const user = await fetchResult.get<User>('/api/users/42');

// With the fluent builder
const users = await RequestBuilder.get('/api/users')
  .header('Authorization', `Bearer ${token}`)
  .query('page', '1')
  .send<User[]>();
```

HTTP status codes are automatically converted to `ErrorType`: 400/422 → Validation, 401 → Unauthorized, 404 → NotFound, 500+ → Unexpected. Zero chance of throwing an exception; every outcome is a `Result<T>`.

The same philosophy on the JSON side:

```typescript
const result = safeJsonParse('{"name": "Alice"}');  // Result<Json>
const user = parseAndValidate<User>(raw, isUser);    // Result<User>
```

A direct application of Alexis King's "Parse, Don't Validate" principle. `JSON.parse` throws; `safeJsonParse` doesn't. `parseAndValidate` both parses and validates, returning the result in a type-safe manner.

### Eq, Ord, Predicate — Pragmatic type classes

```typescript
const eqUser = Eq.struct({ id: Eq.number, name: Eq.string });
const byAge = Ord.contramap(Ord.number, (u: User) => u.age);
const isAdult = Predicate.from((u: User) => u.age >= 18);
const isActive = Predicate.from((u: User) => u.isActive);
const hasVerifiedEmail = Predicate.from((u: User) => u.emailVerified);
const isEligible = Predicate.all(isAdult, isActive, hasVerifiedEmail);
```

The same power as fp-ts without the category theory jargon. Structural equality, type-safe ordering, composable boolean functions — all built in.

## Design decisions

There are a few design principles that are consistent across every module in tsentials:

**Immutable by default.** Not just at compile time, but at runtime too with `Object.freeze`. The object returned by `Result.success(value)` is frozen directly. Mutation is not possible.

**Namespace merging.** `Result` is both a type and a value:

```typescript
import { Result } from 'tsentials/result';

function getUser(id: number): Result<User> {     // As a type
  return Result.success({ id, name: 'Alice' });  // As a value
}
```

One import, dual usage. This feature that TypeScript offers keeps the API extremely clean.

**Zero dependencies, full tree-shaking.** `"sideEffects": false` in `package.json`. Only the modules you use end up in your bundle. ESM-only, Node ≥18, TypeScript ≥5.0.

**`description`, not `message`.** `AppError` deliberately uses `.description`, not `.message`. This is to avoid confusion with the native `Error` class. Consistency lies in the details.

## When to use which?

There are alternatives on the market. Each has its place:

**neverthrow** is the right choice if: Your only need is a simple `Result<T, E>` type, you don't need applicative validation, and you want minimal API surface area. It's lightweight, clear, and quick to get started with. However, there have been recent signs of neglect — PRs have gone unreviewed for months.

**Effect-TS** is the right choice if: You need fiber-based concurrency, built-in dependency injection, and resilience patterns like retry/circuit breaker. It's a full-blown effect system. The learning curve is steep and the bundle size is large, but it pays for itself in complex systems.

**tsentials** is the right choice if: You want multi-error collection, structured errors, business rule composition, DDD support, and pragmatic functional programming. You don't need to know category theory. With three API styles, everyone on your team can use it in their own way. The bundle is minimal, the learning curve is low, but depth is there.

|  | neverthrow | Effect-TS | tsentials |
| --- | --- | --- | --- |
| Multi-error collection | None | With Effect.validate | Built-in with AppError[] |
| Structured errors | Generic E | TaggedError | code + type + metadata |
| Rule engine | None | None | RuleEngine (and/or/linear/if) |
| DDD support | None | None | Entity, Events, Audit, Soft Delete |
| HTTP client | None | None | fetchResult + RequestBuilder |
| Learning curve | Low | High | Low |
| Bundle size | ~2KB | Large | Minimal |

This is not a "we're the best" table. The differences are clear: neverthrow is focused and lightweight, Effect-TS is comprehensive and powerful, tsentials is a pragmatic and balanced toolkit.

## Real world: User registration end to end

Let's leave theory behind. Here's how you'd write a user registration flow with tsentials:

```typescript
import { Result, fromAsync } from 'tsentials/result';
import { RuleEngine } from 'tsentials/rules';
import { Err } from 'tsentials/errors';
import { fetchResult } from 'tsentials/http';

// 1. Define the rules
const isAdult = RuleEngine.fromPredicate<RegisterInput>(
  input => input.age >= 18,
  Err.validation('Age.Underage', 'You must be 18 or older')
);

const hasStrongPassword = RuleEngine.fromPredicate<RegisterInput>(
  input => input.password.length >= 8,
  Err.validation('Password.Weak', 'Password must be at least 8 characters')
);

const registrationRules = RuleEngine.and(isAdult, hasStrongPassword);

// 2. Set up the pipeline
async function registerUser(input: RegisterInput) {
  return fromAsync(Promise.resolve(Result.success(input)))
    .andThen(data => RuleEngine.evaluate(registrationRules, data)) // returns void after validation
    .andThen(() => fetchResult.post<User>('/api/users', input))   // uses outer input via closure
    .tap(user => logger.info('User created', { id: user.id }))
    .match(
      user => ({ success: true, user }),
      errors => ({ success: false, errors: errors.map(e => e.description) })
    );
}
```

If the age check fails and the password is weak, the user sees **both errors at once**. If the API call fails, the HTTP status code is automatically converted to the appropriate `ErrorType`. There's no `try/catch` anywhere. No function throws an exception. The control flow is linear and predictable from start to finish.

## Conclusion

Error handling paradigms are changing. The error-as-value approach from Go and Rust has made its way into the TypeScript world. `try/catch` is being replaced by explicitly modeling errors as the function's return value.

This was exactly my motivation in creating tsentials: *pragmatic functional programming*. Bringing the practical benefits of railway-oriented programming to TypeScript developers without diving into the depths of category theory. I applied the same philosophy first in C#; when porting it to TypeScript, I took full advantage of the language's strengths — discriminated unions, type narrowing, namespace merging.

This library contains 19 modules, 1079 tests, and a consistent design philosophy. It can be used everywhere, from large-scale enterprise projects to small open-source tools.

Let's also acknowledge a reality: developers no longer write most of the code. AI agents write it; developers review it. In this new paradigm, a library's quality is measured not just by its API design, but by **how accurately AI can use it**. tsentials is ready for this: detailed agent skill definitions, API signatures, critical naming rules, and usage examples are documented as built-in for every module. Whether you use Claude Code, Cursor, or Copilot, you can feed these skills to get full value from the library. Mistakes like AI writing `then` instead of `andThen`, or assuming `Result.map` is curried, disappear when given the right context. The library is readable not just for humans, but for agents too.

Installation is a single command:

```bash
npx skills add senrecep/tsentials
```

`npm install` installs your package; `npx skills add` ensures your AI agent *uses it correctly*.

If you're currently struggling with `try/catch` blocks, dealing with collecting validation errors one by one, or trying to guess when your functions might throw — maybe it's time to change your perspective.

### Getting started

```bash
npm install tsentials
```

```typescript
import { Result } from 'tsentials/result';
import { Err } from 'tsentials/errors';

const result = Result.success(42);
// You've taken the first step. The type system will show you the rest.
```

**GitHub:** [github.com/senrecep/tsentials](https://github.com/senrecep/tsentials)
**Documentation:** [senrecep.github.io/tsentials](https://senrecep.github.io/tsentials/)

Remember: if your function signature is lying, even the most advanced test suite can't protect you. Make your errors visible.
