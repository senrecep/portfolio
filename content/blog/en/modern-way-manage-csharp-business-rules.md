---
title: "The Modern Way to Manage C# Business Rules: Rule Engine Pattern"
description: "A modern C# pattern for managing business rules that provides centralized control, high testability, and optimal performance through the Result Pattern."
date: "2025-02-04"
slug: "modern-way-manage-csharp-business-rules"
mediumUrl: "https://medium.com/@senrecep/the-modern-way-to-manage-c-business-rules-rule-engine-pattern-14bb1c72d700"
imageUrl: "/images/rule-engine.webp"
keywords: ["C# business rules", "Rule Engine Pattern", "Result Pattern", "CSharpEssentials", "domain validation", "clean architecture", "error handling", "testability"]
author: "Recep Sen"
modifiedDate: "2025-02-04"
category: "Tutorial"
faq:
  - q: "What is the Rule Engine Pattern in C# and when should I use it?"
    a: "The Rule Engine Pattern centralizes all business validation logic into discrete, composable rule objects instead of scattering if/else chains across your codebase. It is ideal for domains with many business rules — such as finance, e-commerce, or healthcare — where rules change frequently and testability is critical."
  - q: "How does the Result Pattern improve error handling compared to exceptions?"
    a: "The Result Pattern returns success or failure as a first-class value rather than throwing exceptions for expected business errors. This eliminates performance overhead from exception unwinding, makes error paths explicit in the type system, and produces consistent, predictable error messages across the application."
  - q: "What types of rules does the CSharpEssentials Rule Engine support?"
    a: "The library supports sequential linear rules (chain of responsibility), logical AND/OR combinators, and async variants for all rule types. Rules can be defined as classes, records, structs, or readonly record structs, giving you full flexibility to match your performance and immutability requirements."
---

In the modern software world, managing business rules is becoming increasingly critical. Especially in sectors like finance, e-commerce, and healthcare, managing, maintaining, and testing hundreds or even thousands of business rules has become a significant challenge. Scattered implementation of these rules leads to many problems such as duplicate code, inconsistent error messages, and testability issues.

In this article, we’ll explore a modern and effective way to manage business rules in the C# world: **Rule Engine Pattern**. With this pattern, you can:  
\- 🎯 Centralize your business rules  
\- 🎯 Make your code more testable  
\- 🎯 Reduce maintenance costs  
\- 🎯 Optimize performance


![](https://miro.medium.com/v2/resize:fit:700/1*uhmymuqnTUrR1QkfGAL8-g.png)

**🤔 Problem and Solution: Rule Engine Pattern**

**Challenges of Traditional Approaches**

**Technical Aspects  
**\- ❌ Scattered and duplicate validation code  
\- ❌ Low test coverage and difficult testability  
\- ❌ Poor error handling and inconsistent messages  
\- ❌ Performance issues  
\- ❌ Complex and difficult maintainability

**Business Process Aspects  
**\- ❌ Insufficient documentation  
\- ❌ Slow adaptation to changing rules  
\- ❌ Complex rule dependencies  
\- ❌ Lack of centralized management

**Solution with Rule Engine Pattern  
**The Rule Engine Pattern solves these problems by:

\- ✅ **Centralized Management**: All rules are managed from a single place  
\- ✅ **High Testability**: Each rule can be tested independently  
\- ✅ **Easy Maintenance**: Rules are modular and follow single responsibility principle  
\- ✅ **Type Safety**: Secure operations with compile-time type checking  
\- ✅ **Performance**: Optimum performance with record struct and immutable design  
\- ✅ **Consistent Error Handling**: Transparent and rich error details with Result pattern  
\- ✅ **Quick Adaptation**: New rules can be easily added and modified  
\- ✅ **Clean Code**: SOLID-compliant, readable, and maintainable code

**💡 Core Components of Rule Engine Pattern**

**1\. Result Pattern  
**The Result Pattern, which is the heart of the Rule Engine, is the key to modern error handling. By using Result type instead of exceptions:  
\- 🎯 You prevent performance loss  
\- 🎯 Make your code more predictable  
\- 🎯 Better manage error cases

**2\. Rule Types and Definition Approaches**

The Rule Engine supports both OOP and functional programming approaches. You can define rules using the following structures:

```csharp
public sealed class UserRule : IRule<User> { }
public sealed record UserRule : IRule<User> { }
public struct UserRule : IRule<User> { }
public readonly record struct UserRule : IRule<User> { }
```

Advantages of using \`readonly record struct\`:  
\- ✅ No heap allocation as it’s a value type  
\- ✅ Thread-safe due to immutability  
\- ✅ Easy implementation with record syntax  
\- ✅ Performance optimization with readonly  
\- ✅ Small memory footprint

**3\. Rule Interfaces  
**The Rule Engine provides specialized interfaces for different scenarios:

**3.1. Simple Rules  
**Rules that perform a single validation:

```csharp
IRule<TContext>
IRule<TContext, TResult>
IAsyncRule<TContext>

IAsyncRule<TContext, TResult>

internal readonly record struct AdultRule : IRule<User>{
    public Result Evaluate(User context) =>
        context.Age >= 18
            ? Result.Success()
            : Error.Validation("USER.NOT_ADULT", "User must be 18 or older");
}
```

**3.2. Linear Rules  
**Chain of rules that follow each other:

```csharp
ILinearRule<TContext>
ILinearRule<TContext, TResult>
ILinearAsyncRule<TContext>

ILinearAsyncRule<TContext, TResult>

internal readonly record struct EmailFormatRule : ILinearRule<string>{
    public IRuleBase<string>? Next => new DomainRule();
    public Result Evaluate(string email) =>
        email.Contains('@')
            ? Result.Success()
            : Error.Validation("EMAIL.INVALID_FORMAT", "Email must contain @");
}
```

**3.3. Logical Rules  
**Rules that can be combined with AND/OR operators:

```csharp
IAndRule<TContext>
IAndRule<TContext, TResult>
IAndAsyncRule<TContext>
IAndAsyncRule<TContext, TResult>
IOrRule<TContext>

IOrRule<TContext, TResult>
IOrAsyncRule<TContext>
IOrAsyncRule<TContext, TResult>

internal readonly record struct PaymentMethodRule : IOrRule<Payment>{
    public IRuleBase<Payment>[] Rules =>
    [
        new CreditCardRule(),
        new BankTransferRule(),
        new CryptoRule()
    ];
}
```

**3.4. Conditional Rules  
**Rules that can branch based on the result:

```csharp
IConditionalRule<TContext>

IConditionalRule<TContext, TResult>
IConditionalAsyncRule<TContext>
IConditionalAsyncRule<TContext, TResult>

internal readonly record struct CardTypeRule : IConditionalRule<CreditCard>{
    public IRuleBase<CreditCard>? Success => new AmexRule();
    public IRuleBase<CreditCard>? Failure => new MasterCardRule();
    public Result Evaluate(CreditCard context) =>
        context.Number.Length == 15
            ? Result.Success()
            : Result.Failure();
}
```

**🚀 Implementation Examples**

**1\. E-Commerce Order Validation**

```csharp
public readonly record struct OrderValidationRule : IAndRule<Order>{
    private readonly IStockService _stockService;
    private readonly IPaymentService _paymentService;
    public OrderValidationRule(IStockService stockService, IPaymentService paymentService)
    {
        _stockService = stockService;
        _paymentService = paymentService;
    }
    public IRuleBase<Order>[] Rules =>
    [
        new OrderAmountRule(minimumAmount: 50),
        new StockAvailabilityRule(_stockService),
        new PaymentMethodValidationRule(_paymentService),
        new ShippingAddressRule(),
        new UserValidationRule()
    ];
}
```

**2\. Finance: Credit Application**

```csharp
public readonly record struct CreditApplicationRule : ILinearRule<CreditApplication>{
    private readonly ICreditScoreService _creditScoreService;
    private readonly IBlacklistService _blacklistService;
    public CreditApplicationRule(ICreditScoreService creditScoreService, IBlacklistService blacklistService)
    {
        _creditScoreService = creditScoreService;
        _blacklistService = blacklistService;
    }
    public IRuleBase<CreditApplication>? Next => new CreditScoreRule(_creditScoreService);
    public async ValueTask<Result> EvaluateAsync(CreditApplication application)
    {
        var blacklistResult = await _blacklistService.CheckAsync(application.UserId);
        if (blacklistResult.IsBlacklisted)
            return Error.Validation("CREDIT.BLACKLISTED", "User is blacklisted");
        if (application.Age < 18)
            return Error.Validation("CREDIT.UNDERAGE", "Must be 18 or older");
        if (application.MonthlyIncome < 5000)
            return Error.Validation(
                code: "CREDIT.LOW_INCOME",
                description: "Insufficient monthly income",
                metadata: new ErrorMetadata(
                    ("MinimumIncome", 5000),
                    ("ActualIncome", application.MonthlyIncome)
                )
            );
        return Result.Success();
    }
}
```

**🎯 Best Practices**

1.  **Single Responsibility Principle  
    **Each rule should check only one thing.
2.  **Centralized Error Management  
    **Define error objects in a central place instead of creating them in methods:

```csharp
internal static class UserErrors{
    public static Error NotAdult => Error.Validation(
        code: "USER.NOT_ADULT",
        description: "User is not adult"
    );
    public static Error InvalidSalary(decimal minSalary, decimal actualSalary) => Error.Validation(
        code: "USER.INVALID_SALARY",
        description: "User has insufficient salary",
        metadata: new ErrorMetadata(
            new KeyValuePair<string, object?>("MinSalary", minSalary),
            new KeyValuePair<string, object?>("ActualSalary", actualSalary)
        )
    );
}
public Result Evaluate(User context)
{
    if (context.Age < 18)
        return UserErrors.NotAdult;
    if (context.Salary < 5000)
        return UserErrors.InvalidSalary(5000, context.Salary);
    return Result.Success();
}
```

Advantages of this approach:  
\- ✅ Centralized management of error codes and messages  
\- ✅ Prevents code duplication  
\- ✅ Consistent error messages  
\- ✅ Easy maintenance and updates  
\- ✅ IntelliSense support

3\. **Descriptive Error Codes  
\-** Domain/operation-based grouping (USER._\*, PAYMENT.\*_, ORDER.\*)  
\- Meaningful and descriptive codes (NOT\_FOUND, INVALID\_FORMAT, INSUFFICIENT\_FUNDS)  
\- Consistent naming convention

4\. **Rich Metadata Usage  
**\- Enrich error details with metadata  
\- Add useful information for debugging and logging  
\- Provide helpful details to the client

5\. **Testability  
\-** Each rule should be independently testable  
\- Write separate test cases for error conditions  
\- Test metadata values as well

6\. **Performance  
\-** Minimize heap allocation using record struct  
\- Reduce object creation with static error definitions  
\- Avoid unnecessary string concatenation

7\. **Rule Definitions  
**\- Preferably use \`**readonly record struct**\`  
\- Design immutable rule state  
\- Manage dependencies with constructor injection  
\- Keep rules small and focused

**🔄 Functional Style Uses**

**AND Rules  
**Cases where all rules must succeed:

```csharp
Result result = RuleEngine.And(
    rules: [
        UserRules.ActiveCheck,
        UserRules.AdultCheck,
        UserRules.SalaryCheck,
        UserRules.CoupleCheck
    ],
    context: user);
Result result = RuleEngine.And(
    rules: [
        input => input % 2 == 0,
        input => input % 3 == 0
    ],
    context: 120);

```

**OR Rules  
**Cases where at least one rule must succeed:

```csharp
Result result = RuleEngine.Or(
    rules: [
        PaymentRules.CreditCardCheck,
        PaymentRules.BankTransferCheck
    ],
    context: payment);
Result result = RuleEngine.Or(
    rules: [
        input => input > 0,
        input => input % 2 == 0
    ],
    context: 120);

```

**Linear Rules  
**Cases requiring sequential validation:

```csharp
Result result = RuleEngine.Linear(
    rules: [
        EmailRules.EmptyCheck,
        EmailRules.AtSignCheck,
        EmailRules.LocalPartCheck,
        EmailRules.DomainCheck
    ],
    context: email);
Result result1 = RuleEngine.Linear(
    rules: [
        input => input > 0,
        input => input < 100,
        input => input % 2 == 0,
        input => input % 3 == 0
    ],
    context: 120);
Result result2 = RuleEngine.Linear(
    rules: [
        input => input > 0
            ? Result.Success()
            : Error.Validation("input_greater_than_0"),
        input => input < 100
            ? Result.Success()
            : Error.Validation("input_less_than_100"),
        input => input % 2 == 0
            ? Result.Success()
            : Error.Validation("input_even"),
        input => input % 3 == 0
            ? Result.Success()
            : Error.Validation("input_multiple_of_3")
    ],
    context: 120);

```

**Conditional Rules**

```csharp
Result result = RuleEngine.If(
    rule: input => input > 0,
    success: input => input < 100,
    failure: input => input % 2 == 0,
    context: 120);
```

**🎯 Rule Types and Function Signatures**

**1\. OOP Rule Types**

**1.1. Simple Rules**

```csharp
IRule<TContext>
IRule<TContext, TResult>
IAsyncRule<TContext>
IAsyncRule<TContext, TResult>
```

**1.2. Linear Rules**

```csharp
ILinearRule<TContext>
ILinearRule<TContext, TResult>
ILinearAsyncRule<TContext>
ILinearAsyncRule<TContext, TResult>
```

**1.3. OR Rules**

```csharp
IOrRule<TContext>
IOrRule<TContext, TResult>
IOrAsyncRule<TContext>
IOrAsyncRule<TContext, TResult>
```

**1.4. AND Rules**

```csharp
IAndRule<TContext>
IAndRule<TContext, TResult>
IAndAsyncRule<TContext>
IAndAsyncRule<TContext, TResult>
```

**1.5. Conditional Rules**

```csharp
IConditionalRule<TContext>
IConditionalRule<TContext, TResult>
IConditionalAsyncRule<TContext>
IConditionalAsyncRule<TContext, TResult>
```

**2\. Functional Approach Signatures**

**2.1. Simple Function Signatures**

```csharp
Func<TContext, Result>
Func<TContext, CancellationToken, Result>
Func<TContext, CancellationToken, ValueTask<Result>>
```

**2.2. Generic Result Returning Functions**

```csharp
Func<TContext, Result<TResult>>
Func<TContext, CancellationToken, Result<TResult>>
Func<TContext, CancellationToken, ValueTask<Result<TResult>>>
```

This rich type system allows you to:  
\- ✅ Choose the appropriate rule type for each scenario  
\- ✅ Mix sync/async operations  
\- ✅ Enhance type safety with generic results  
\- ✅ Improve resource management with cancellation token support  
\- ✅ Use both functional and OOP approaches together

**🚀 Conclusion**

The Rule Engine Pattern helps make your business rules:  
\- ✅ More organized  
\- ✅ Easier to maintain  
\- ✅ More testable  
\- ✅ More performant

Using this pattern, you can centralize your validation logic and improve your code quality.

**🔗 Useful Links**

📦 [NuGet Package](https://www.nuget.org/packages/CSharpEssentials)  
💻 [GitHub Repository](https://github.com/SenRecep/CSharpEssentials)  
📚 [All My NuGet Packages](https://www.nuget.org/profiles/recepsen)

**🤝 Open Source Contribution**

I’ve shared the project as open source on GitHub. You can examine the source code, fork the project if you want to contribute, and send pull requests. If you encounter any issues or have feature suggestions, you can open an issue on GitHub. If you want to try it and provide feedback, I’m looking forward to your comments!

Visit our GitHub repository for the examples we’ve seen in this article and more. Don’t forget to leave your comments for questions and suggestions 👋