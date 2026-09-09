---
title: "C# İş Kurallarını Yönetmenin Modern Yolu: Rule Engine Pattern"
description: "İş kurallarını merkezi kontrol, yüksek test edilebilirlik ve optimum performans ile yönetmeyi sağlayan modern bir C# pattern'i: Result Pattern ile birlikte Rule Engine Pattern."
date: "2025-02-04"
slug: "modern-way-manage-csharp-business-rules"
mediumUrl: "https://medium.com/@senrecep/the-modern-way-to-manage-c-business-rules-rule-engine-pattern-14bb1c72d700"
imageUrl: "/images/rule-engine.webp"
keywords: ["C# business rules", "Rule Engine Pattern", "Result Pattern", "CSharpEssentials", "domain validation", "clean architecture", "error handling", "testability"]
author: "Recep ŞEN"
modifiedDate: "2025-02-04"
category: "Tutorial"
faq:
  - q: "C#'ta Rule Engine Pattern nedir ve ne zaman kullanmalıyım?"
    a: "Rule Engine Pattern, tüm iş doğrulama mantığını kod tabanına dağılmış if/else zincirleri yerine ayrık, birleştirilebilir kural nesnelerinde merkezileştirir. Finans, e-ticaret veya sağlık gibi çok sayıda iş kuralının bulunduğu, kuralların sık değiştiği ve test edilebilirliğin kritik olduğu alanlar için idealdir."
  - q: "Result Pattern, exception'lara kıyasla hata yönetimini nasıl iyileştirir?"
    a: "Result Pattern, beklenen iş hataları için exception fırlatmak yerine başarı veya başarısızlığı birinci sınıf bir değer olarak döndürür. Bu sayede exception unwinding'in performans maliyeti ortadan kalkar, hata yolları tip sisteminde açıkça görünür hale gelir ve uygulama genelinde tutarlı, öngörülebilir hata mesajları üretilir."
  - q: "CSharpEssentials Rule Engine hangi kural türlerini destekler?"
    a: "Kütüphane; sıralı lineer kuralları (chain of responsibility), mantıksal AND/OR birleştiricileri ve tüm kural türleri için async varyantları destekler. Kurallar class, record, struct veya readonly record struct olarak tanımlanabilir, bu da performans ve değişmezlik gereksinimlerinize tam uyum sağlar."
---

Uzun süredir C# ile iş uygulamaları geliştiriyorum. Finans, e-ticaret, sağlık — her alan kendi kurallarıyla birlikte geliyor. "Kullanıcı 18 yaşından büyük olmalı." "Sipariş toplamı minimum eşiği aşmalı." "Kredi başvurusunda bulunan kişi kara listede olmamalı." Bu kurallar basit başlıyor. Birkaç `if` ifadesi burada, bir doğrulama metodu şurada. Ama asla basit kalmıyorlar.

Bu sorunla ilk kez büyük ölçekte karşılaştığımda, düzinelerce servise dağılmış yüzlerce iş kuralının bulunduğu bir projede çalışıyordum. Aynı doğrulama mantığı üç farklı yerde tekrarlanmıştı ve her birinde biraz farklı hata mesajları vardı. Bir servis kullanıcının yaşını `>=18` ile kontrol ederken, diğeri `>17` kullanıyordu. Bir yerdeki hata düzeltiliyordu ama başka bir servisteki kopyası sessizce hata vermeye devam ediyordu. Test yazmak bir kabustu çünkü kurallar, altı seviye iç içe geçmiş kalın metot gövdelerinin içine gömülmüştü.

Bu deneyim beni daha iyi bir yol aramaya itti. Vardığım nokta **Rule Engine Pattern** oldu — iş kurallarını dağınık koşullar yerine birinci sınıf, birleştirilebilir nesneler olarak ele alan bir pattern. **Result Pattern** ile birleştirildiğinde, C#'ta domain doğrulamasına bakış açımı tamamen dönüştürdü.

## Geleneksel yaklaşımların sorunu

Karşılaştığım sorunlar bana özgü değildi. Belirli bir büyüklüğü aşan çoğu C# kod tabanı aynı belirtileri geliştiriyor.

Teknik tarafta, doğrulama kodu dağılıyor ve tekrarlanıyor. Kurallar izole edilmesi zor iş mantığıyla iç içe geçtiği için test kapsamı düşüyor. Hata yönetimi tutarsızlaşıyor — bir metot `ArgumentException` fırlatırken, bir diğeri boolean döndürüyor, üçüncüsü log yazıp sessizce devam ediyor. Exception tabanlı kontrol akışı birikerek performans düşüşüne neden oluyor.

İş süreci tarafında ise belirli bir varlığı yöneten tüm kuralları tek bir yerden görebileceğiniz bir nokta yok. Düzenlemeler değiştiğinde, güncellenmesi gereken her noktayı bulabilmek umuduyla kod tabanında grep yapıyorsunuz. Kural bağımlılıkları örtük ve kırılgan hale geliyor. Yeni ekip üyeleri geri dönüp başvuracak bir dokümantasyon bulamıyor çünkü kurallar ancak tam bağlam ile anlam kazanan zorunlu kodun içine gömülmüş durumda.

Rule Engine Pattern, her kurala tutarlı bir arayüze sahip, ayrılmış ve test edilebilir bir birim vererek tüm bu sorunları çözüyor. Kurallar merkezileşiyor, modüler hale geliyor ve bağımsız olarak doğrulanabilir oluyor. Result Pattern ise exception tabanlı hata yönetimini açık, tip güvenli dönüş değerleriyle değiştiriyor — performans cezası yok, görünmez hata modları yok, tutarsız mesajlar yok.

## Rule Engine Pattern'in temel bileşenleri

### Result Pattern

Rule Engine'in kalbinde Result Pattern yer alıyor. Beklenen iş hataları için exception fırlatmak yerine, her kural değerlendirmesi bir `Result` döndürüyor — ya başarı ya da yapılandırılmış hata detaylarıyla birlikte başarısızlık. Bunun üç nedenden dolayı önemli: exception unwinding'in performans maliyetini ortadan kaldırıyorsunuz, hata yollarını açık ve öngörülebilir hale getiriyorsunuz ve tüm uygulama genelinde tutarlı hata mesajları elde ediyorsunuz.

### Kural türleri ve tanımlama yaklaşımları

Rule Engine hem nesne yönelimli hem de fonksiyonel programlama yaklaşımlarını destekliyor. Kuralları şu yapılardan herhangi birini kullanarak tanımlayabilirsiniz:

```csharp
public sealed class UserRule : IRule<User> { }
public sealed record UserRule : IRule<User> { }
public struct UserRule : IRule<User> { }
public readonly record struct UserRule : IRule<User> { }
```

Çoğu durum için `readonly record struct` kullanmanızı kesinlikle öneriyorum. Değer tipi olduğu için heap allocation yok. Değişmezlik sayesinde doğası gereği thread-safe. Record söz dizimi implementasyonu kısa tutuyor. `readonly` modifier'ı derleyiciye ek optimizasyon imkânı tanıyor. Ve bellek ayak izi minimum düzeyde. Benchmark'larımda değer tipi kurallar ile class tabanlı kurallar arasındaki fark önemli ölçüdeydi — parametre geçiş performans analizimde belgelediğim aynı pattern.

### Kural arayüzleri

Rule Engine, farklı doğrulama senaryoları için özelleşmiş arayüzler sunuyor ve doğru olanı seçmek önemli.

**Basit kurallar** tek bir doğrulama gerçekleştirir. Yapı taşlarıdır — bir kural, bir kontrol, bir sonuç:

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

**Lineer kurallar** her kuralın bir sonrakine işaret ettiği bir zincir oluşturur. Değerlendirme ilk başarısızlıkta durur. Bu, doğrulamaya uygulanan chain-of-responsibility pattern'idir — sonraki kuralların öncekilerinin geçmesine bağlı olduğu durumlar için kullanışlıdır:

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

**Mantıksal kurallar** birden fazla kuralı AND/OR semantiğiyle birleştirir. AND kuralları hepsinin geçmesini gerektirir; OR kuralları en az birinin geçmesini gerektirir. Birleştirme gücünün gerçekten parladığı yer burasıdır — basit, test edilebilir parçalardan karmaşık doğrulama ağaçları oluşturabilirsiniz:

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

**Koşullu kurallar** bir değerlendirmenin sonucuna göre dallanır. Koşul geçerse bir kural çalışır; geçmezse başka bir kural çalışır. Bunu kural birleştirme seviyesinde bir if/else olarak düşünebilirsiniz:

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

## Uygulama örnekleri

Teori faydalıdır ama asıl önemli olan gerçek dünya örnekleridir. İşte üretim sistemlerinde gerçekten uyguladığım iki senaryo.

### E-Ticaret: Sipariş doğrulama

Bir siparişin işlenmeden önce birkaç kontrolden geçmesi gerekir. Stok mevcut olmalı, ödeme yöntemi geçerli olmalı, kargo adresi eksiksiz olmalı ve sipariş tutarı minimum değeri aşmalı. AND kurallarıyla bunların hepsi çalışır ve tüm başarısızlıklar birlikte raporlanır:

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

### Finans: Kredi başvurusu

Bir kredi başvurusunun doğal bir sırası vardır: önce kara listeyi kontrol et, sonra yaşı doğrula, ardından geliri kontrol et, son olarak kredi skorunu değerlendir. Lineer kurallar bunu zarif bir şekilde ele alır ve ilk başarısızlıkta durur çünkü kara listede olan birinin kredi skorunu kontrol etmenin bir anlamı yoktur:

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

## En iyi uygulamalar

Zamanla, sürekli olarak daha temiz ve bakımı kolay rule engine'lere yol açan bir dizi uygulama benimsedim.

**Tek sorumluluk.** Her kural tam olarak bir şeyi kontrol etmeli. Bir kural iki kontrol yapmaya başladığında, ayırın. Pattern'in birleştirilebilirlik özelliği bunu ucuz hale getiriyor.

**Merkezi hata yönetimi.** Hata nesnelerini kural metotlarının içinde oluşturmayın. Hata kodlarının ve mesajlarının tüm kod tabanında tutarlı kalması için bunları merkezi bir konumda tanımlayın:

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

Bu yaklaşım hata kodlarını ve mesajlarını merkezileştirir, tekrarı önler, mesajları tutarlı tutar, bakımı kolaylaştırır ve proje genelinde IntelliSense desteği sağlar.

**Açıklayıcı hata kodları.** Hata kodlarını alan ve işleme göre gruplandırın — `USER.*`, `PAYMENT.*`, `ORDER.*`. `NOT_FOUND`, `INVALID_FORMAT`, `INSUFFICIENT_FUNDS` gibi anlamlı isimler kullanın. Tüm sistem genelinde tutarlı bir isimlendirme kuralına bağlı kalın.

**Zengin metadata.** Sadece "yetersiz gelir" demeyin. Metadata'ya gereken minimum tutarı ve gerçek tutarı ekleyin. Bu, hata ayıklamayı, log'lamayı ve istemci tarafında hata gösterimini çok daha kolay hale getirir.

**Test edilebilirlik.** Her kural tasarım gereği bağımsız olarak test edilebilir. Başarı, başarısızlık ve sınır koşulları için ayrı test senaryoları yazın. Metadata değerlerini assert etmeyi unutmayın — bunlar sözleşmenin bir parçası.

**Performans.** Heap allocation'ı en aza indirmek için `record struct` kullanın. Nesne oluşturmayı azaltmak için statik hata tanımları kullanın. Hata mesajlarında string birleştirmeden kaçının — bunun yerine önceden oluşturulmuş hata nesneleri kullanın.

**Kural tanımları.** Özel bir nedeniniz yoksa `readonly record struct` tercih edin. Kural durumunu değişmez olarak tasarlayın. Bağımlılıkları constructor injection ile yönetin. Her kuralı küçük ve odaklanmış tutun.

## Fonksiyonel stil kullanımı

Rule Engine ayrıca ayrı kural sınıfları tanımlamak istemediğiniz durumlar için fonksiyonel bir API de destekliyor. Bu özellikle anlık doğrulamalar veya kuralların tam bir sınıfın gereksiz olacağı kadar basit olduğu durumlar için kullanışlıdır.

**AND kuralları** — hepsinin geçmesi gerekir:

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

**OR kuralları** — en az birinin geçmesi gerekir:

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

**Lineer kurallar** — ilk başarısızlıkta duran sıralı doğrulama:

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

**Koşullu kurallar** — değerlendirmeye göre dallanma:

```csharp
Result result = RuleEngine.If(
    rule: input => input > 0,
    success: input => input < 100,
    failure: input => input % 2 == 0,
    context: 120);
```

## Kural türleri ve fonksiyon imzaları

Referans olarak, Rule Engine'in sağladığı tam tip sistemi aşağıda verilmiştir.

**OOP Kural Türleri**

Basit kurallar:

```csharp
IRule<TContext>
IRule<TContext, TResult>
IAsyncRule<TContext>
IAsyncRule<TContext, TResult>
```

Lineer kurallar:

```csharp
ILinearRule<TContext>
ILinearRule<TContext, TResult>
ILinearAsyncRule<TContext>
ILinearAsyncRule<TContext, TResult>
```

OR kuralları:

```csharp
IOrRule<TContext>
IOrRule<TContext, TResult>
IOrAsyncRule<TContext>
IOrAsyncRule<TContext, TResult>
```

AND kuralları:

```csharp
IAndRule<TContext>
IAndRule<TContext, TResult>
IAndAsyncRule<TContext>
IAndAsyncRule<TContext, TResult>
```

Koşullu kurallar:

```csharp
IConditionalRule<TContext>
IConditionalRule<TContext, TResult>
IConditionalAsyncRule<TContext>
IConditionalAsyncRule<TContext, TResult>
```

**Fonksiyonel Yaklaşım İmzaları**

Basit fonksiyon imzaları:

```csharp
Func<TContext, Result>
Func<TContext, CancellationToken, Result>
Func<TContext, CancellationToken, ValueTask<Result>>
```

Generic sonuç döndüren fonksiyonlar:

```csharp
Func<TContext, Result<TResult>>
Func<TContext, CancellationToken, Result<TResult>>
Func<TContext, CancellationToken, ValueTask<Result<TResult>>>
```

Bu zengin tip sistemi, her senaryo için uygun kural türünü seçmenize, senkron ve asenkron işlemleri serbestçe karıştırmanıza, generic sonuçlarla tip güvenliğini artırmanıza, cancellation token desteğiyle kaynakları düzgün yönetmenize ve aynı kod tabanında fonksiyonel ve OOP yaklaşımlarını birlikte kullanmanıza olanak tanır.

## Sonuç

Rule Engine Pattern, C#'ta iş doğrulamasına yaklaşım biçimimi değiştirdi. Servis metotlarının içine gömülmüş dağınık `if` zincirleri, birleştirilebilir, test edilebilir ve kendini belgeleyen kural nesnelerine dönüştü. Result Pattern, hata yönetimindeki belirsizliği ortadan kaldırdı — artık bir metodun exception fırlatıp fırlatmadığını, null döndürüp döndürmediğini veya sessizce log yazıp yazamadığını merak etmek yok.

Eğer kod tabanınızda iş kuralları birden fazla katmana yayılmışsa, doğrulama hata mesajlarınız tutarsızsa, domain mantığınızı test etmek tüm uygulama bağlamını kurmayı gerektiriyorsa — bu pattern'i benimsemeye değer. Tek bir domain varlığıyla başlayın, kurallarını birleştirilebilir nesnelere çıkarın ve nasıl hissettirdiğini görün. Deneyimlerime göre, pattern yerleştikten sonra yeni kurallar eklemek için en doğal yol haline geliyor.

Proje açık kaynak. Kaynak kodunu inceleyebilir, fork'layabilir ve katkıda bulunabilirsiniz.

- [NuGet Package](https://www.nuget.org/packages/CSharpEssentials)
- [GitHub Repository](https://github.com/SenRecep/CSharpEssentials)
- [All My NuGet Packages](https://www.nuget.org/profiles/recepsen)
