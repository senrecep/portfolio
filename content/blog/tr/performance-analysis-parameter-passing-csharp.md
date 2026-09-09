---
title: "C#'ta Parametre Geçirme Yöntemlerinin Performans Analizi"
description: "C# parametre geçirme yöntemlerinin derinlemesine analizi: struct, class, record ve ref türleri benchmark'larla karşılaştırılıyor. Optimizasyon için en iyi pratikler."
date: "2025-02-20"
slug: "performance-analysis-parameter-passing-csharp"
mediumUrl: "https://senrecep.medium.com/performance-analysis-of-parameter-passing-methods-in-c-ceeffcefd624"
imageUrl: "/images/parameters.webp"
keywords: ["C# performance", "parameter passing", "struct vs class", "BenchmarkDotNet", "ref struct", "readonly struct", "memory allocation", "C# optimization"]
author: "Recep ŞEN"
modifiedDate: "2025-02-20"
category: "Technology"
faq:
  - q: "Yüksek performanslı senaryolarda C# parametre geçirme için hangi tür en hızlıdır?"
    a: "660 test senaryosuna dayanan BenchmarkDotNet ölçümlerine göre, readonly record struct ve ref struct türleri class ve record referans türlerini tutarlı biçimde geride bırakıyor. Value type'lar heap allocation'ı tamamen ortadan kaldırdığından GC baskısı oluşmuyor ve yoğun çağrı yapılan yollarda ortalama yürütme süresi belirgin şekilde düşüyor."
  - q: "C#'ta metod parametreleri için struct mı, class mı kullanmalıyım?"
    a: "Veri küçükse (genellikle 16 byte'ın altında), değişmezse ve performans kritik kodda sık sık geçiriliyorsa struct türlerini (özellikle readonly struct veya readonly record struct) tercih edin. Nesne büyükse, paylaşımlıysa veya değiştiriliyorsa class ya da record referans türleri daha uygun; büyük bir struct'ı kopyalamak referans geçirmekten daha pahalıya gelebilir."
  - q: "BenchmarkDotNet, C# parametre geçirme performansını nasıl ölçüyor?"
    a: "BenchmarkDotNet her test senaryosunu birden fazla kez çalıştırır (bu çalışmada senaryolu başına ortalama 11 iterasyon) ve ortalama yürütme süresi, standart sapma, medyan ve heap allocation'ı (Gen0 collection sayısı ve ayrılan byte miktarı) raporlar. Bu istatistiksel yaklaşım gürültüyü filtreler ve farklı tür kombinasyonları arasında güvenilir performans karşılaştırmaları sunar."
---

Bir süre önce saniyede yüz binlerce istek işleyen yüksek verimli bir servisi profillıyordum. CPU profilleri makul görünüyordu, bellek tahsisleri de gayet iyiydi — ta ki sıcak yoldaki birkaç metodun sürekli Gen0 garbage collection tetiklediğini fark edene kadar. Sorunun kaynağı, üzerine hiç düşünmediğim bir şeydi: parametreleri nasıl geçirdiğim.

O deneyim beni derin bir araştırmaya sürükledi. Sezgiye ya da Stack Overflow cevaplarına değil, gerçek sayılara ihtiyacım vardı; C#'ın tüm önemli türleri için nanosaniye düzeyinde ölçülmüş verilere. Bu yüzden BenchmarkDotNet ile bir test altyapısı kurdum, 660 test senaryosu çalıştırdım ve bulduklarımı burada derliyorum.

## Test Kurulumu

Sonuçlara geçmeden önce neyi ve nasıl ölçtüğümü açıklayayım.

**Teknik özellikler:**
- Test Framework: BenchmarkDotNet
- Test Senaryoları: 3 ile 8 arasında parametre sayısı
- Toplam Test Sayısı: 660 (60 senaryo x ortalama 11 iterasyon)
- Test Edilen Türler:
  - Struct tabanlı: `struct`, `readonly struct`, `ref struct`, `readonly ref struct`, `record struct`, `readonly record struct`
  - Referans tabanlı: `class`, `sealed class`, `record`, `sealed record`
  - Doğrudan parametre geçirme (sarmalayıcı tür kullanılmadan)

**Ölçüm metrikleri:**
- Mean: Ortalama yürütme süresi
- Error: Ölçümlerdeki hata payı
- StdDev: Ölçümlerin tutarlılığı
- Median: Medyan yürütme süresi
- Memory Usage: Heap'te ayrılan byte miktarı

## Ham Benchmark Sonuçları

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

## Struct Tabanlı Türler

Bu benchmark'ların öne çıkan sonucu, 5 ve üzeri parametre sayısında struct tabanlı türlerin referans türlerini ne denli dramatik biçimde geride bırakması. Aradaki fark küçük bir marj değil; nanosaniyenin altında yürütme süresi ile ~4 ns arasındaki uçurum ve her çağrıda sıfır heap allocation yerine 32–48 byte tahsis edilmesi.

**`struct` ve `readonly struct`**, tüm senaryolarda, özellikle küçük veri yapıları için mükemmel performans sergiledi. 3–4 parametrede 0,6–0,7 ns civarındasınız. 5 ve üzerine çıkıldığında JIT bir şeyler öğrenmiş gibi davranıyor; süreler 0,01–0,03 ns'ye düşüyor. Bir struct'a `readonly` eklemek ortalamada yüzde 5–10'luk ek kazanım sağlıyor; çünkü derleyici, değeri potansiyel olarak mutasyona uğratabilecek metodlara geçirildiğinde savunma amaçlı kopyalamayı atlayabiliyor.

**`ref struct` ve `readonly ref struct`**, ref olmayan kardeşleriyle yaklaşık aynı performans bandında seyrediyor; üstelik heap'e kaçamama kısıtlamasını da beraberinde getiriyor. Parser ya da span tabanlı bir işlem hattı geliştiriyorsanız çoğu zaman tam olarak aradığınız şey bu: derleyici stack-only ömrü zorluyor ve buna uygun performans elde ediyorsunuz.

**`record struct` ve `readonly record struct`**, 3–4 parametre aralığında (~0,57 ns) tutarlı biçimde en iyi performansı gösteren türler oldu; düz struct varyantlarını bile geride bıraktılar. Value semantics'in tüm avantajlarını taşıyorlar — sıfır allocation, stack depolama — ve üstüne değer tabanlı eşitlik ile değişmezliği bedava sunuyorlar. Küçük, değişmez bir parametre paketi gereken modern C# kodunun büyük bölümü için `readonly record struct` doğru yanıt.

## Referans Türler

Referans türlerin hikayesi performans açısından daha sade ve daha az heyecan verici. Her class tabanlı varyant, parametre sayısından bağımsız olarak 3,4–4,2 ns bandında gezindi ve her çağrı heap'te 32–48 byte tahsis etti. Sıkı döngülerde önemli olan bu allocation maliyeti; çağrı başına 4 ns değil, biriken GC baskısı.

**`class` ve `sealed class`** özünde aynı hikayeyi anlatıyor. `sealed class` yüzde 1–3 daha hızlı; bu, bir class'ı sealed yapmak JIT'in belirli çağrı desenlerini devirtualize etmesine olanak tanıdığından beklenen bir sonuç. Pratikte yalnızca bu kazanım için `sealed` tercih etmezsiniz — ama tavanı bilmek faydalı.

**`record` ve `sealed record`**, class performansıyla neredeyse birebir örtüşüyor. Değer tabanlı eşitlik ve güzel bir positional syntax getiriyorlar, ancak temel allocation modelini değiştirmiyorlar. Parametreleri kolaylık için bir `record`'a sararsanız heap maliyetini ödemeye devam edersiniz.

## Doğrudan Parametre Geçirme

Üzerinde durmaya değer bir istisna var: sarmalayıcı tür kullanmadan parametreleri doğrudan geçirmek. Düşük parametre sayısında sıfır allocation ile 0,015–0,037 ns'ye ulaştı; genel olarak en hızlı seçenek. Bedeli ergonomi. 4–5 parametrenin ötesine geçince çıplak bir metod imzası okumayı zorlaştırıyor, yeniden düzenlemeyi güçleştiriyor ve hata yapmayı kolaylaştırıyor. Struct varyantları aradaki farkı o kadar hızlı kapatıyor ki `readonly record struct` içinde gruplandırmak neredeyse her zaman daha iyi bir tercih.

## Pratik Öneriler

Yukarıdaki sayılar, artık benim de uyguladığım birkaç somut kurala dönüşüyor:

**Sıcak yolda 3–4 parametre için** `readonly record struct`'a uzanın. ~0,57 ns yürütme süresi, sıfır allocation, yerleşik eşitlik ve temiz bir constructor syntax elde edersiniz. Ergonomi düz struct'tan daha iyi, performans ise karşılaştırılabilir düzeyde.

**5 ve üzeri parametre için** tüm struct varyantları ~0,01–0,03 ns'de birleşiyor; bu artık ölçüm tabanı gürültüsü sayılabilecek bir aralık. Kısıtlamalarınıza uyan struct türünü seçin: geniş bir API'de değer olarak geçirmeniz gerekiyorsa `readonly struct`, stack-only ömrü garantilemek istiyorsanız `ref struct`.

**Kalıtıma ya da büyük paylaşımlı nesnelere ihtiyaç duyduğunuzda** class türleri uygundur; yalnızca allocation maliyetinin biriktiği sıcak yollarda kullanmaktan kaçının. Object pooling ya da yapısal bir yeniden tasarım, class tabanlı bir parametre desenini optimize etmeye çalışmaktan genellikle daha iyi bir yanıttır.

**Değer eşitliği önemli ama sıcak yolda değilseniz**, `record` referans türleri gayet iyi çalışır. Ergonomi mükemmel, ~4 ns allocation maliyeti ise çoğu uygulama kodunda önemsiz kalır.

## Sonuç

C#'ta struct tabanlı ve referans türü parametre geçirme arasındaki uçurum, çoğu geliştiricinin beklediğinden çok daha büyük; 5 ve üzeri parametrede yürütme süresinde yaklaşık 200 kat, allocation yükünde ise yüzde 100'lük bir fark var. Bu fark tipik uygulama kodunda çoğunlukla görünmez, ama yüksek frekanslı yollarda çabucak yüzeye çıkıyor: parser'lar, serializer'lar, hesaplama yoğun döngüler ya da saniyede milyonlarca kez çağrılan her metod.

İyi haber şu ki modern C# tür sistemi bunu yönetmek için tam anlamıyla hassas araçlar sunuyor. `readonly record struct`, vakaların büyük çoğunluğunda performans, değişmezlik ve geliştirici ergonomisinin buluşma noktası. Her varyanta ne zaman uzanacağınızı içselleştirdiğinizde, allocation-free sıcak yollar yazmak bir fedakarlık gibi değil, doğal varsayılan gibi hissettirecek.

Benchmark kaynak kodunun tamamına [.NET Fiddle](https://dotnetfiddle.net/cyCLlv) üzerinden ulaşabilirsiniz.
