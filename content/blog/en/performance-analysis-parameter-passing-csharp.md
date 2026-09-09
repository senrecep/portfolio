---
title: "Performance Analysis of Parameter Passing Methods in C#"
description: "Deep dive into C# parameter passing: Comparing struct, class, record & ref types with benchmarks. Learn best practices for optimization."
date: "2025-02-20"
slug: "performance-analysis-parameter-passing-csharp"
mediumUrl: "https://senrecep.medium.com/performance-analysis-of-parameter-passing-methods-in-c-ceeffcefd624"
imageUrl: "/images/parameters.webp"
keywords: ["C# performance", "parameter passing", "struct vs class", "BenchmarkDotNet", "ref struct", "readonly struct", "memory allocation", "C# optimization"]
author: "Recep ŞEN"
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

A while back I was profiling a high-throughput service that processed hundreds of thousands of requests per second. The CPU profiles looked reasonable, memory allocations looked fine — until I noticed that a handful of hot-path methods were consistently triggering Gen0 garbage collections. The culprit turned out to be something I had never thought twice about: the way I was passing parameters.

That experience sent me down a rabbit hole. I wanted actual numbers — not intuition, not Stack Overflow answers, but measured nanosecond-level data across every major C# type. So I built a BenchmarkDotNet harness, ran 660 test scenarios, and wrote up what I found.

## Test Setup

Before getting into the results, here's exactly what I measured and how.

**Technical specifications:**
- Test Framework: BenchmarkDotNet
- Test Scenarios: Parameter counts from 3 to 8
- Total Test Count: 660 (60 scenarios × average 11 iterations)
- Tested Types:
  - Struct-based: `struct`, `readonly struct`, `ref struct`, `readonly ref struct`, `record struct`, `readonly record struct`
  - Reference-based: `class`, `sealed class`, `record`, `sealed record`
  - Direct parameter passing (no wrapper type)

**Measurement metrics:**
- Mean: Average execution time
- Error: Margin of error in measurements
- StdDev: Consistency of measurements
- Median: Median execution time
- Memory Usage: Bytes allocated on the heap

## Raw Benchmark Results

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

## Struct-Based Types

The headline result from these benchmarks is how dramatically struct-based types outperform reference types at 5+ parameters. The gap is not marginal — we're talking about the difference between sub-nanosecond execution and ~4 ns, with zero heap allocation versus 32–48 bytes per call.

**`struct` and `readonly struct`** showed excellent performance across the board, particularly for small data structures. With 3–4 parameters you're looking at 0.6–0.7 ns. Jump to 5+ parameters and the JIT starts doing something clever — times drop to 0.01–0.03 ns. Adding `readonly` to a struct buys you another 5–10% on average, since the compiler can skip defensive copies when passing to methods that might otherwise mutate the value.

**`ref struct` and `readonly ref struct`** sit in roughly the same performance band as their non-ref counterparts, with the added constraint that they can't escape to the heap. If you're building something like a parser or a span-based processing pipeline, this is often exactly what you want: the compiler enforces stack-only lifetime, and you get the performance to match.

**`record struct` and `readonly record struct`** were consistently the best-performing types in the 3–4 parameter range (~0.57 ns), edging out the plain struct variants. They carry all the benefits of value semantics — zero allocation, stack storage — and layer on value-based equality and immutability for free. For most modern C# code that needs a small, immutable parameter bundle, `readonly record struct` is the answer.

## Reference Types

The story for reference types is simpler and less exciting from a performance standpoint. Every class-based variant hovered in the 3.4–4.2 ns range regardless of parameter count, and every call allocated 32–48 bytes on the heap. That allocation cost is what matters in tight loops — it's not the 4 ns per call, it's the GC pressure that accumulates.

**`class` and `sealed class`** are essentially the same story. `sealed class` is 1–3% faster, which tracks with the fact that sealing a class allows the JIT to devirtualize certain call patterns. In practice, you'd never choose `sealed` purely for this gain — but it's good to know the ceiling.

**`record` and `sealed record`** match class performance almost exactly. They bring value-based equality and a nice positional syntax, but they don't change the fundamental allocation model. If you're wrapping parameters in a `record` for convenience, you're still paying the heap cost.

## Direct Parameter Passing

There's one outlier worth talking about: passing parameters directly, with no wrapper type at all. It clocked in at 0.015–0.037 ns with zero allocation — the fastest option across the board when parameter count is low. The trade-off is ergonomics. Once you get past 4–5 parameters, a naked method signature becomes hard to read, hard to refactor, and easy to get wrong. The struct variants close the gap fast enough that grouping into a `readonly record struct` is almost always the better call.

## Practical Recommendations

The numbers above translate into a few concrete rules I now follow:

**For 3–4 parameters in a hot path**, reach for `readonly record struct`. You get ~0.57 ns execution, zero allocation, built-in equality, and a clean constructor syntax. The ergonomics are better than a plain struct and the performance is comparable.

**For 5+ parameters**, all struct variants converge at ~0.01–0.03 ns, which is essentially noise-floor territory. Pick whichever struct type fits your constraints: `readonly struct` if you need to pass by value across a wide API, `ref struct` if you want to guarantee stack-only lifetime.

**When you need inheritance or large shared objects**, class types are appropriate — just don't use them on hot paths where the allocation cost will accumulate. Object pooling or a structural redesign is usually a better answer than trying to optimize a class-based parameter pattern.

**When value equality matters but you're not on a hot path**, `record` reference types are fine. The ergonomics are excellent and the ~4 ns allocation cost is irrelevant in most application code.

## Conclusion

The gap between struct-based and reference-type parameter passing in C# is larger than most developers expect — roughly 200x in execution time and 100% in allocation overhead at 5+ parameters. That difference is usually invisible in typical application code, but it surfaces quickly in high-frequency paths: parsers, serializers, math-heavy compute loops, or any method that gets called millions of times per second.

The good news is that the modern C# type system gives you precise tools to handle this. `readonly record struct` hits the sweet spot of performance, immutability, and developer ergonomics for the majority of cases. Once you internalize when to reach for each variant, writing allocation-free hot paths stops feeling like a sacrifice and starts feeling like the natural default.

The full benchmark source is available on [.NET Fiddle](https://dotnetfiddle.net/cyCLlv).
