---
title: "Performance Analysis of Parameter Passing Methods in C#"
description: "Deep dive into C# parameter passing: Comparing struct, class, record & ref types with benchmarks. Learn best practices for optimization."
date: "2025-02-20"
slug: "performance-analysis-parameter-passing-csharp"
mediumUrl: "https://senrecep.medium.com/performance-analysis-of-parameter-passing-methods-in-c-ceeffcefd624"
imageUrl: "/images/parameters.webp"
keywords: ["C# performance", "parameter passing", "struct vs class", "BenchmarkDotNet", "ref struct", "readonly struct", "memory allocation", "C# optimization"]
author: "Recep Sen"
modifiedDate: "2025-02-20"
category: "Technology"
faq:
  - q: "Which C# type is fastest for passing parameters in high-performance scenarios?"
    a: "Based on BenchmarkDotNet benchmarks across 660 test scenarios, readonly record struct and ref struct types consistently outperform class and record reference types. Value types avoid heap allocation entirely, which eliminates GC pressure and reduces mean execution time significantly in hot paths."
  - q: "When should I use struct vs class for method parameters in C#?"
    a: "Use struct types (especially readonly struct or readonly record struct) when the data is small (typically under 16 bytes), immutable, and passed frequently in performance-critical code. Use class or record reference types when the object is large, shared, or mutated, since copying large structs is more expensive than passing a reference."
  - q: "How does BenchmarkDotNet measure C# parameter passing performance?"
    a: "BenchmarkDotNet runs each test scenario multiple times (averaging 11 iterations per scenario in this study) and reports mean execution time, standard deviation, median, and heap allocation (Gen0 collections and bytes allocated). This statistical approach filters out noise and gives reliable performance comparisons across different type combinations."
---

In modern software development, performance is a critical factor for the success of our applications. Especially in high-traffic systems, even micro-optimizations can have significant effects. In this article, we will examine the performance effects of different parameter passing methods in C# in detail.


![](https://miro.medium.com/v2/resize:fit:700/1*TaEfLjbYsF33FDctLLbI6g.png)

**Test Environment and Methodology**

-   **Technical Specifications  
    **\- Test Framework: BenchmarkDotNet  
    \- Test Scenarios: Parameter counts from 3 to 8  
    \- Total Test Count: 660 (60 scenarios × average 11 iterations)  
    \- Tested Types:  
    — Struct Based: \`**struct**\`, \`**readonly struct**\`, \`**ref struct**\`, \`**readonly ref struct**\`, \`**record struct**\`, \`**readonly record struct**\`  
    — Reference Based: \`**class**\`, \`**sealed class**\`, \`**record**\`, \`**sealed record**\`  
    — Direct Parameter Passing
-   **Measurement Metrics  
    **\- Mean: Average execution time of the method  
    \- Error: Error margin in measurements  
    \- StdDev: Consistency of measurements  
    \- Median: Median execution time  
    \- Memory Usage: Amount of memory allocated on the heap

**Raw Benchmark Results**

```text
| Method                                | Categories  | Mean      | Error     | StdDev    | Median    | Iterations | Gen0   | Allocated |
| ------------------------------------- | ----------- | --------: | --------: | --------: | --------: | ---------: | -----: | --------: |
| EightParametersByReadonlyStruct       | EightParams | 0.0089 ns | 0.0021 ns | 0.0020 ns | 0.0095 ns | 15.00      | -      | -         |
| EightParametersByRecordStruct         | EightParams | 0.0108 ns | 0.0041 ns | 0.0039 ns | 0.0103 ns | 15.00      | -      | -         |
| EightParametersByReadonlyRefStruct    | EightParams | 0.0134 ns | 0.0020 ns | 0.0018 ns | 0.0132 ns | 14.00      | -      | -         |
| EightParametersByRefStruct            | EightParams | 0.0156 ns | 0.0030 ns | 0.0028 ns | 0.0163 ns | 15.00      | -      | -         |
| EightParametersByStruct               | EightParams | 0.0171 ns | 0.0039 ns | 0.0037 ns | 0.0176 ns | 15.00      | -      | -         |
| EightParametersByReadonlyRecordStruct | EightParams | 0.0268 ns | 0.0023 ns | 0.0022 ns | 0.0270 ns | 15.00      | -      | -         |
| EightParameters                       | EightParams | 0.0374 ns | 0.0211 ns | 0.0176 ns | 0.0298 ns | 13.00      | -      | -         |
| EightParametersBySealedClass          | EightParams | 3.9528 ns | 0.0108 ns | 0.0084 ns | 3.9549 ns | 12.00      | 0.0076 | 48 B      |
| EightParametersBySealedRecord         | EightParams | 3.9665 ns | 0.0147 ns | 0.0131 ns | 3.9667 ns | 14.00      | 0.0076 | 48 B      |
| EightParametersByRecord               | EightParams | 4.0113 ns | 0.0220 ns | 0.0206 ns | 4.0012 ns | 15.00      | 0.0076 | 48 B      |
| EightParametersByClass                | EightParams | 4.0182 ns | 0.0551 ns | 0.0431 ns | 4.0169 ns | 12.00      | 0.0076 | 48 B      |
| Method                                | Categories  | Mean      | Error     | StdDev    | Median    | Iterations | Gen0   | Allocated |
| ------------------------------------- | ----------- | --------: | --------: | --------: | --------: | ---------: | -----: | --------: |
| SevenParametersByReadonlyStruct       | SevenParams | 0.0132 ns | 0.0024 ns | 0.0022 ns | 0.0130 ns | 14.00      | -      | -         |
| SevenParametersByStruct               | SevenParams | 0.0146 ns | 0.0028 ns | 0.0026 ns | 0.0142 ns | 13.00      | -      | -         |
| SevenParameters                       | SevenParams | 0.0159 ns | 0.0052 ns | 0.0046 ns | 0.0166 ns | 14.00      | -      | -         |
| SevenParametersByReadonlyRefStruct    | SevenParams | 0.0177 ns | 0.0026 ns | 0.0022 ns | 0.0176 ns | 13.00      | -      | -         |
| SevenParametersByRecordStruct         | SevenParams | 0.0179 ns | 0.0017 ns | 0.0016 ns | 0.0178 ns | 15.00      | -      | -         |
| SevenParametersByRefStruct            | SevenParams | 0.0179 ns | 0.0024 ns | 0.0022 ns | 0.0181 ns | 15.00      | -      | -         |
| SevenParametersByReadonlyRecordStruct | SevenParams | 0.0292 ns | 0.0026 ns | 0.0023 ns | 0.0288 ns | 14.00      | -      | -         |
| SevenParametersByClass                | SevenParams | 3.9931 ns | 0.0254 ns | 0.0237 ns | 3.9937 ns | 15.00      | 0.0076 | 48 B      |
| SevenParametersBySealedClass          | SevenParams | 4.0053 ns | 0.0161 ns | 0.0135 ns | 3.9979 ns | 13.00      | 0.0076 | 48 B      |
| SevenParametersByRecord               | SevenParams | 4.0944 ns | 0.0724 ns | 0.0677 ns | 4.0916 ns | 15.00      | 0.0076 | 48 B      |
| SevenParametersBySealedRecord         | SevenParams | 4.1725 ns | 0.1052 ns | 0.0879 ns | 4.2199 ns | 13.00      | 0.0076 | 48 B      |
| Method                                | Categories  | Mean      | Error     | StdDev    | Median    | Iterations | Gen0   | Allocated |
| ------------------------------------- | ----------- | --------: | --------: | --------: | --------: | ---------: | -----: | --------: |
| SixParametersByRefStruct              | SixParams   | 0.0021 ns | 0.0085 ns | 0.0066 ns | 0.0000 ns | 12.00      | -      | -         |
| SixParametersByRecordStruct           | SixParams   | 0.0131 ns | 0.0069 ns | 0.0061 ns | 0.0110 ns | 14.00      | -      | -         |
| SixParametersByReadonlyRecordStruct   | SixParams   | 0.0136 ns | 0.0054 ns | 0.0045 ns | 0.0130 ns | 13.00      | -      | -         |
| SixParametersByStruct                 | SixParams   | 0.0146 ns | 0.0016 ns | 0.0012 ns | 0.0149 ns | 12.00      | -      | -         |
| SixParametersByReadonlyRefStruct      | SixParams   | 0.0168 ns | 0.0114 ns | 0.0101 ns | 0.0159 ns | 14.00      | -      | -         |
| SixParameters                         | SixParams   | 0.0208 ns | 0.0072 ns | 0.0064 ns | 0.0184 ns | 14.00      | -      | -         |
| SixParametersByReadonlyStruct         | SixParams   | 0.0386 ns | 0.0213 ns | 0.0210 ns | 0.0383 ns | 16.00      | -      | -         |
| SixParametersBySealedClass            | SixParams   | 3.6935 ns | 0.0120 ns | 0.0106 ns | 3.6921 ns | 14.00      | 0.0064 | 40 B      |
| SixParametersBySealedRecord           | SixParams   | 3.7268 ns | 0.0095 ns | 0.0079 ns | 3.7270 ns | 13.00      | 0.0064 | 40 B      |
| SixParametersByRecord                 | SixParams   | 3.7375 ns | 0.0099 ns | 0.0088 ns | 3.7393 ns | 14.00      | 0.0064 | 40 B      |
| SixParametersByClass                  | SixParams   | 3.7637 ns | 0.0832 ns | 0.0854 ns | 3.7260 ns | 17.00      | 0.0064 | 40 B      |
| Method                                | Categories  | Mean      | Error     | StdDev    | Median    | Iterations | Gen0   | Allocated |
| ------------------------------------- | ----------- | --------: | --------: | --------: | --------: | ---------: | -----: | --------: |
| FiveParametersByStruct                | FiveParams  | 0.0122 ns | 0.0028 ns | 0.0026 ns | 0.0130 ns | 15.00      | -      | -         |
| FiveParameters                        | FiveParams  | 0.0145 ns | 0.0068 ns | 0.0057 ns | 0.0136 ns | 13.00      | -      | -         |
| FiveParametersByRecordStruct          | FiveParams  | 0.0147 ns | 0.0033 ns | 0.0031 ns | 0.0148 ns | 15.00      | -      | -         |
| FiveParametersByReadonlyStruct        | FiveParams  | 0.0159 ns | 0.0033 ns | 0.0031 ns | 0.0162 ns | 15.00      | -      | -         |
| FiveParametersByReadonlyRecordStruct  | FiveParams  | 0.0167 ns | 0.0043 ns | 0.0041 ns | 0.0170 ns | 15.00      | -      | -         |
| FiveParametersByReadonlyRefStruct     | FiveParams  | 0.0167 ns | 0.0037 ns | 0.0032 ns | 0.0170 ns | 14.00      | -      | -         |
| FiveParametersByRefStruct             | FiveParams  | 0.0275 ns | 0.0138 ns | 0.0129 ns | 0.0205 ns | 15.00      | -      | -         |
| FiveParametersBySealedRecord          | FiveParams  | 3.6785 ns | 0.0159 ns | 0.0141 ns | 3.6770 ns | 14.00      | 0.0064 | 40 B      |
| FiveParametersBySealedClass           | FiveParams  | 3.6964 ns | 0.0158 ns | 0.0123 ns | 3.6935 ns | 12.00      | 0.0064 | 40 B      |
| FiveParametersByRecord                | FiveParams  | 3.6994 ns | 0.0114 ns | 0.0107 ns | 3.6982 ns | 15.00      | 0.0064 | 40 B      |
| FiveParametersByClass                 | FiveParams  | 3.8910 ns | 0.0951 ns | 0.0794 ns | 3.9040 ns | 13.00      | 0.0064 | 40 B      |
| Method                                | Categories  | Mean      | Error     | StdDev    | Median    | Iterations | Gen0   | Allocated |
| ------------------------------------- | ----------- | --------: | --------: | --------: | --------: | ---------: | -----: | --------: |
| FourParameters                        | FourParams  | 0.0171 ns | 0.0047 ns | 0.0044 ns | 0.0154 ns | 15.00      | -      | -         |
| FourParametersByReadonlyRecordStruct  | FourParams  | 0.5746 ns | 0.0333 ns | 0.0396 ns | 0.5763 ns | 21.00      | -      | -         |
| FourParametersByRecordStruct          | FourParams  | 0.5781 ns | 0.0305 ns | 0.0271 ns | 0.5790 ns | 14.00      | -      | -         |
| FourParametersByReadonlyStruct        | FourParams  | 0.5926 ns | 0.0342 ns | 0.0380 ns | 0.5998 ns | 19.00      | -      | -         |
| FourParametersByStruct                | FourParams  | 0.6749 ns | 0.0347 ns | 0.0426 ns | 0.6816 ns | 22.00      | -      | -         |
| FourParametersByRefStruct             | FourParams  | 0.6863 ns | 0.0359 ns | 0.0515 ns | 0.6945 ns | 28.00      | -      | -         |
| FourParametersByReadonlyRefStruct     | FourParams  | 0.6889 ns | 0.0364 ns | 0.0577 ns | 0.6910 ns | 33.00      | -      | -         |
| FourParametersBySealedClass           | FourParams  | 3.4595 ns | 0.0209 ns | 0.0195 ns | 3.4674 ns | 15.00      | 0.0051 | 32 B      |
| FourParametersByClass                 | FourParams  | 3.4767 ns | 0.0314 ns | 0.0294 ns | 3.4868 ns | 15.00      | 0.0051 | 32 B      |
| FourParametersByRecord                | FourParams  | 3.4836 ns | 0.0144 ns | 0.0135 ns | 3.4857 ns | 15.00      | 0.0051 | 32 B      |
| FourParametersBySealedRecord          | FourParams  | 3.7335 ns | 0.0230 ns | 0.0215 ns | 3.7415 ns | 15.00      | 0.0051 | 32 B      |
| Method                                | Categories  | Mean      | Error     | StdDev    | Median    | Iterations | Gen0   | Allocated |
| ------------------------------------- | ----------- | --------: | --------: | --------: | --------: | ---------: | -----: | --------: |
| ThreeParameters                       | ThreeParams | 0.0188 ns | 0.0115 ns | 0.0102 ns | 0.0155 ns | 14.00      | -      | -         |
| ThreeParametersByRecordStruct         | ThreeParams | 0.5678 ns | 0.0277 ns | 0.0259 ns | 0.5662 ns | 15.00      | -      | -         |
| ThreeParametersByReadonlyRecordStruct | ThreeParams | 0.5717 ns | 0.0302 ns | 0.0267 ns | 0.5729 ns | 14.00      | -      | -         |
| ThreeParametersByRefStruct            | ThreeParams | 0.7168 ns | 0.0360 ns | 0.0538 ns | 0.7239 ns | 30.00      | -      | -         |
| ThreeParametersByReadonlyRefStruct    | ThreeParams | 0.7234 ns | 0.0365 ns | 0.0721 ns | 0.7082 ns | 48.00      | -      | -         |
| ThreeParametersByReadonlyStruct       | ThreeParams | 0.7349 ns | 0.0368 ns | 0.0573 ns | 0.7346 ns | 32.00      | -      | -         |
| ThreeParametersByStruct               | ThreeParams | 0.7548 ns | 0.0370 ns | 0.0648 ns | 0.7332 ns | 39.00      | -      | -         |
| ThreeParametersByClass                | ThreeParams | 3.4737 ns | 0.0831 ns | 0.0737 ns | 3.4421 ns | 14.00      | 0.0051 | 32 B      |
| ThreeParametersBySealedClass          | ThreeParams | 3.4743 ns | 0.0697 ns | 0.0582 ns | 3.4544 ns | 13.00      | 0.0051 | 32 B      |
| ThreeParametersBySealedRecord         | ThreeParams | 3.8524 ns | 0.0835 ns | 0.0781 ns | 3.8314 ns | 15.00      | 0.0051 | 32 B      |
| ThreeParametersByRecord               | ThreeParams | 3.9852 ns | 0.1021 ns | 0.1327 ns | 3.9314 ns | 24.00      | 0.0051 | 32 B      |
```

**Performance of Struct-Based Types**

**1\. struct and readonly struct  
**Structs showed the best performance especially for small data structures:  
\- ~0.6–0.7 ns with 3–4 parameters  
\- ~0.01–0.03 ns with 5+ parameters  
\- No memory allocation (stack-based)  
\- \`**readonly struct**\` is 5–10% faster on average compared to normal \`struct\`

**2\. ref struct and readonly ref struct  
**Safe performance with heap allocation restriction:  
\- Similar performance to normal structs  
\- No memory allocation  
\- Extra security with reference semantics

**3\. record struct and readonly record struct  
**High performance with modern C# features:  
\- Best performing structures  
\- ~0.57 ns with 3–4 parameters  
\- ~0.01–0.02 ns with 5+ parameters  
\- Includes immutability and equality comparison

**Performance of Reference Types**

**1\. class and sealed class  
**General characteristics of reference types:  
\- Average range of 3.4–4.0 ns  
\- \`**sealed class**\` is 1–3% faster than normal \`class\`

**2\. record and sealed record  
**Modern immutable data structures:  
\- Similar performance to classes  
\- Same memory usage pattern  
\- Value-based equality and immutability advantages

**Direct Parameter Passing  
**The simplest approach:  
\- Consistent low latency (~0.015–0.037 ns)  
\- No memory allocation  
\- Code readability and maintenance difficulty disadvantages

**General Recommendations**

**Less Than 5 Parameters  
**\- Prefer \`**readonly record struct**\`  
\- Use \`**readonly ref struct**\` if memory sensitive  
\- Use \`**record**\` if immutability is important

**5+ Parameters  
**\- Struct-based types have significant advantage  
\- Use \`**readonly**\` modifier  
\- Consider parameter grouping

**Special Cases  
**\- When inheritance is needed: Base class with inheritance hierarchy  
\- When value equality is important: \`record\`  
\- When stack-only is required: \`ref struct\`

**Performance Optimization Suggestions**

**By Parameter Count  
**\- 3–4 parameters: Struct-based types  
\- 5+ parameters: Readonly struct variations  
\- Many parameters: Consider grouping

**Memory Optimization  
**\- Maximize stack usage  
\- Avoid unnecessary heap allocations  
\- Use appropriately sized structs

**Type Selection Criteria  
**\- Performance requirements  
\- Memory constraints  
\- Code maintainability balance

**Conclusion  
**This benchmark study has thoroughly revealed the performance characteristics of parameter passing methods in C#. Especially modern C# features (like \`**readonly record struct**\`) offer significant advantages in terms of both performance and code quality.

**Key findings  
**1\. Struct-based types show superior performance especially with 5+ parameters  
2\. Positive performance effect of readonly modifier  
3\. Modern and efficient use of record structures  
4\. Memory usage characteristics of reference types

You can access the source code of the benchmark tests in this article via [.NET Fiddle](https://dotnetfiddle.net/cyCLlv).

**About the Author  
**\- Website: [senrecep.com](https://senrecep.com/)  
\- GitHub: [senrecep](https://github.com/senrecep)  
\- Nuget: [recepsen](https://www.nuget.org/profiles/recepsen)  
\- LinkedIn: [senrecep](https://linkedin.com/in/senrecep)  
\- X: [@senrecep0](https://twitter.com/senrecep0)