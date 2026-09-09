---
title: "Fonksiyon İmzanız Yalan Söylüyor: TypeScript'te Hataları Değer Olarak Yönetmek"
description: "TypeScript'te try/catch'in neden yetersiz kaldığını, Railway Oriented Programming ile hataları değer olarak yönetmenin avantajlarını ve tsentials kütüphanesinin Result<T>, Maybe<T>, RuleEngine gibi araçlarıyla pragmatik fonksiyonel programlamayı keşfedin."
date: "2026-05-16"
slug: "your-function-signature-is-lying"
mediumUrl: ""
imageUrl: "/images/your-function-signature-is-lying.webp"
keywords: ["TypeScript error handling", "Railway Oriented Programming", "Result type", "functional programming", "tsentials", "error as value", "applicative validation", "RuleEngine", "Maybe type", "DDD TypeScript"]
author: "Recep ŞEN"
modifiedDate: "2026-05-16"
category: "TypeScript"
faq:
  - q: "TypeScript'te try/catch yerine neden Result tipi kullanmalıyım?"
    a: "try/catch ile hatalar fonksiyon imzasında görünmez, catch bloğundaki tip unknown'dır ve async rejection'lar tip sistemine yansımaz. Result<T> tipi hataları dönüş değeri olarak modelleyerek tip güvenliği sağlar, birden fazla hatayı aynı anda toplayabilir ve exception fırlatmaya göre yaklaşık 300 kat daha hızlıdır."
  - q: "Railway Oriented Programming nedir ve TypeScript'te nasıl uygulanır?"
    a: "Railway Oriented Programming, kodunuzu başarı ve hata rayları olan bir demiryolu hattı olarak modeller. Her fonksiyon bir makas gibi çalışır — başarılıysa sonraki adıma iletir, hata oluşursa hata rayına geçirir. tsentials kütüphanesi bu paradigmayı Result<T>, chain ve fromAsync API'leri ile TypeScript'e taşır."
  - q: "tsentials ile neverthrow ve Effect-TS arasındaki fark nedir?"
    a: "neverthrow basit bir Result<T, E> tipi sunar ama çoklu hata toplama yoktur. Effect-TS kapsamlı bir efekt sistemidir ama öğrenme eğrisi yüksektir. tsentials ikisinin arasında pragmatik bir denge kurar: çoklu hata toplama, yapılandırılmış hatalar, kural motoru, DDD desteği ve üç farklı API stili sunar — kategori teorisi bilgisi gerektirmeden."
  - q: "tsentials'in RuleEngine'i ne işe yarar?"
    a: "RuleEngine, iş kurallarını birleştirilebilir fonksiyonlar olarak tanımlamanızı sağlar. RuleEngine.and tüm kuralları çalıştırıp tüm hataları toplar, RuleEngine.linear ilk hatada durur, RuleEngine.or en az birinin geçmesini ister. Kurallar test edilebilir, yeniden kullanılabilir ve DDD'deki Specification Pattern'den ilham alır."
---

# Fonksiyon İmzanız Yalan Söylüyor: TypeScript'te Hataları Değer Olarak Yönetmek

Yıllardır TypeScript ile geliştirme yapıyorum. Backend servislerinden React Native mobil uygulamalara, Go mikroservislerinden Next.js frontend'lere kadar farklı teknoloji yığınlarında çalıştım. Aynı felsefeyi önce C#'ta uyguladım, sonra TypeScript'e taşıdım. Her projede, her ekipte, her kod tabanında aynı sorunla karşılaştım: hata yönetimi asla istediğim gibi çalışmıyordu.

`try/catch` blokları, `throw` ifadeleri, `Promise.reject`'ler. Bunları binlerce kez kullandım. Ama ne kadar deneyim kazanırsam kazanayım, üretim ortamında yakalanmamış bir hata mutlaka ortaya çıkıyordu. Tip sistemimiz güçlüydü, testlerimiz kapsayıcıydı, ama hata yönetimi konusunda hâlâ kör noktalarımız vardı.

Ta ki Go ve Rust ile tanışana kadar. Bu dillerde hatalar değer olarak döndürülüyor. Fonksiyon imzasında açıkça görünüyor. Derleyici, hatayı işlemediğinizde sizi uyarıyor.

O an anladım: sorun bende değildi. Sorun paradigmadaydı.

## Sorun: Fonksiyon imzalarınız size yalan söylüyor

TypeScript'te hata yönetiminin üç temel sorunu var. Bunlar birbirine bağlı ve birlikte, geliştiriciyi "hata umudu yönetimi"ne sürüklüyor.

### Birincisi: Hatalar fonksiyon imzasında görünmüyor

```typescript
function getUser(id: number): User {
  if (id === 0) throw new Error('User not found');
  return { id, name: 'Test' };
}
```

Bu imza size sadece `User` döndürdüğünü söylüyor. Ama fonksiyon aslında iki şey döndürebilir: ya bir `User`, ya da bir `Error`. İkinci durumu imzadan anlamanız imkânsız. Çağıran kod, `try/catch` kullanmadan bu fonksiyonu çağırabilir ve derleyici hiçbir uyarı vermez. Üretimde crash olana kadar sorunu fark etmezsiniz.

Java'da `throws` anahtar kelimesi var. TypeScript'te yok. Fonksiyon imzanız eksik bilgi veriyor; yalan söylüyor.

### İkincisi: `catch(error)` tipi `unknown`

```typescript
try {
  const user = getUser(0);
} catch (error) {
  // error: unknown — what arrived, where from, what type?
  console.error(error.message); // Compile error
}
```

TypeScript 4.4'ten beri `strict` modda `catch` değişkeni `unknown` tipinde. Her `catch` bloğunda `instanceof Error` kontrolü yazmak zorundasınız. Kodunuz `try/catch`'lerle dolup taşıyor ve her blokta aynı tip kontrolü tekrarlanıyor.

### Üçüncüsü: Async rejection'lar tip sistemine yansımıyor

```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

`Promise<User>` diyor. Ama `fetch` network hatası fırlatabilir. `response.json()` parse hatası verebilir. Sunucu 500 dönebilir. Bunların hiçbiri tip sisteminde görünmüyor.

### Ve dördüncüsü: Performans

Exception fırlatmak ucuz değil. Stack trace oluşturmak, call stack'i geri sarmak, `catch` bloğunu bulmak — bunların hepsinin bir maliyeti var. TypeScript'te Result tipi kullanmak, exception fırlatmaya göre **yaklaşık 300 kat daha hızlı**. Bu ihmal edilecek bir fark değil; özellikle yüksek trafikli API'lerde ve validasyon yoğun iş mantığında doğrudan etkisi var.

Bu dört sorun bir araya geldiğinde, "hata yönetimi" kavramı aslında "hata umudu yönetimi" haline geliyor. *Umarım bu fonksiyon hata fırlatmaz. Umarım bu `catch` bloğu yeterli olur. Umarım async hataları unutmamışımdır.*

swyx'in güzel ifadesiyle: "İronik bir terslik var — aslında *istisnai* olan hatalar, rutin olan ise *istisna fırlatmalarımız*."

## Çözüm yaklaşımı: Railway Oriented Programming

Bu sorunlara çözüm, fonksiyonel programlama dünyasında yıllardır bilinen bir kavramda gizli: **Railway Oriented Programming**. Scott Wlaschin'in F# for Fun and Profit sitesinde tanıttığı bu yaklaşım, basit ama güçlü bir metafora dayanıyor.

Kodunuzu bir demiryolu hattı olarak hayal edin:

```text
  ─── Success Track ─────────────────────────────────────►
       │              │              │              │
   [validate]    [transform]    [save]        [notify]
       │              │              │              │
  ─── Error Track ────────────────────────────────────────►
```

İki paralel ray var: başarı rayı ve hata rayı. Her fonksiyon bir demiryolu makası gibi çalışıyor. Girdi başarılıysa, bir sonraki adıma iletiyor. Hata oluşursa, hata rayına geçiyor. Ve kritik nokta: **hata rayına bir kez girdiniz mi, sonraki fonksiyonlar otomatik olarak atlanıyor.** Zincir kırılmıyor, kontrol akışı bozulmuyor — veri sadece hata rayında ilerliyor.

Bu modelin üç temel mekanizması var:

- **bind** (flatMap/andThen): Başarılı değeri alır, yeni bir sonuç üreten fonksiyona geçirir. Hata varsa dokunmaz.
- **map**: Başarılı değeri dönüştürür, sonucu otomatik olarak tekrar sarar. Hata varsa dokunmaz.
- **match**: Zincirin sonunda, başarı ve hata durumlarını ayrı ayrı işler. Kaçış yok — her iki durumu da ele almak zorundasınız.

### Monadic mi, Applicative mi?

Burada kritik bir ayrım var. Geleneksel monadic zincirleme (bind/chain) **ilk hatada durur**:

```text
User data → [email check ❌] → STOP
                   Result: "Email is invalid"
```

Ama bir form dolduran kullanıcı, email de yanlışsa şifre de kısaysa, **ikisini birden** bilmek ister. Bu, **applicative validation** yaklaşımını gerektirir:

```text
User data → [email check ❌] + [password check ❌] + [age check ✓]
                   Result: ["Email is invalid", "Password too short"]
```

Scott Wlaschin'in de vurguladığı gibi: "*Validasyon sıralı yapılıyor. Bu yüzden bir seferde sadece bir hata dönüyor. Tüm validasyon hatalarını bir anda döndürebilsek güzel olmaz mıydı?*"

Martin Fowler da aynı soruna farklı bir açıdan yaklaşır: "*Validasyonlarda exception fırlatmayı Notification pattern ile değiştirin.*" Yani hataları tek tek fırlatmak yerine, toplayın ve topluca bildirin.

Bu iki yaklaşım — Railway Oriented Programming ve Notification Pattern — `tsentials`'in felsefi temelini oluşturuyor.

### Peki her yerde kullanılmalı mı?

Hayır. Scott Wlaschin'in kendisi de "Against Railway-Oriented Programming" başlıklı bir makale yazmıştır. Her paradigmanın sınırları var:

- Stack trace'e ihtiyacınız varsa, exception daha bilgilendiricidir
- Tamamen geri dönülmez bir durumda (panic), exception fırlatmak doğrudur
- I/O'nun her olası hatasını Result ile modellemek aşırıya kaçabilir

ROP, **domain hataları** ve **iş mantığı validasyonu** için idealdir. Ağ bağlantısının kopması gibi altyapı hatalarına değil, "kullanıcı 18 yaşından küçük" gibi beklenen ve ele alınması gereken hatalara. tsentials bu ayrımı benimseyerek, domain katmanında tip güvenli hata yönetimi sunar, altyapı katmanına sirayet etmeye çalışmaz.

## tsentials: Pragmatik fonksiyonel programlama

`tsentials`, TypeScript için yazılmış, railway-oriented programming felsefesini pragmatik bir şekilde uygulayan bir kütüphane. Amacı net: **kategori teorisinin jargonunu öğretmeden, fonksiyonel programlamanın gücünü TypeScript geliştiricilerine sunmak.**

"Monad" demiyoruz, "pipeline" diyoruz. "Functor" demiyoruz, "map" diyoruz. "Applicative" demiyoruz, "tüm hataları topla" diyoruz. Kavramlar aynı, erişim eşiği farklı.

### Result<T>: Hataları görünür kılmak

Kütüphanenin merkezinde `Result<T>` tipi var:

```typescript
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; errors: readonly AppError[] };
```

İki durum, discriminated union ile temsil ediliyor. `ok: true` ise `value` var, `ok: false` ise `errors` var. TypeScript'in tip daraltma özelliği sayesinde, `if (result.ok)` kontrolünden sonra derleyici doğru dalı otomatik olarak anlıyor.

Burada kritik bir tasarım kararı var: **hatalar tek bir `Error` nesnesi değil, `AppError[]` dizisi olarak tutuluyor.** Yani bir fonksiyon birden fazla hatayı aynı anda döndürebilir. Bu, applicative validation'ı birinci sınıf vatandaş yapıyor.

Her `AppError` yapılandırılmış:

```typescript
interface AppError {
  readonly code: string;           // "User.Email.Invalid"
  readonly description: string;    // "Email format is invalid"
  readonly type: ErrorType;        // Validation, NotFound, Conflict, ...
  readonly metadata?: ErrorMetadata;
}
```

`code` ile programatik karar verirsiniz. `description` ile kullanıcıya mesaj gösterirsiniz. `type` ile HTTP status kodu belirlersiniz. `metadata` ile bağlam bilgisi taşırsınız. Hatalar artık opak `Error` nesneleri değil; **yapılandırılmış, kategorize edilmiş ve programlanabilir değerler.**

### Pipeline: tsentials'in asıl gücü

tsentials'in gerçek gücü, tek bir Result oluşturmakta değil, onları **zincirlemekte**. Bir gerçek dünya senaryosuna bakalım:

```typescript
const profile = await fromAsync(fetchUser(userId)) // fetchUser, Promise<Result<T>> döndürmeli
  .andThen(user => validateAge(user))
  .ensure(user => user.isActive, Err.validation('User.Inactive', 'Account is not active'))
  .map(user => user.profile)
  .tap(profile => logger.info('Profile loaded', { userId }))
  .match(
    profile => renderProfile(profile),
    errors => renderErrors(errors)
  );
```

Altı adım. Sıfır `try/catch`. Sıfır `if (error)` kontrolü. Hata fırlatma ihtimali sıfır. Herhangi bir adımda hata oluşursa, sonraki adımlar otomatik olarak atlanır ve `match`'in ikinci kolunda tüm hatalar toplu olarak işlenir.

`fetchUser` network hatası verirse? Hata rayına geçer, `validateAge` çağrılmaz.
`validateAge` başarısız olursa? `ensure` çağrılmaz.
`ensure` geçemezse? `map` çağrılmaz.

Kontrol akışı doğrusal, tahmin edilebilir ve tip güvenli.

### Üç stil, tek felsefe

Aynı kütüphanede üç farklı kullanım stili var. Çünkü ekipler farklıdır; alışkanlıklar farklıdır.

**Stil 1 — Pure fonksiyonlar** (fonksiyonel programlama sevenler için):

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

**Stil 2 — Fluent zincirleme** (OOP alışkanlığı olanlar için):

```typescript
const result = chain(Result.success(user))
  .bind(u => validateUser(u))
  .ensure(u => u.age >= 18, Err.validation('Age.Underage', 'Must be 18 or older'))
  .map(u => u.profile)
  .unwrap(); // Result<Profile> döner — ham değeri değil, zinciri bitirir
```

**Stil 3 — Async builder** (modern async/await sevenler için):

```typescript
const result = await fromAsync(fetchUser(id))
  .andThen(u => validateUser(u))
  .map(u => u.profile)
  .match(p => p, () => null);
```

Hangisi size doğal geliyorsa onu kullanırsınız. Farklı ekip üyeleri farklı stiller tercih edebilir; kütüphane buna izin verir, kısıtlamaz.

### Exception dünyasından geçiş: Result.try

Mevcut kodunuzda exception fırlatan fonksiyonlar var. Bu kaçınılmaz. `JSON.parse`, üçüncü parti kütüphaneler, legacy kod... Hepsi exception fırlatabilir. `Result.try` bu köprüyü kurar:

```typescript
const parsed = Result.try(
  () => JSON.parse(rawInput),
  e => Err.validation('Json.Invalid', 'Invalid JSON format')
);
```

Exception fırlatan dünya ile Result döndüren dünya arasında güvenli bir geçiş. Artık `JSON.parse`'ın `SyntaxError` fırlatma sorunu ortadan kalkıyor.

### Kural motoru: İş mantığını kompoze etmek

İş kuralları genellikle if/else zincirleriyle yazılır. Büyüdükçe okunaksızlaşır, test edilmesi zorlaşır, yeniden kullanılması imkânsızlaşır. tsentials'in `RuleEngine`'i bunu çözer:

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

`RuleEngine.and` tüm kuralları çalıştırır ve **tüm hataları toplar**. Kullanıcı 16 yaşında ve email'i yanlışsa, iki hatayı birden görür.

`RuleEngine.linear` ise sıralı çalışır — ilk hatada durur. Bağımlı adımlar için idealdir: önce formatı kontrol et, sonra veritabanında ara.

`RuleEngine.or` en az birinin geçmesini ister. `RuleEngine.if` koşullu dallanma sağlar.

Kurallar sadece fonksiyondur. Test edilebilir, birleştirilebilir, yeniden kullanılabilir. DDD'deki Specification Pattern'den ilham alır ama ondan farklı olarak sadece boolean değil, **yapılandırılmış hatalar** döndürür.

## Sadece hata yönetimi değil

tsentials sadece bir Result kütüphanesi değil. 19 modülden oluşan, tutarlı bir felsefe etrafında tasarlanmış bir araç seti:

### Maybe<T> — "Billion dollar mistake"'in çözümü

Tony Hoare, 2009'da null referansı icat ettiği için "*milyar dolarlık hatam*" demişti. TypeScript'te `T | undefined` çoğu durumu karşılar ama kompozisyon gücünden yoksundur. `Maybe<T>` bu boşluğu doldurur:

```typescript
const userName = pipe(
  Maybe.from(user),                              // null/undefined → None
  m => Maybe.map(m, u => u.profile),
  m => Maybe.bind(m, p => Maybe.from(p.displayName)),
  m => Maybe.getOrDefault(m, 'Anonymous')
);
```

`Result` ve `Maybe` arasında köprü fonksiyonları var. Bir `Maybe`'nin `None` olması bir hata mı, yoksa sadece yokluk mu? Bu kararı siz verirsiniz:

```typescript
maybeToResult(Maybe.from(user), Err.notFound('User.Missing', 'User not found'));
```

### These<E, A> — Kısmi başarı

`Result` ya başarıdır ya da başarısızlık. Ama gerçek dünyada üçüncü bir durum var: **kısmi başarı**. Bir CSV dosyası parse ediyorsunuz; 1000 satırdan 997'si doğru, 3'ü hatalı. Tümünü reddetmek mi, hatalıları yutmak mı? `These<E, A>` üçüncü bir yol sunar: hem sonucu hem uyarıları birlikte taşımak. Bu tip, rakip kütüphanelerin hiçbirinde yok.

### pipe ve flow — Fonksiyonel kompozisyon

```typescript
const processUser = flow(
  validateAge,
  r => Result.map(r, u => u.email),
  r => Result.ensure(r, isValidEmail, Err.validation('Email.Invalid', '...'))
);

// Artık processUser yeniden kullanılabilir bir pipeline
const result = processUser(user);
```

`pipe` bir değerden başlar, fonksiyonları sırayla uygular. `flow` bir fonksiyon üretir. fp-ts'le aynı kavram, tsentials'te yerleşik.

### NonEmptyArray<T> — İmkânsız durumları temsil edilemez kılmak

Scott Wlaschin'in ünlü prensibi: "*Making Illegal States Unrepresentable.*" Bir dizi varsa ve boş olmaması gerekiyorsa, bunu **tip sisteminde** ifade edin:

```typescript
function head<T>(as: NonEmptyArray<T>): T {  // NOT T | undefined, directly T
  return as[0];
}
```

`head` fonksiyonu asla `undefined` döndürmez çünkü tipi boş diziyi dışlar. Hata olasılığını ortadan kaldırmanın en iyi yolu, hatayı mümkün kılmamaktır.

### DDD desenleri — ORM'den bağımsız domain modeli

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

Kalıtım değil, **kompozisyon**. `createEntityBase()` domain event'leri ve audit trail'i sağlar. `createSoftDeletable()` soft delete ekler. Hangi ORM kullanırsanız kullanın — TypeORM, Prisma, Drizzle — domain modeliniz bağımsız kalır.

`DateTimeProvider` abstraction'ı zamanı test edilebilir kılar. Üretimde `SystemDateTimeProvider.utcNow()`, testlerde `createFakeDateTimeProvider(new Date('2024-06-01'))`. Zaman artık bir bağımlılık, sabit kodlanmış bir değer değil.

### HTTP ve JSON — Asla fırlatmayan API'ler

```typescript
// Never throws. Network errors, 404, 500... all become Result<T>
const user = await fetchResult.get<User>('/api/users/42');

// With the fluent builder
const users = await RequestBuilder.get('/api/users')
  .header('Authorization', `Bearer ${token}`)
  .query('page', '1')
  .send<User[]>();
```

HTTP status kodları otomatik olarak `ErrorType`'a dönüşür: 400/422 → Validation, 401 → Unauthorized, 404 → NotFound, 500+ → Unexpected. Hata fırlatma ihtimali sıfır; her sonuç bir `Result<T>`.

JSON tarafında aynı felsefe:

```typescript
const result = safeJsonParse('{"name": "Alice"}');  // Result<Json>
const user = parseAndValidate<User>(raw, isUser);    // Result<User>
```

Alexis King'in "Parse, Don't Validate" prensibinin doğrudan uygulaması. `JSON.parse` fırlatır; `safeJsonParse` fırlatmaz. `parseAndValidate` hem parse eder hem doğrular, sonucu tip güvenli olarak döndürür.

### Eq, Ord, Predicate — Pragmatik type class'lar

```typescript
const eqUser = Eq.struct({ id: Eq.number, name: Eq.string });
const byAge = Ord.contramap(Ord.number, (u: User) => u.age);
const isAdult = Predicate.from((u: User) => u.age >= 18);
const isActive = Predicate.from((u: User) => u.isActive);
const hasVerifiedEmail = Predicate.from((u: User) => u.emailVerified);
const isEligible = Predicate.all(isAdult, isActive, hasVerifiedEmail);
```

fp-ts'in kategori teorisi jargonunu almadan, aynı gücü sunar. Yapısal eşitlik, tip güvenli sıralama, birleştirilebilir boolean fonksiyonlar — hepsi yerleşik.

## Tasarım kararları

tsentials'in her modülünde tutarlı olan birkaç tasarım prensibi var:

**Immutable by default.** Sadece derleme zamanında değil, `Object.freeze` ile çalışma zamanında da. `Result.success(value)` döndürdüğü nesne doğrudan dondurulmuştur. Mutasyon mümkün değildir.

**Namespace merging.** `Result` hem bir tip hem bir değerdir:

```typescript
import { Result } from 'tsentials/result';

function getUser(id: number): Result<User> {     // Tip olarak
  return Result.success({ id, name: 'Alice' });  // Değer olarak
}
```

Tek import, çift kullanım. TypeScript'in sunduğu bu özellik, API'yi son derece temiz tutar.

**Sıfır bağımlılık, tam tree-shaking.** `package.json`'da `"sideEffects": false`. Sadece kullandığınız modüller bundle'a girer. ESM-only, Node ≥18, TypeScript ≥5.0.

**`description`, `message` değil.** `AppError`'da bilinçli olarak `.description` kullanılıyor, `.message` değil. Native `Error` sınıfıyla karışmaması için. Tutarlılık detaylardadır.

## Ne zaman hangisi?

Piyasada alternatifler var. Her birinin yeri var:

**neverthrow** tercih edin eğer: Tek ihtiyacınız basit bir `Result<T, E>` tipiyse, applicative validation gerekmiyorsa ve minimum API yüzey alanı istiyorsanız. Hafif, anlaşılır, hızlı başlangıç. Ancak son dönemde bakımsızlık sinyalleri var — PR'lar aylardır incelenmiyor.

**Effect-TS** tercih edin eğer: Fiber tabanlı eşzamanlılık, yerleşik dependency injection, retry/circuit breaker gibi dayanıklılık desenleri gerekiyorsa. Tam teşekküllü bir efekt sistemi. Öğrenme eğrisi yüksek, bundle boyutu büyük, ama karmaşık sistemlerde karşılığını verir.

**tsentials** tercih edin eğer: Çoklu hata toplama, yapılandırılmış hatalar, iş kuralı kompozisyonu, DDD desteği ve pragmatik fonksiyonel programlama istiyorsanız. Kategori teorisi bilmenize gerek yok. Üç API stili ile ekibinizdeki herkes kendi tarzında kullanabilir. Bundle minimal, öğrenme eğrisi düşük, ama derinlik mevcut.

|  | neverthrow | Effect-TS | tsentials |
| --- | --- | --- | --- |
| Çoklu hata toplama | Yok | Effect.validate ile | AppError[] ile yerleşik |
| Yapılandırılmış hata | Generic E | TaggedError | code + type + metadata |
| Kural motoru | Yok | Yok | RuleEngine (and/or/linear/if) |
| DDD desteği | Yok | Yok | Entity, Events, Audit, Soft Delete |
| HTTP client | Yok | Yok | fetchResult + RequestBuilder |
| Öğrenme eğrisi | Düşük | Yüksek | Düşük |
| Bundle boyutu | ~2KB | Büyük | Minimal |

Bu bir "biz en iyiyiz" tablosu değil. Farklar net: neverthrow odaklı ve hafiftir, Effect-TS kapsamlı ve güçlüdür, tsentials pragmatik ve dengeli bir araç setidir.

## Gerçek dünya: Kullanıcı kaydı uçtan uca

Teoriyi bırakalım. Bir kullanıcı kayıt akışını tsentials ile nasıl yazarsınız:

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
    .andThen(data => RuleEngine.evaluate(registrationRules, data)) // validasyon sonrası void döner
    .andThen(() => fetchResult.post<User>('/api/users', input))   // dış input closure'dan kullanılır
    .tap(user => logger.info('User created', { id: user.id }))
    .match(
      user => ({ success: true, user }),
      errors => ({ success: false, errors: errors.map(e => e.description) })
    );
}
```

Yaş kontrolü başarısız ve şifre zayıfsa, kullanıcı **iki hatayı birden** görür. API çağrısı başarısızsa, HTTP status kodu otomatik olarak uygun `ErrorType`'a dönüşür. Hiçbir yerde `try/catch` yok. Hiçbir fonksiyon exception fırlatmıyor. Kontrol akışı baştan sona doğrusal ve tahmin edilebilir.

## Sonuç

Hata yönetimi paradigmaları değişiyor. Go ve Rust'ın error-as-value yaklaşımı, TypeScript dünyasına da sıçradı. `try/catch`'in yerini, hataları fonksiyonun dönüş değeri olarak açıkça modellemek alıyor.

tsentials'ı oluştururken motivasyonum tam olarak buydu: *pragmatik fonksiyonel programlama*. Kategori teorisinin derinliklerine dalmadan, railway-oriented programming'in pratik faydalarını TypeScript geliştiricilerine sunmak. Aynı felsefeyi önce C#'ta uyguladım; TypeScript'e taşırken dilin güçlü yanlarını — discriminated union'lar, tip daraltma, namespace merging — sonuna kadar kullandım.

Bu kütüphane 19 modül, 1079 test ve tutarlı bir tasarım felsefesi içeriyor. Büyük çaplı kurumsal projelerden küçük açık kaynak araçlara kadar her yerde kullanılabilir.

Bir gerçeği de kabul edelim: artık kodun çoğunu geliştiriciler yazmıyor. AI ajanları yazıyor, geliştiriciler kontrol ediyor. Bu yeni paradigmada bir kütüphanenin kalitesi sadece API tasarımıyla değil, **AI tarafından ne kadar doğru kullanılabildiğiyle** de ölçülür. tsentials buna hazır: her modül için detaylı agent skill tanımları, API imzaları, kritik isimlendirme kuralları ve kullanım örnekleri yerleşik olarak dokümante edilmiş durumda. Claude Code, Cursor, Copilot — hangi AI aracını kullanırsanız kullanın, bu skill'leri besleyerek kütüphaneden tam verim alabilirsiniz. AI'ın `andThen` yerine `then` yazması, `Result.map`'i curried sanması gibi hatalar, doğru context verildiğinde ortadan kalkıyor. Kütüphane sadece insanlar için değil, ajanlar için de okunabilir.

Kurulum tek komut:

```bash
npx skills add senrecep/tsentials
```

`npm install` paketinizi kurar, `npx skills add` ise AI ajanınızın o paketi *doğru kullanmasını* sağlar.

Eğer şu an `try/catch` bloklarıyla boğuşuyorsanız, validasyon hatalarını tek tek toplamakla uğraşıyorsanız, veya fonksiyonlarınızın ne zaman hata fırlatacağını tahmin etmeye çalışıyorsanız — belki de bakış açınızı değiştirme zamanınız gelmiştir.

### Başlangıç

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
**Dokümantasyon:** [senrecep.github.io/tsentials](https://senrecep.github.io/tsentials/)

Unutmayın: fonksiyon imzanız yalan söylüyorsa, en gelişmiş test suite'iniz bile sizi koruyamaz. Hataları görünür kılın.
