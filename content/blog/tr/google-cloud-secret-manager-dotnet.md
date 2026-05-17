---
title: ".NET Uygulamalarınız İçin Google Cloud Secret Manager Entegrasyonu"
description: "Prefix filtreleme, bölgeye özel yapılandırma ve JSON/ham secret desteği gibi özellikler sunan bir .NET kütüphanesi ile Google Cloud Secret Manager entegrasyonu."
date: "2025-01-30"
slug: "google-cloud-secret-manager-dotnet"
mediumUrl: "https://senrecep.medium.com/google-cloud-secret-manager-integration-for-your-net-applications-84f2576f6027"
imageUrl: "/images/dotnet-secret-manager.webp"
keywords: ["Google Cloud Secret Manager", ".NET", "CSharpEssentials", "secrets management", "IConfiguration", "GCP", "microservices", "environment configuration"]
author: "Recep Şen"
modifiedDate: "2025-01-30"
category: "Tutorial"
faq:
  - q: "Neden .NET'te ortam değişkenleri yerine Google Cloud Secret Manager kullanmalıyım?"
    a: "Google Cloud Secret Manager, birden fazla ortam ve microservice genelinde sorunsuz çalışan merkezi, denetlenebilir ve versiyonlanmış secret depolama sağlar. Ortam değişkenlerinin aksine, secret'lar döndürülebilir, IAM üzerinden erişim kontrollü olabilir ve uygulamaları yeniden deploy etmeden güncellenebilir."
  - q: "CSharpEssentials.GcpSecretManager'daki prefix tabanlı filtreleme nedir?"
    a: "Prefix filtreleme, yalnızca adı belirli bir prefix ile başlayan secret'ları yüklemenize olanak tanır; örneğin uygulama adınız gibi. Bu, paylaşılan bir GCP projesinden ilgisiz secret'ların yüklenmesini önler, başlangıç performansını artırır ve gereksiz secret erişimini azaltır."
  - q: "Kütüphane .NET'in IConfiguration sistemiyle nasıl entegre oluyor?"
    a: "Kütüphane, Google Cloud Secret Manager'dan secret'ları çeken ve bunları standart IConfiguration arayüzü üzerinden sunan özel bir IConfigurationProvider uygular. Bu sayede secret'lara, dependency injection ve options pattern'leri kullanarak tıpkı appsettings.json değerleri gibi erişebilirsiniz."
---

Her .NET geliştiricisi eninde sonunda aynı duvara çarpar: API key'ler, veritabanı bağlantı string'leri ve parolalar `appsettings.json` dosyalarına, ortam değişkenlerine ve belki de itiraf etmek istemeyeceğiniz yerlere dağılmış hâldedir. Bunun sürdürülebilir olmadığını bilirsiniz. Güvenli olmadığını bilirsiniz. Ama düzgün bir secret yönetimi çözümü kurmak, olması gerekenden her zaman daha zor gelir.

Ben bu duvara Google Cloud üzerinde çalışan bir microservice mimarisinde çarptım. Google'ın kendi Secret Manager istemci kütüphanesi tek başına gayet iyi çalışıyor, ancak .NET'in `IConfiguration` sistemiyle -- yani tüm uygulamanızın yapılandırma için zaten bağımlı olduğu şeyle -- uyumlu çalışmasını sağlamak istediğimden fazla sürtünme yaratıyordu. Özellikle bu sürtünmeyi birden fazla servis, birden fazla ortam ve birden fazla bölge ile çarptığınızda.

Bu yüzden bunu çözmek için bir kütüphane geliştirdim. CSharpEssentials.GcpSecretManager, Google Cloud Secret Manager ile .NET'in yapılandırma sistemini köprüleyerek secret'ların `appsettings.json`'dan gelen değerler gibi görünmesini sağlar. Özel erişim kalıpları yok, özel servis kayıtları yok -- sadece kodunuzun zaten kullandığı standart `IConfiguration` arayüzü.

## Kütüphane Ne Sunuyor

Kütüphane, üretimde gerçekten karşılaşılan sorunlara odaklanır. .NET'in `IConfiguration`'ı ile sorunsuz Google Cloud Secret Manager entegrasyonu, her servisin yalnızca kendi secret'larını yüklemesi için prefix tabanlı filtreleme, yüzlerce secret'ınız olduğunda performans için toplu işleme, gecikme duyarlı deploy'lar için bölgeye özel yapılandırma ve hem JSON olarak ayrıştırılmış hem de ham secret değerleri desteği sağlar.

## Başlarken

NuGet paketini yükleyin ve hazırsınız:

```bash
dotnet add package CSharpEssentials.GcpSecretManager
```

## Kullanım Senaryoları

Kütüphane, mimarinize bağlı olarak çeşitli yapılandırmaları destekler. İşte en yaygın olanları.

### Basit Uygulama

```csharp
builder.Configuration.AddGcpSecretManager();
```

```json
{
  "GoogleSecretManager": {
    "Projects": [
      {
        "ProjectId": "your-project-id"
      }
    ]
  }
}
```

Bu en hızlı yoldur. Proje ID'sini `appsettings.json`'da tanımlarsınız, `AddGcpSecretManager()` çağrısını yaparsınız ve o projedeki her secret `IConfiguration` üzerinden erişilebilir hâle gelir. Tek bir uygulamanız ve tek bir GCP projeniz varsa ve secret'larınızı herhangi bir tören olmadan merkezileştirmek istiyorsanız gayet iyi çalışır.

### Microservice Mimarisi

```json
{
  "GoogleSecretManager": {
    "Projects": [
      {
        "ProjectId": "payment-service-prod",
        "PrefixFilters": [
          "payment_"
        ],
        "Region": "europe-west1"
      },
      {
        "ProjectId": "user-service-prod",
        "PrefixFilters": [
          "user_"
        ],
        "Region": "europe-west1"
      }
    ]
  }
}
```

Bir microservice yapısında, genellikle her servis için ayrı GCP projeleri olur ve her servis yalnızca gerçekten ihtiyaç duyduğu secret'ları yüklemelidir. Prefix tabanlı filtreleme bunu temiz bir şekilde çözer: ödeme servisi yalnızca `payment_*` secret'larını yükler, kullanıcı servisi yalnızca `user_*` secret'larını yükler. Yanlışlıkla çapraz bulaşma olmaz ve yüzlerce ilgisiz secret'ı çekmediğiniz için başlangıç hızlı kalır.

### Çoklu Bölge Uygulaması

```json
{
  "GoogleSecretManager": {
    "Projects": [
      {
        "ProjectId": "my-app-prod",
        "Region": "europe-west1",
        "PrefixFilters": [
          "eu_"
        ]
      },
      {
        "ProjectId": "my-app-prod",
        "Region": "us-central1",
        "PrefixFilters": [
          "us_"
        ]
      }
    ]
  }
}
```

Uygulamanız birden fazla bölgede çalışıyorsa ve gecikme önemliyse, her deploy'u en yakın Secret Manager replikasına yönlendirebilirsiniz. Aynı proje, farklı bölgeler ve prefix filtrelerle birden fazla kez referans alınabilir; böylece AB deploy'unuz `europe-west1`'den `eu_*` secret'larını çekerken, ABD deploy'unuz `us-central1`'den `us_*` secret'larını çeker.

### Development/Staging/Production

```csharp
builder.Configuration.AddGcpSecretManager(options =>
{
    options.BatchSize = 10;
    options.PageSize = 300;
    options.AddProject(new ProjectSecretConfiguration
    {
        ProjectId = "my-app-" + environment,
        PrefixFilters = [$"{environment}_"]
    });
});
```

Bu yaklaşım yapılandırma üzerinde programatik kontrol sağlar. Proje ID'sini ve prefix'i mevcut ortama göre dinamik olarak ayarlayabilir ve `BatchSize` ile `PageSize` gibi performans parametrelerini kendi iş yükünüze göre ince ayar yapabilirsiniz. Ortam adının her şeyi yönlendirdiği CI/CD pipeline'larına doğal olarak uyum sağlar.

### JSON ve Ham Secret'lar

```json
{
  "GoogleSecretManager": {
    "Projects": [
      {
        "ProjectId": "my-app-prod",
        "SecretIds": [
          "app-config",
          "service-account",
          "ssl-cert"
        ],
        "PrefixFilters": [
          "app_",
          "creds_"
        ],
        "RawSecretIds": [
          "service-account",
          "ssl-cert"
        ],
        "RawSecretPrefixes": [
          "creds_"
        ]
      }
    ]
  }
}
```

Varsayılan olarak kütüphane, secret değerlerini JSON olarak ayrıştırıp yapılandırma anahtarlarına düzleştirmeye çalışır. Ancak her şey JSON değildir. Service account kimlik bilgileri dosyaları, SSL/TLS sertifikaları, SSH özel anahtarları ve PEM dosyaları ham metin olarak saklanır. Bunları `RawSecretIds` veya `RawSecretPrefixes` ile işaretlemek, kütüphaneye JSON ayrıştırmasını atlayıp değeri olduğu gibi saklamasını söyler.

Dikkat edilmesi gereken bir nokta: `RawSecretIds` ve `RawSecretPrefixes`'de listelenen secret'lar aynı zamanda `SecretIds` veya `PrefixFilters`'da da bulunmalıdır. Ham bayrakları bir secret'ın nasıl ayrıştırılacağını kontrol eder, yüklenip yüklenmeyeceğini değil.

## Performans İpuçları

Başlangıç sürelerini düşük tutmak için çevirebileceğiniz birkaç düğme var. Çok sayıda secret'ınız olduğunda `BatchSize`'ı artırın (20'yi deneyin), büyük projeler için `PageSize`'ı artırın (500'ü deneyin). Gereksiz bölgeler arası çağrıları önlemek için her zaman `Region` belirtin. Yalnızca ihtiyacınız olanı yüklediğinizden emin olmak için `PrefixFilters`'ı agresif kullanın. Ve bilinen belirli secret'lar için `SecretIds`, listeleme adımını tamamen atlayıp doğrudan getirmenizi sağlar.

## Güvenlik İpuçları

Güvenlik tarafında, minimum izinlere sahip service account'lar kullanın -- genellikle `secretmanager.secretAccessor` yeterlidir. Ortam başına ayrı service account'lar oluşturun ki ele geçirilmiş bir dev kimlik bilgisi production secret'larını okuyamasın. Secret isimlerinizi ortam tabanlı prefix'lerle (`prod_`, `staging_`, `dev_`) ve servis tabanlı prefix'lerle (`auth_`, `payment_`, `email_`) düzenleyin; secret sayınız arttıkça işleri yönetilebilir tutarsınız.

## Sonuç

CSharpEssentials.GcpSecretManager, .NET uygulamalarında Google Cloud Secret Manager kullanmanın sürtünmesini ortadan kaldırır. İster tek bir web uygulaması çalıştırıyor olun ister bölgeler arası düzinelerce microservice'i orkestre ediyor olun, yapılandırma seçenekleri mimarinizle birlikte ölçeklenir. Kütüphane açık kaynaklıdır ve aktif olarak bakımı yapılmaktadır -- katkılar ve hata raporları memnuniyetle karşılanır.

## Bağlantılar

- [NuGet Package](https://www.nuget.org/packages/CSharpEssentials.GcpSecretManager)
- [GitHub - GcpSecretManager](https://github.com/SenRecep/CSharpEssentials/tree/main/CSharpEssentials.GcpSecretManager)
- [CSharpEssentials Library Family](https://github.com/SenRecep/CSharpEssentials)
- [All My NuGet Packages](https://www.nuget.org/profiles/recepsen)
