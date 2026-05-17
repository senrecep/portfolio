---
title: "Claude Code ile Production-Seviyesi AI Geliştirme: Kapsamlı Ekosistem Rehberi"
description: "Claude Code'u basit bir soru-cevap aracından; plugin'ler, özel agent'lar, skill'ler, MCP server'lar ve hook'larla profesyonel geliştirme ortamına dönüştürün."
date: "2026-01-21"
slug: "production-grade-ai-development-claude-code"
mediumUrl: "https://medium.com/@senrecep/production-grade-ai-development-with-claude-code-a-comprehensive-ecosystem-guide-56d7c4a3b744"
imageUrl: "/images/production-grade-ai-development-with-claude-code.webp"
keywords: ["Claude Code", "AI geliştirme", "plugin'ler", "MCP server'lar", "özel agent'lar", "hook'lar", "oh-my-claudecode", "production AI"]
author: "Recep Şen"
modifiedDate: "2026-01-21"
category: "AI"
faq:
  - q: "Claude Code plugin'leri nedir ve işlevselliği nasıl genişletir?"
    a: "Claude Code plugin'leri, kurulumunuza yeni agent'lar, skill'ler, hook'lar ve MCP server entegrasyonları ekleyen npm paketleridir. Global olarak kurulurlar ve oturum başlangıcında otomatik yüklenir; siz kod yazmadan güvenlik denetimi, tarayıcı otomasyonu veya çok-agent orkestrasyonu gibi yeniden kullanılabilir yetenekler kazandırır."
  - q: "oh-my-claudecode nedir ve neden kullanmalıyım?"
    a: "oh-my-claudecode (OMC), Claude Code'a uzman agent'lar (executor, planner, architect, reviewer), ekip iş akışları, görev takibi ve skill yönetimi ekleyen çok-agent orkestrasyon plugin'idir. Claude Code'u tek başına çalışan bir asistandan, iş yükünü paralel olarak dağıtabilen ve oturumlar arasında durumu koruyabilen koordineli bir AI takımına dönüştürür."
  - q: "Hook'lar Claude Code geliştirmeyi nasıl daha güvenilir kılar?"
    a: "Hook'lar, belirli yaşam döngüsü noktalarında (araç kullanımından önce/sonra, oturum başlangıcında, prompt gönderildiğinde) deterministik shell komutları çalıştırır. Düzenleme sonrası kodu otomatik lint eden, secret tarayan, mimari kuralları uygulayan veya testleri koşturan bir güvenlik ağı gibi davranır; AI'ın bu adımları hatırlamasına güvenmeden tutarlı kalite sağlar."
---

Claude Code ekosistemi: Plugin'ler, Skills, Hooks, MCP ve Prompt'larla güçlendirilmiş bir geliştirme ortamı

## **Giriş: "Soru Sormak" Yetmez**

Anthropic'in terminal tabanlı AI asistanı Claude Code, yazılım geliştirme dünyasını dönüştürüyor. Oysa çoğu geliştirici Claude Code'u basit bir soru-cevap aracı olarak kullanıyor; gerçek potansiyelinin yüzeyini bile kazımıyor.

Bu makalede, Claude Code'u iki production projesinde — bir .NET mikroservis ekosistemi ve NX monorepo tabanlı React Native mobil uygulaması — nasıl profesyonel seviye bir geliştirme ortamına dönüştürdüğümü paylaşacağım.

### **Claude Code'u güçlendiren araçlar:**

-   **Plugin'ler** — LSP desteğinden tarayıcı otomasyonuna
-   **Custom Agents** — Proje ve alana özgü AI asistanlar
-   **Skill'ler** — Yeniden kullanılabilir bilgi ve iş akışları
-   **MCP Server'lar** — Harici araç ve servis entegrasyonları
-   **Hook'lar** — Otomasyon ve sürekli öğrenme mekanizmaları
-   **Topluluk Kaynakları** — Şablonlar için [aitmpl.com](https://www.aitmpl.com/), skill'ler için [skills.sh](https://skills.sh/)

### **Bu makalede öğrenecekleriniz:**

-   Stratejik CLAUDE.md yapılandırması (Az Çoktur ilkesi)
-   Context window yönetiminin kritik önemi (%20–40 kuralı)
-   Harici bellek sistemleri (SCRATCHPAD, OpenContext)
-   Plugin ekosisteminin kategorilere göre kullanımı
-   Custom agent tasarım stratejileri
-   MCP server'larla harici araç entegrasyonu
-   Hook'larla otomasyon ve sürekli öğrenme
-   Test ve doğrulama için tarayıcı otomasyonu
-   Speckit ile yapılandırılmış özellik geliştirme
-   Ekip onboarding ve bilgi paylaşımı stratejileri

**Okumak yerine doğrudan kuruluma geçmek isteyenler için:** Bu gist'i Claude Code ile paylaşın:

```text
Read this gist and set up my project: https://gist.github.com/senrecep/98d3583717581a4138bac62344261f6f
```

Claude, projenize göre her şeyi otomatik yapılandıracak. Her parçanın _neden_ önemli olduğunu anlamak istediğinizde bu makaleye geri dönebilirsiniz.

## Bölüm 1: CLAUDE.md — Projenizin Stratejik Beyni

### CLAUDE.md'nin Rolü

`CLAUDE.md`, Claude Code'un her konuşma başlangıcında okuduğu proje talimatları dosyasıdır. Claude her oturumda sıfırdan başlar; bu dosya onun projenizi "tanımasına" yardımcı olur — mimari kararları, kod stilini ve kaçınılması gereken yaygın hataları anlamasını sağlar.

### Yaygın Hatalar ve Çözümler

**Hata #1: Her Şeyi Yazmak**
İlk yaklaşımım 160+ satırlık devasa bir CLAUDE.md dosyasıydı. Sonuç? Claude önemli bilgileri sürekli kaçırıyordu.

```text
Bu neden yanlış:├── Her oturumda gereksiz token tüketimi├── Uzun dosya = dağılmış dikkat└── Kritik kurallar gürültüde kayboluyor
```

**Hata #2: Linter Gibi Kullanmak**

```text
# YANLIŞ YAKLAŞIM- Satır sonlarında noktalı virgül kullan- Tab yerine 2 boşluk kullan- Değişken adları camelCase olmalı
```

ESLint, Biome ve Prettier zaten bunları halleder. Claude'u linter olarak kullanmak yalnızca context'i gereksiz yere doldurur.

**Doğru Yaklaşım: WHAT / WHY / HOW + Progressive Disclosure**
Etkili bir CLAUDE.md yapısı için progressive disclosure kullanıyorum:

```text
CLAUDE.md (70-100 satır)            → Her zaman okunur
├── docs/claude/architecture.md     → Gerektiğinde başvurulur
├── docs/claude/patterns.md         → Gerektiğinde başvurulur
├── .specify/memory/constitution.md → Pazarlık kabul etmez kurallar
└── SCRATCHPAD.md                   → Oturumlar arası bellek
```

**Backend CLAUDE.md Örneği (Clean Architecture + CQRS)**

```text
# CLAUDE.md
> **Bu projeye yeni misiniz?** `./scripts/setup-claude.sh` komutunu çalıştırın
## WHAT - Projeye Genel Bakış.NET 9.0 mikroservis ekosistemi. Clean Architecture + CQRS.
### Katman Yapısı (her servis için)
Core/Domain/       → Entities, Enums (EF bağımlılığı YOK - domain saf kalır)
Core/Application/  → CQRS handler'lar, DTO'lar (iş mantığı burada yaşar)
Infrastructure/    → EF Core, Repo'lar (Application arayüzlerini uygular)
Presentation/      → WebApi (ince katman, Application'a devreder)
## WHY - Mimari Kararlar
- **CQRS Ayrımı**: Okuma/yazma işlemlerini karıştırdığımızda performans sorunları yaşadık, bu yüzden ayırdık
- **Katman İzolasyonu**: Domain'in altyapı bağımlılığı olmaması gerekiyor; EF tracking'in iş mantığına sızmasından kaynaklanan bug'lar yaşadık
- **Katman Başına DI**: Her katmanın ServiceRegistration.cs'i var çünkü dağınık kayıtlar eksik bağımlılık bug'larına yol açıyordu
## HOW - Kod Stili (NEDEN ile birlikte)
- Özel alanlar için `_camelCase` → parametrelerden ayırt eder
- Public sınıflarda `sealed` → istemeden kalıtımı engeller, daha iyi performans
- Açık tipler (var'dan kaçın) → yanlış tip çıkarımından kaynaklanan bug'larımız oldu
## Yapılmaması Gerekenler (Claude Eğilimleri)
- **Aşırı mühendislik yapma**: İstemediğim ekstra soyutlamalar ekleme
- **Dosya ekleme**: Görev mevcut dosyada yapılabiliyorsa orada yap
- **İmkansız senaryolar için hata yönetimi ekleme**: Dahili koda güven
```

**Mobil CLAUDE.md Örneği (NX Monorepo + React Native)**

```text
# Mobile Project
## WHAT - Projeye Genel Bakış
iOS, Android ve Web'i destekleyen mobil uygulama için **NX monorepo**.
### Tech Stack
- TypeScript 5.8, React Native 0.79, React 18
- UI: Tamagui 1.132
- State: RTK Query
- Backend: Firebase, RevenueCat
## WHY - Mimari Kararlar
Bu proje **library-first mimarisini** takip eder. Her özellik `libs/` altında
bağımsız bir kütüphane olarak yaşar. Bu paralel geliştirmeyi, net sınırları
ve daha kolay testi mümkün kılar.
## HOW - Kod Kuralları (NEDEN ile birlikte)
- React Native yerine Tamagui primitive'leri kullan (`Box`, `Text`)  → *çünkü Tamagui cross-platform tutarlılığı sağlar*
- Renkler/aralıklar için tema token'ları kullan  → *çünkü sabit kodlanmış değerler tema değiştiğinde bozulur*
- `useCallback`/`useMemo` ile memoize et  → *çünkü yeniden render'lar mobilde performans sorunlarına neden olur*
```

### WHY Açıklamalarının Gücü

```text
# Kural (NEDEN olmadan)- console.log kullanma# Kural (NEDEN ile birlikte)- console.log kullanma — *çünkü production'da performans sorunlarına yol açar  ve hassas veri sızdırır*
```

Claude "neden"i bildiğinde, edge case'lerde bile daha iyi kararlar verir. "console.log kullanma" derseniz, debug sırasında bile kullanmaz. Ama "production'da performans sorunlarına yol açar" derseniz, geliştirme sırasında geçici kullanımın kabul edilebilir olduğunu anlar.

### Global CLAUDE.md — Tüm Projelere Uygulanan Talimatlar

`~/.claude/CLAUDE.md` dosyası, tüm projeler genelinde geçerli olan global talimatları içerir. Örneğin sık kullandığım CLI araçlarını burada tanımlıyorum:

```text
## Mevcut JSON Araçları
JSON işleme için aşağıdaki CLI araçları kurulu:
- **jq** - JSON sorgu ve dönüşümü (`jq '.key' file.json`)
- **fx** - İnteraktif JSON gezgini (`fx data.json` veya `| fx` ile pipe)
- **jless** - Vim benzeri gezinmeli terminal JSON görüntüleyici
- **gron** - JSON'u grep'e uygun hale getirir (`gron file.json | grep "key"`)
JSON dosyalarıyla çalışırken:
- Büyük dosyaları hızla incelemek için `jless` kullan
- Belirli değerleri bulmak için `gron | grep` kullan
- İnteraktif keşif ve JavaScript dönüşümleri için `fx` kullan
- Karmaşık sorgu ve dönüşümler için `jq` kullan
```

**Neden global CLAUDE.md?** Aynı araçları her projede tekrar tanımlamak yerine global dosyada bir kez tanımlıyor ve tüm projelerde kullanıyorum. Claude, JSON dosyalarıyla çalışırken hangi araçları kullanabileceğini biliyor ve uygun olanı seçiyor.

**Pro İpucu: Subagent Kontrolü**
Claude Code bazen bilgi görevleri için bile Sonnet veya Haiku subagent'lar başlatır. Daha kaliteli çıktı için global CLAUDE.md'nize şu satırı ekleyin:

```text
## Subagent TercihleriBilgi yoğun görevler için her zaman opus subagent'ları başlat.
```

Büyük projelerde **Orchestrator + Subagent'lar** kombinasyonu, vanilla Claude Code'dan çok daha etkili çalışır.

### CLAUDE.md Altın Kuralları

| Kural                      | Neden                                                    |
| -------------------------- | -------------------------------------------------------- |
| **< 100 satır**            | Uzun dosyalar context'i doldurur                         |
| **NEDEN'i açıkla**         | Claude "neden"i bilince daha iyi kararlar verir          |
| **YAPILMAYACAKLAR ekle**   | Claude'un bilinen eğilimlerini önle                      |
| **Progressive disclosure** | Detayları ayrı dosyalarda referansla                     |

### **Her Etkili CLAUDE.md'nin Kapsadığı Altı Alan**

WHAT/WHY/HOW yapısı bilgilerin _nasıl_ sunulacağını tanımlarken, aşağıdaki altı alan _ne tür_ bilgilerin dahil edilmesi gerektiğini tanımlar. Her ikisini birlikte kullanmak en etkili sonucu verir.

Deneme yanılma yoluyla fark ettim ki iyi çalışan CLAUDE.md dosyaları ortak bir yapıyı paylaşıyor. Her biri şu altı alanı kapsıyor:

| Alan                     | Dahil Edilecekler                                             |
| ------------------------ | ------------------------------------------------------------- |
| **Komutlar**             | Bayraklı çalıştırılabilir komutlar (`npm test --coverage`)    |
| **Test**                 | Test framework'ü, pattern'ler, kapsam beklentileri            |
| **Proje Yapısı**         | Ana dizinler ve amaçları                                      |
| **Kod Stili**            | Yalnızca açıklama değil, iyi kod örnekleri                    |
| **Git İş Akışı**         | Branch isimlendirme, commit formatı, PR süreci               |
| **Sınırlar**             | AI'ın asla dokunmaması gerekenler                            |

**Sınırlar için üç katmanlı yaklaşım kullanıyorum:**

```text
## Sınırlar
- ✅ **Her zaman:** Commit öncesi testleri çalıştır, isimlendirme kurallarına uy
- ⚠️ **Önce sor:** Veritabanı migration'ları, yeni bağımlılıklar
- 🚫 **Asla:** Secret commit etme, lock dosyalarını düzenleme, testleri silme
```

**Öğrendiğim en önemli şey:** Stilinizi _anlatan_ üç paragraf yazmak yerine, onu _gösteren_ bir kod parçacığı ekleyin. Claude örneklerden çok daha iyi öğrenir. Ayrıca komutları dosyanızın en üstüne koyun — Claude onlara sık sık başvurur.

**Tüm bunları 100 satıra nasıl sığdırırız?** Her alanın _özetini_ CLAUDE.md'ye yazın — ayrıntılı pattern'ler, uzun kod örnekleri ve kapsamlı açıklamalar `docs/claude/` altındaki ayrı dosyalarda yaşasın. Örneğin:

-   CLAUDE.md: "Kod stili: Özel alanlar için `_camelCase`, public sınıflarda `sealed`"
-   `docs/claude/code-style.md`: 20+ satır ayrıntılı örnek, edge case'ler, anti-pattern'ler

## Bölüm 2: Context Window — En Kritik Konu

### %20–40 Kuralı

| Metrik                           | Değer            |
| -------------------------------- | ---------------- |
| Opus 4.5 Context                 | 200.000 token    |
| **Kalite bozulması başlar**      | **%20-40**       |
| Kritik bozulma                   | %60+             |

Çoğu geliştirici context'in %100 dolana kadar sorunsuz çalışacağını varsayar. Gerçek şu ki **kalite kaybı %20–40 civarında başlar**. %60'tan sonra Claude:

-   Önceki talimatları unutur
-   Aynı hataları tekrarlar
-   Yanlış dosyaları düzenler
-   Daha düşük kaliteli kod üretir

### **"Bir Konuşma = Bir Özellik" İlkesi**

```text
❌ YANLIŞ: Her şey tek konuşmada
├── Auth sistemini kur
├── Veritabanı şemasını değiştir
├── UI bileşenlerini güncelle
└── (Context patladı, kalite düştü)
✅ DOĞRU: Odaklanmış konuşmalar
Oturum 1: Auth planlaması → Kararlar SCRATCHPAD'e
Oturum 2: Login implementasyonu
Oturum 3: Hata yönetimi
Oturum 4: Profil sayfası
```

### Kopyala-Yapıştır Sıfırlama Tekniği

Context şiştiğinde:

1.  Önemli bilgileri kopyalayın (terminal çıktısı, kod parçacıkları)
2.  `/compact` ile özet alın
3.  `/clear` ile temizleyin
4.  Yapıştırın ve devam edin

```text
"Auth sistemi üzerinde çalışıyoruz.- LoginScreen tamamlandı- authSlice Redux store'da mevcut- Şimdi hata yönetimini yapacağızDevam edelim."
```

### Uyarı İşaretleri — Ne Zaman Temizlemeli?

| İşaret                              | Eylem                         |
| ----------------------------------- | ----------------------------- |
| Claude sürekli tekrar ediyor        | `/clear`                      |
| Önceki context'i unutuyor           | SCRATCHPAD'e yaz, `/clear`    |
| Yanlış dosyaları düzenliyor         | Context'i temizle             |
| Gözle görülür kalite düşüşü         | `/compact` + `/clear`         |

## Bölüm 3: Harici Bellek Sistemleri

Claude durumsuz bir sistemdir. Her konuşma sıfırdan başlar. Peki oturumlar arasında bilgiyi nasıl taşıyoruz?

### SCRATCHPAD.md — Oturumlar Arası Bellek

Proje kökünde bir `SCRATCHPAD.md` dosyası:

```text
# Scratchpad - Harici Bellek
## Mevcut Görev[Şu an aktif görev]
## Alınan Temel Kararlar
| Karar | Neden | Tarih |
|-------|-------|-------|
| JWT (session değil) | Mobil öncelikli, çevrimdışı destek | 2024-01-15 |
## Düzenlenen Dosyalar- file1.cs - X eklendi- file2.cs - Y refactor edildi
## Sonraki Oturum İçin Notlar[Bir sonraki oturum için önemli notlar]
```

**İş Akışı:**

1.  Oturum başında: "SCRATCHPAD.md oku"
2.  Önemli karar alındığında: Dosyayı güncelle
3.  Oturum sonunda: Notlar ekle
4.  `/clear` sonrası: "SCRATCHPAD.md oku"

**Alternatif: progress.txt Pattern'i** — Otonom döngüler (Ralph gibi) için daha minimal bir yaklaşım:

```text
# progress.txt
## Tamamlananlar
- [x] Auth modülü - JWT implementasyonu
- [x] User service - CRUD endpoint'leri
## Mevcut
- [ ] Ödeme entegrasyonu - Stripe kurulumu
## Kararlar- Veri erişimi için repository pattern kullanıldı (test edilebilirlik)
## Sonraki Oturum Notları- Stripe webhook imza doğrulama bekliyor
```

Bu pattern özellikle `git commit` ile birleştirildiğinde güçlüdür: progress.txt her iterasyonun sonunda güncellenerek commit edilir. Gelecekteki iterasyonlar, git geçmişi + progress.txt kombinasyonu sayesinde tam context'e sahip olur.

### OpenContext — Projeler Arası Kalıcı Bellek

OpenContext, birden fazla proje arasında bilgi paylaşmanızı sağlar.

```bash
npm install -g @aicontextlab/cli/opencontext-context  /opencontext-search   /opencontext-create   
```

Global MCP yapılandırmam (`~/.claude/mcp.json`):

```json
{
  "mcpServers": {
    "opencontext": {
      "command": "oc",
      "args": [
        "mcp"
      ]
    }
  }
}
```

### Claude Code Indexer — Kod Tabanınızı Anlayan Kalıcı Bellek

Claude Code Indexer, **graph veritabanı** ile çalışan çok dilli bir kod indeksleme aracıdır. **Python, JavaScript, TypeScript, Java ve AutoIt**'i destekler.

**Akıllı Dosya Yönetimi:**

-   `node_modules/` ve `.git/` dizinlerini otomatik olarak yok sayar
-   `.gitignore` kurallarına uyar — gereksiz dosyaları indekslemez
-   Bu sayede büyük projelerde bile hızlı ve verimli çalışır

**Temel Yetenekler:**

-   **Çok Anahtar Kelimeli Arama**: Birden fazla anahtar kelimeyle arama
-   **Semantik İndeksleme**: Graph yapısı aracılığıyla kod ilişkilerini anlar
-   **LLM Belleği**: Claude'un önceki analizlerini saklar — aynı dosyayı yeniden analiz etmeye gerek kalmaz
-   **Kodlama Pattern'leri ve En İyi Uygulamalar**: Proje için belirlediğiniz pattern'leri ve en iyi uygulamaları saklar
-   **Kritik Bileşenler**: Projedeki kritik bileşenleri tanımlar ve önceliklendirir

**MCP Entegrasyonu:** Claude Desktop ile yerel MCP server olarak çalışır. Kurulum otomatiktir — manuel yapılandırma gerekmez.

**Neden kullanıyorum:** Claude'un her oturumda kod tabanını yeniden keşfetmesine gerek kalmıyor. Önceki oturumlardaki analizler, oluşturulan pattern'ler ve mimari içgörüler korunuyor. Bu, özellikle büyük projelerde önemli zaman tasarrufu sağlıyor.

```text
mcp__claude-code-indexer__index_codebase
mcp__claude-code-indexer__search_code
mcp__claude-code-indexer__get_coding_patterns
mcp__claude-code-indexer__store_llm_memory
```

## Bölüm 4: Plugin Ekosistemi — Geliştirilmiş Geliştirme

Claude Code'un gerçek gücü plugin'lerde yatıyor. Kullandığım plugin'lerin kategorilere göre dağılımı şöyle:

### LSP Plugin'leri (Language Server Protocol)

| Plugin           | Dil        | Neden Kritik                              |
| ---------------- | ---------- | ----------------------------------------- |
| `csharp-lsp`     | C#         | Backend'de tip hataları, IntelliSense     |
| `typescript-lsp` | TypeScript | Mobilde tip farkında öneriler             |
| `pyright-lsp`    | Python     | Script'ler ve otomasyon için             |
| `gopls-lsp`      | Go         | CLI araç geliştirme                       |
| `kotlin-lsp`     | Kotlin     | Android native geliştirme                |
| `lua-lsp`        | Lua        | Neovim config, oyun scripting             |

**LSP olmadan** Claude kodu yalnızca metin olarak görür. **LSP ile** tip hatalarını, eksik import'ları, kullanılmayan değişkenleri — her şeyi tespit eder.

### Geliştirme İş Akışı Plugin'leri

| Plugin              | Açıklama                     | Kullanım Alanı                            |
| ------------------- | ---------------------------- | ----------------------------------------- |
| `commit-commands`   | `/commit`, `/commit-push-pr` | Git iş akışı otomasyonu                  |
| `code-review`       | Kod incelemesi               | PR öncesi kalite kontrolü                 |
| `pr-review-toolkit` | Ayrıntılı PR inceleme agent'ları | Sessiz hata avı, tip analizi          |
| `feature-dev`       | Yönlendirilmiş özellik geliştirme | Karmaşık özellik implementasyonu    |
| `code-simplifier`   | Kod basitleştirme            | Refactoring                               |
| `security-guidance` | Güvenlik en iyi uygulamaları | Açık tarama                               |

### Entegrasyon Plugin'leri

| Plugin      | Entegrasyon     | Kullanım                          |
| ----------- | --------------- | --------------------------------- |
| `github`    | GitHub          | Issue'lar, PR'lar, Actions        |
| `atlassian` | Jira/Confluence | Görev takibi, dokümantasyon       |
| `Notion`    | Notion          | Bilgi tabanı                      |
| `firebase`  | Firebase        | Auth, Firestore, hosting          |
| `linear`    | Linear          | Issue takibi                      |
| `figma`     | Figma           | Tasarımdan koda                   |

### Semantik Analiz ve Dokümantasyon

| Plugin            | Kullanım                                        |
| ----------------- | ----------------------------------------------- |
| `serena`          | Semantik kod analizi, sembol navigasyonu        |
| `context7`        | Kütüphane dokümantasyonu arama                  |
| `greptile`        | Repo'lar arası semantik arama                   |
| `document-skills` | PDF, elektronik tablo, dokümantasyon üretimi    |

### Tarayıcı Otomasyonu

| Plugin        | Kullanım                                     |
| ------------- | -------------------------------------------- |
| `playwright`  | Tarayıcı testi, E2E otomasyonu               |
| `dev-browser` | Test için Claude kontrolündeki tarayıcı      |

### Verimlilik ve UI

| Plugin                  | Kullanım                           |
| ----------------------- | ---------------------------------- |
| `claude-hud`            | Durum satırı geliştirme            |
| `hookify`               | Özel hook oluşturma                |
| `learning-output-style` | Eğitimsel çıktı modu               |
| `design-and-refine`     | Yinelemeli tasarım iş akışı        |
| `claude-stt`            | Konuşmadan metne girdi             |

## Bölüm 5: Custom Agents — Proje ve Alana Özgü AI Asistanlar

**Hazır Agent'lar Bulun:** Topluluk agent'larına [aitmpl.com/agents](https://www.aitmpl.com/agents) adresinden göz atın — kod incelemesi, hata ayıklama, mimari ve daha fazlası için önceden hazırlanmış agent'lar.

### Agent Nedir?

Bir agent, belirli bir görev için uzmanlaşmış Claude örneğidir. Bir sistem prompt'u + araç kısıtlamaları ile tanımlanır.

### Neden Custom Agent Kullanıyorum?

**1. Alan Uzmanlığı**: Clean Architecture, CQRS veya React Native performansında uzmanlaşmış bir agent, genel amaçlı Claude'dan çok daha etkilidir.

**2. Tutarlı Yaklaşım**: Aynı türdeki görevler için tutarlı bir yaklaşım garanti eder. Bir güvenlik denetçisi her zaman aynı kontrol listesini takip eder.

**3. Araç Kısıtlamaları**: Hata ayıklama agent'ının dosya silme iznine sahip olmamasını sağlamak gibi güvenlik katmanları.

**4. Odaklanmış Context**: Agent'ın sistem prompt'u yalnızca kendi alanına odaklanır, context gereksiz bilgilerle dolmaz.

### Backend Projesindeki Agent Kategorileri

**Mimari ve Tasarım:**

-   `backend-architect` — API tasarımı, mikroservis sınırları, ölçeklenebilirlik
-   `database-architect` — Şema tasarımı, normalleştirme, indeksleme stratejileri
-   `cloud-architect` — Bulut altyapısı, deployment pattern'leri

**Kod Kalitesi:**

-   `c-sharp-pro` — Modern C# 12/13 özellikleri, async pattern'ler, LINQ
-   `security-auditor` — OWASP Top 10, açık tespiti
-   `code-reviewer` — Kalite, sürdürülebilirlik, en iyi uygulamalar

**Bakım:**

-   `dotnet-upgrade` — .NET sürüm migration'ı
-   `unused-code-cleaner` — Ölü kod kaldırma
-   `architecture-modernizer` — Legacy'den modern mimariye

### Mobil Projesindeki Agent Kategorileri

**Geliştirme:**

-   `typescript-pro` — Modern TypeScript, generic'ler, utility type'lar
-   `mobile-developer` — Cross-platform mobil pattern'ler
-   `ios-developer` — iOS'a özgü geliştirme, Swift birlikte çalışabilirliği

**Performans ve Kalite:**

-   `react-performance-optimization` — React Native performansı, memoization
-   `debugger` — Kök neden analizi, stack trace yorumlama
-   `performance-engineer` — Uygulama performansı, bellek sızıntıları, başlatma süresi

**Süreç:**

-   `git-flow-manager` — Branch stratejisi, merge çakışmaları
-   `context-manager` — Çok-agent koordinasyonu

### Agent Dosya Yapısı

```text
---name: c-sharp-prodescription: Idiomatik C# kodu yaz, modern dil özelliklerini kullan.tools: Read, Write, Edit, Bashmodel: sonnet---Modern, performanslı kurumsal uygulamalarda uzmanlaşmış bir C# ve .NET uzmanısınız.
## Odak Alanları- Modern C# özellikleri (C# 12/13) - primary constructor'lar, koleksiyon ifadeleri- Async/await pattern'leri, Task Parallel Library- Clean Architecture, CQRS, Mediator pattern'leri
## Yaklaşım
1. Özlü, anlamlı kod için C# dil özelliklerinden yararlan
2. SOLID prensiplerini ve Domain-Driven Design'ı uygula
3. async/await'i doğru kullan - blocking çağrılardan kaçın
```

### Sınırları Tanımlamak: Üç Katmanlı Yaklaşım

**Not:** Bu yaklaşımı hem CLAUDE.md'de (proje geneli sınırlar) hem de agent dosyalarında (agent'a özgü sınırlar) kullanabilirsiniz. CLAUDE.md için örneği yukarıdaki Bölüm 1'de gördük.

İlk agent'larım yalnızca "yapma" listesine sahipti. Ama Claude bazen aşırı temkinli davranıyordu çünkü ne _yapabileceğini_ bilmiyordu. Şimdi üç katmanlı sistem kullanıyorum:

```text
## Sınırlar
- ✅ **Her zaman yap:** `tests/` dizinine yaz, commit öncesi testleri çalıştır, isimlendirme kurallarına uy
- ⚠️ **Önce sor:** Veritabanı şema değişiklikleri, bağımlılık ekleme, CI/CD config değiştirme
- 🚫 **Asla yapma:** Secret commit etme, `node_modules/` düzenleme, başarısız testleri kaldırma
```

Bu yaklaşımın avantajı:

-   **"Her zaman yap"** agent'a güvenle hareket edebileceği yerleri gösterir
-   **"Önce sor"** gri alanları tanımlar — riskli ama bazen gerekli işlemler
-   **"Asla yapma"** sert çizgiler çizer — yıkıcı eylemler için kritik

Örneğin `test-agent` için sınırları şöyle tanımlıyorum:

```text
## Sınırlar
- ✅ **Her zaman:** `tests/` dizinine yaz, mevcut test pattern'lerini kullan, doğrulamak için `npm test` çalıştır
- ⚠️ **Önce sor:** Yeni test bağımlılıkları ekleme, test yapılandırmasını değiştirme
- 🚫 **Asla:** `src/` içindeki kaynak kodu değiştirme, başarısız testleri kaldırma, test doğrulamasını atlama
```

### Kullandığım Agent Şablonu

Yeni bir agent oluştururken şu yapıyı takip ediyorum:

```text
---
name: agent-adınız
description: [Bu agent'ın ne yaptığına dair tek cümlelik açıklama]
tools: Read, Write, Edit, Bash
model: sonnet
---
Bu proje için uzman bir [rol] olarak çalışıyorsunuz.
## Rolünüz- [Belirli alanda] uzmanlaşmışsınız- [İlgili pattern'leri/teknolojileri] anlıyorsunuz- Çıktınız: [ne üretiyorsunuz]
## Proje Bilgisi
- **Tech Stack:** [sürümlerle birlikte teknolojiler]
- **Ana Dizinler:**  - `src/` – [burada ne var]  - `tests/` – [burada ne var]
## Kullanabileceğiniz Komutlar
- **Build:** `npm run build`
- **Test:** `npm test`
- **Lint:** `npm run lint --fix`
## Sınırlar
- ✅ **Her zaman:** [güvenli eylemler]
- ⚠️ **Önce sor:** [riskli ama bazen gerekli]
- 🚫 **Asla:** [yıkıcı eylemler]
```

## Bölüm 6: Skill'ler — Yeniden Kullanılabilir Bilgi ve İş Akışları

**Skill'leri Keşfedin:** Topluluk skill'lerine [skills.sh](https://skills.sh/) adresinden göz atın — `npx skills add <owner/repo>` ile kurulabilir 200'den fazla skill.

**Cross-Platform Yönetim:** [Context7 CLI](https://github.com/upstash/context7/tree/master/packages/cli) (ctx7), Claude Code, Cursor, Codex ve diğer AI editörlerinde skill'leri yönetir:

```bash
npx ctx7 skills search [term]   npx ctx7 skills install [skill] 
```

### Agent ile Skill Arasındaki Fark

| Agent                     | Skill                                 |
| ------------------------- | ------------------------------------- |
| Otonom görev yürütücüsü   | Yeniden kullanılabilir bilgi/iş akışı |
| Subagent olarak çalışır   | Ana konuşmada çalışır                 |
| Araç kısıtlamaları var    | Tüm mevcut araçları kullanır          |
| Göreve odaklı             | Bilgiye odaklı                        |

### Neden Custom Skill Oluşturuyorum?

**1. Sürekli Öğrenme**: Her oturumda edinilen bilginin kaybolmasını önlemek için. Claudeception skill'i tam bu amaç için var — saçma olmayan hata ayıklama çözümlerini ve projeye özgü pattern'leri otomatik olarak çıkarır.

**2. Projeler Arası Bilgi**: Bir projede öğrenilen React Native performans pattern'leri diğer projelere de uygulanabilir. Bir kez skill olarak kaydedilince global olarak kullanılabilir hale gelir.

**3. Standartlaştırılmış İş Akışları**: Tarayıcı otomasyonu için aynı komutları her seferinde hatırlamak yerine, skill'ler içinde tanımlanmış iş akışlarını kullanıyorum.

**4. Ekip Bilgi Paylaşımı**: Yeni bir ekip üyesi Claude Code kullanmaya başladığında, birikmiş skill'lere zaten erişimi oluyor.

### Global Skill Kategorilerim

**Öğrenme ve Bilgi Çıkarımı:**

-   `claudeception` — Konuşmalardan bilgiyi otomatik çıkarır. Saçma olmayan hata ayıklama çözümleri ve projeye özgü pattern'ler skill olarak kaydedilir.

**Tarayıcı Otomasyonu:**

-   `agent-browser` — Headless tarayıcı komutları için standartlaştırılmış iş akışları sağlar. Element seçimi, form doldurma ve ekran görüntüsü alma gibi işlemler için tutarlı bir arayüz sunar.

**Geliştirme En İyi Uygulamaları:**

-   `vercel-react-best-practices` — React ve Next.js performans optimizasyon pattern'leri. Memoization, lazy loading ve bundle optimizasyonu konusunda rehberlik sağlar.
-   `react-native-best-practices` (Callstack) — React Native ve Expo için production'da test edilmiş optimizasyon skill'leri. Callstack ekibinin yılların deneyimi: başlatma süresi, yeniden render'lar, liste performansı, bellek yönetimi. Bu skill paketini neden kullanıyorum: Mobil performans sorunları genellikle aynı pattern'lere düşer — FlatList sanallaştırma, memoization stratejileri, Hermes optimizasyonları. Her seferinde aynı araştırmayı yapmak yerine kanıtlanmış çözümleri hızla uygulayabiliyorum.

**UI/UX:**

-   `web-design-guidelines` — Erişilebilirlik, duyarlı tasarım, UX en iyi uygulamaları. UI kod incelemelerinde kullanılır.

**Harici Entegrasyon:**

-   `opencontext-*` — Projeler arası kalıcı bellek entegrasyonu. Context yükleme, arama ve yeni doküman oluşturma iş akışları.

### Claudeception: Sürekli Öğrenme Sistemi

Claudeception'ı kullanmamın ana nedeni: **Claude her oturumda sıfırdan başlar**. Bir oturumda keşfedilen saçma olmayan bir çözüm, bir sonrakinde unutulur.

**Ne zaman skill çıkarırım?**

1.  **Saçma Olmayan Çözümler**: Dokümantasyonda bulunmayan hata ayıklama teknikleri
2.  **Projeye Özgü Pattern'ler**: Projeye has kurallar
3.  **Hata Çözümleri**: Hata mesajları ve gerçek çözümleri
4.  **İş Akışı Optimizasyonları**: Çok adımlı süreçler

**Kalite Kriterleri:**

-   Gelecekte yeniden kullanılabilir mi?
-   Keşif gerektiren bir bilgi mi?
-   Belirli tetikleyici koşullar tanımlanabilir mi?
-   Çözüm gerçekten işe yaradı mı?

## Bölüm 7: MCP Server'lar — Harici Araç Entegrasyonu

### MCP Nedir?

Model Context Protocol — Claude'a harici araçlar ekleyen bir protokol.

### Projeye Yerel MCP

**Mobil projede** (`.mcp.json`):

```json
{
  "mcpServers": {
    "nx-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "nx-mcp"
      ]
    }
  }
}
```

### Global MCP

`~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/context7-mcp"
      ],
      "description": "Kütüphaneler için dokümantasyon arama"
    },
    "serena": {
      "command": "uvx",
      "args": [
        "serena-mcp"
      ],
      "description": "Semantik kod analizi"
    },
    "opencontext": {
      "command": "oc",
      "args": [
        "mcp"
      ]
    }
  }
}
```

### MCP Kullanım Alanları

| MCP Server    | Kullanım                                         |
| ------------- | ------------------------------------------------ |
| `context7`    | Kütüphane dokümantasyonu arama                   |
| `serena`      | Semantik kod navigasyonu, sembol bulma           |
| `nx-mcp`      | NX workspace analizi                             |
| `opencontext` | Projeler arası bilgi tabanı                      |

## Bölüm 8: Hook'lar — Otomasyon ve Sürekli Öğrenme

### Hook Türleri

| Hook               | Ne Zaman Çalışır              |
| ------------------ | ----------------------------- |
| `PreToolUse`       | Bir araç çağrılmadan önce     |
| `PostToolUse`      | Bir araç çağrıldıktan sonra   |
| `SessionStart`     | Oturum başlangıcında          |
| `UserPromptSubmit` | Kullanıcı mesaj gönderdiğinde |
| `Stop`             | Agent durduğunda              |

### Claudeception Aktivatör Hook'u

Global ayarlarımda (`~/.claude/settings.json`):

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/claudeception-activator.sh"
          }
        ]
      }
    ]
  }
}
```

**Bu hook ne yapıyor?** Her prompt'ta Claude'a hatırlatır:

-   "Bu görevde saçma olmayan bir şey öğrendin mi?"
-   "Gelecekte benzer durumlarda işe yarayacak bir şey var mı?"
-   "Varsa, claudeception skill'ini çalıştır"

**Sonuç**: Claude otomatik olarak yeni skill'ler oluşturur ve bilgi birikir.

### PostToolUse: Otomatik Lint Hook Örneği

Her dosya düzenlemesinden sonra ESLint çalıştırma:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if [[ \"$CLAUDE_FILE_PATH\" =~ \\.(ts|tsx)$ ]]; then npx eslint --fix \"$CLAUDE_FILE_PATH\" 2>/dev/null || true; fi'"
          }
        ]
      }
    ]
  }
}
```

## Bölüm 9: Tarayıcı Otomasyonu — Test ve Doğrulama

### Dev-Browser Plugin'i

Claude'un tarayıcıyı kontrol etmesini sağlayan bir plugin:

```bash
# Kullanım örnekleri
"localhost:3000'i aç ve kayıt akışının çalıştığını doğrula"
"Ayarlar sayfasına git ve kaydet butonunun neden çalışmadığını bul"
"Ödeme sürecini uçtan uca test et"
```

**Özellikler:**

-   **Kalıcı Sayfalar**: Bir kez gezin, Claude birden fazla script çalıştırabilir
-   **LLM için Optimize Edilmiş DOM Snapshot'ları**: AI için optimize edilmiş sayfa incelemesi
-   **Durumlu Sunucu**: Oturum boyunca durum korunur

### Agent-Browser Skill'i

Headless tarayıcı otomasyonu için komut satırı aracı:

```bash
agent-browser open <url>
agent-browser snapshot -i
agent-browser click @e1
agent-browser fill @e2 "text"
agent-browser screenshot
agent-browser close
```

**İş Akışı:**

1.  Gezin: `agent-browser open <url>`
2.  Snapshot: `agent-browser snapshot -i` (`@e1`, `@e2` gibi ref'lerle elemanları döndürür)
3.  Snapshot'taki ref'leri kullanarak etkileşime geç
4.  Önemli DOM değişikliklerinden sonra yeniden snapshot al

### Güvenlik: Docker Sandbox

AFK (Away From Keyboard) kodlarken — özellikle Ralph gibi otonom döngülerde — Claude'un sisteminize tam erişimi olması riskli olabilir. Docker sandbox ile izole çalışma:

```bash
docker sandbox run claude
```

Bu komut Claude Code'u bir konteyner içinde çalıştırır — proje dosyalarınız bağlıdır ancak home dizini, SSH anahtarları ve sistem dosyalarına erişim engellenir. HITL (Human-in-the-loop) kodlama için isteğe bağlı, ancak gece boyunca çalışan otonom döngüler için kritik bir güvenlik katmanıdır.

## Bölüm 10: Speckit — Yapılandırılmış Özellik Geliştirme

Karmaşık özellikler için 5 adımlı iş akışı:

```bash
/speckit.specify "Özellik açıklaması"
/speckit.clarify
/speckit.plan
/speckit.tasks
/speckit.implement
```

### Constitution

Proje ilkelerini tanımlayan bir dosya — pazarlık kabul etmez kurallar:

```text
# .specify/memory/constitution.md
## Pazarlık Kabul Etmez İlkeler
### I. Clean Architecture ve Katman AyrımıHer servis, katı bağımlılık kurallarına sahip dört katmanlı yapıyı TAKİP ETMELİDİR:
- **Domain Katmanı**: Entities, Enums. EF Core'u REFERANS ETMEMELİDİR.
- **Application Katmanı**: CQRS handler'lar, DTO'lar. YALNIZCA Domain'e bağımlı olmalıdır.
- **Infrastructure Katmanı**: EF Core, Repository'ler.
- **Presentation Katmanı**: WebApi, Controller'lar. İnce katman.
### II. CQRS Pattern UygulamasıTüm veri işlemleri Command-Query Responsibility Segregation'a UYGUN OLMALIDIR.
### III. Build-Test-Commit İş Akışı (PAZARLIK KABUL ETMEZ)
Doğrulamadan geçmeden hiçbir kod değişikliği commit edilemez:
1. **Build**: `dotnet build` sıfır hatayla BAŞARILI OLMALIDIR
2. **Test**: İlgili testler BAŞARILI OLMALIDIR
3. **Commit**: Yalnızca build ve testler geçtikten sonra
### IV. Kod Stili Standartları
- Özel alanlar: `_camelCase`
- Arayüzler: `IPascalCase`
- Dosya kapsamlı namespace'ler
- Açık tipler (var'dan kaçın)
- Public sınıflar: Kalıtım için tasarlanmadıkça `sealed`
### V. Basitlik ve YAGNI- Yalnızca doğrudan istenen değişiklikleri yap- Kapsam dışı özellikler ekleme- Üç benzer satır > erken soyutlama- Kullanılmayan kodu tamamen sil
```

### Speckit Ne Zaman Kullanılır?

| Durum                  | Yaklaşım                      |
| ---------------------- | ----------------------------- |
| Basit bug düzeltme     | Doğrudan yap                  |
| Küçük özellik          | Plan modu (Shift+Tab)         |
| Karmaşık özellik       | `/speckit.specify` iş akışı   |
| Çok-servis değişikliği | Kesinlikle Speckit            |

## Bölüm 11: Custom Commands

Sık kullanılan iş akışlarını komut olarak tanımlayın.

**/git-pr — Commit, Push, PR**

```text
# .claude/commands/git-pr.mdStaged değişiklikleri commit et, remote'a push et ve pull request oluştur.
## Adımlar
1. Değişiklikleri görmek için `git status` çalıştır
2. Staged değişiklikleri incelemek için `git diff --staged` çalıştır
3. Son commit stili için `git log -3 --oneline` çalıştır
4. Semantik mesajla commit oluştur
5. `-u` flag'iyle remote'a push et
6. `gh pr create` kullanarak PR oluştur
## Commit Formatıtype(scope): açıklamaCo-Authored-By: Claude <noreply@anthropic.com>
```

**/git-fix-issue — Issue Getir ve Düzelt**

```text
# .claude/commands/git-fix-issue.md---args: issue_number---GitHub issue'yu getir ve düzeltmeyi implement et.
## Adımlar
1. Issue'yu getir: `gh issue view $ARGUMENTS`
2. Branch oluştur: `git checkout -b fix/issue-{number}`
3. Düzeltmeyi analiz et ve implement et
4. Testleri çalıştır
5. `fixes #{number}` referansıyla commit et
```

## Bölüm 12: Ekip Onboarding

### Projeye Yerel vs Global

| Bileşen                 | Konum        | Kapsam  | Git? |
| ----------------------- | ------------ | ------- | ---- |
| CLAUDE.md               | Proje kökü   | Proje   | ✅    |
| .claude/agents/         | Proje        | Proje   | ✅    |
| .claude/commands/       | Proje        | Proje   | ✅    |
| .claude/skills/         | Proje        | Proje   | ✅    |
| .mcp.json               | Proje kökü   | Proje   | ✅    |
| .specify/               | Proje        | Proje   | ✅    |
| ~/.claude/plugins/      | Home         | Global  | ❌    |
| ~/.claude/mcp.json      | Home         | Global  | ❌    |
| ~/.claude/hooks/        | Home         | Global  | ❌    |
| ~/.claude/settings.json | Home         | Global  | ❌    |

### Setup Script

```bash
#!/bin/bash
CRITICAL_PLUGINS=(    "csharp-lsp@claude-plugins-official"    
"typescript-lsp@claude-plugins-official"    "context7@claude-plugins-official"    
"serena@claude-plugins-official"    "commit-commands@claude-plugins-official"    
"code-review@claude-plugins-official"    "github@claude-plugins-official"    
"playwright@claude-plugins-official"
)
for plugin in "${CRITICAL_PLUGINS[@]}"; do
    claude plugins install "$plugin"
done
echo "Claude Code kurulumu tamamlandı!"

```

### Onboarding Kontrol Listesi

Yeni bir geliştirici için:

1.  **Repo'yu clone et** — projeye yerel config'ler de gelir
2.  **Setup script'i çalıştır**: `./scripts/setup-claude.sh`
3.  **Claude'u yeniden başlat** — plugin'ler aktif hale gelir
4.  **Onboarding dokümanı oku**: `docs/AI_SETUP.md`
5.  **Context yükle**: `/opencontext-context` (varsa)

## Bölüm 13: Ekosistemi Genişleten İleri Düzey Araçlar

Şimdiye kadar Claude Code'un temel yapılandırmasını ele aldık. Bu bölümde, ekosistemi bir üst seviyeye taşıyan topluluk araçlarını tanıtıyorum — otonom kodlama, kalıcı bellek ve görsel iş akışı tasarımı için:

### Auto-Claude — Otonom Çok-Agent Framework'ü

[github.com/AndyMik90/Auto-Claude](https://github.com/AndyMik90/Auto-Claude)

**Ne yapar?**

-   Otonom çok-agent kodlama framework'ü
-   Planlama, implementasyon ve doğrulamayı otomatikleştirir
-   Eşzamanlı görev yürütme için **paralel agent terminalleri**
-   Git worktree'leriyle izole değişiklikler
-   AI destekli merge çakışması çözümü
-   Üç katmanlı güvenlik modeli (OS seviyesi izolasyon, dosya sistemi kısıtlamaları, komut allowlist'i)

**Neden önemli:** Claude Code'u tek görevli bir araçtan production seviyesi otonom geliştirme sistemine dönüştürür. Proje yönetimini masaüstü uygulaması ve Kanban panosu görselleştirmesiyle sunar.

### Claude OS — AI Bellek Sistemi

[github.com/brobertsaz/claude-os](https://github.com/brobertsaz/claude-os)

**Ne yapar?**

-   Claude'a **kalıcı bellek** kazandırır
-   Mimari kararları, kodlama pattern'lerini, proje tercihlerini hatırlar
-   Doğal dille bellek kaydetme ("bunu hatırla...")
-   **Hibrit indeksleme**: tree-sitter + semantik embedding'ler
-   Faz 2 seçici semantik embedding — en önemli dosyaların en iyi %20'si
-   Topluluk skill'leriyle tek tıkla kurulum
-   Proje başına 4 bilgi tabanı: memories, profile, index, docs

**Neden önemli:** Her oturumda sıfırdan başlamak yerine, Claude kurumsal bilgi biriktirmeye başlar. Daha az embedding chunk'ıyla aynı arama kalitesini elde eder.

### CC-WF-Studio — Görsel İş Akışı Editörü

[github.com/0xSojalSec/cc-wf-studio](https://github.com/0xSojalSec/cc-wf-studio)

**Ne yapar?**

-   Görsel iş akışı editörü olarak **VSCode extension**
-   Sürükle ve bırak node oluşturma

**Birden fazla node türü:**

-   **Prompt**: `{{değişkenler}}` içeren yeniden kullanılabilir şablonlar
-   **Sub-Agent**: Araç izinlerine sahip otonom AI agent'lar
-   **Skill Nodes**: Mevcut skill'lerle entegrasyon
-   **MCP Tools**: Harici servis bağlantıları
-   **Control Flow**: IfElse, Switch, AskUserQuestion
-   **AI destekli iş akışı geliştirme** — doğal dille iş akışlarını iyileştirin
-   `.claude/agents/` ve `.claude/commands/`'a tek tıkla dışa aktarma
-   Çok dil desteği (EN, JP, KR, CN)

**Neden önemli:** Kod yazmadan karmaşık agent iş akışlarını görsel olarak tasarlayabilirsiniz.

### Tarayıcı Otomasyon Araçları

**Agent-Browser** ([vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser))

-   Rust implementasyonu + Node.js fallback
-   Referans tabanlı element seçimi (`@e1`, `@e2`)
-   Erişilebilirlik ağacı çıkarımı
-   Çok oturum desteği
-   AI agent iş akışları için CLI-first tasarım

**Dev-Browser** ([SawyerHood/dev-browser](https://github.com/SawyerHood/dev-browser))

-   Etkileşimler arasında kalıcı sayfalar
-   LLM için optimize edilmiş DOM snapshot'ları
-   Giriş yapılmış oturumlar için Chrome extension

## Bölüm 14: Topluluk Ekosistemi — Her Şeyi Sıfırdan Yazmayın

En büyük verimlilik kazanımlarından biri topluluk kaynaklarından yararlanmaktır. Claude Code kullanıcıları için iki platform vazgeçilmez hedef haline gelmiştir:

### AI Templates (aitmpl.com)

[**aitmpl.com**](https://www.aitmpl.com/) — Eksiksiz Claude Code şablon pazaryeri.

| Kategori      | Bulacaklarınız                                              |
| ------------- | ----------------------------------------------------------- |
| **Agents**    | Kod incelemesi, hata ayıklama, mimari için hazır agent'lar  |
| **Commands**  | Kullanıma hazır git iş akışları, deployment script'leri    |
| **Settings**  | Optimize edilmiş settings.json yapılandırmaları            |
| **Hooks**     | Otomatik lint, CI tetikleyiciler, öğrenme hook'ları        |
| **MCPs**      | Model Context Protocol server yapılandırmaları             |
| **Skills**    | Yeniden kullanılabilir bilgi modülleri                     |
| **Templates** | Eksiksiz proje kurulumları (React, Next.js, .NET, vb.)     |

**Neden önemli:** Her agent ve komutu sıfırdan yazmak yerine, production'da test edilmiş şablonlarla başlayın. Platform 30'dan fazla şirket stack'ini (OpenAI, Stripe, AWS, GitHub) içeriyor — production'da kanıtlanmış yapılandırmalar.

**Ek araçlar:**

-   Claude oturum izleme için analitik dashboard
-   Optimizasyon için sağlık kontrolü diagnostics
-   Yanıt analizi için konuşma monitörü

## Skills.sh — Agent Skill Dizini

[**skills.sh**](https://skills.sh/) — AI agent'lar için 200'den fazla kurulabilir skill.

```bash
npx skills add <owner/repo>
```

| Özellik                   | Detaylar                                                   |
| ------------------------- | ---------------------------------------------------------- |
| **Skill Sayısı**          | 200'den fazla ve büyümeye devam ediyor                     |
| **Desteklenen Agent'lar** | 15'ten fazla (Claude Code, Cursor, Copilot, Gemini, vb.)   |
| **Katkıda Bulunanlar**    | Vercel, Anthropic, Expo, topluluk geliştiricileri          |
| **Kurulum**               | npx ile tek komut                                          |

**Popüler skill'ler arasında:**

-   React ve web tasarım en iyi uygulamaları
-   Framework'e özgü rehberlik (Expo, Next.js, Remix)
-   Güvenlik ve test yardımcıları
-   Geliştirme iş akışı otomasyonu

## En İyi Uygulamalar Özeti

### CLAUDE.md

-   100 satırın altında tutun
-   WHAT / WHY / HOW yapısı
-   WHY açıklamaları ekleyin
-   YAPILMAYACAKLAR bölümü ekleyin
-   Progressive disclosure (detaylar ayrı dosyalarda)

### Context Yönetimi

-   Bir konuşma = bir özellik
-   SCRATCHPAD.md kullanın
-   Kopyala-yapıştır sıfırlama uygulayın
-   Uyarı işaretlerini izleyin
-   `/compact` düzenli kullanın

### Ekosistem

-   LSP plugin'i kurun (diliniz için)
-   Kritik iş akışı plugin'lerini kurun
-   Projeye yerel MCP tanımlayın (.mcp.json)
-   Custom agent'lar oluşturun (alana özgü)

### Ekip

-   setup-claude.sh script'i oluşturun
-   Projeye yerel config'leri repo'ya commit edin
-   docs/AI\_SETUP.md dokümantasyonu yazın

### İş Akışı

-   Plan modunu kullanın (Shift+Tab)
-   Karmaşık özellikler için Speckit kullanın
-   Constitution tanımlayın
-   Hook'larla otomatikleştirin

### Hızlı Kurulum: Claude'un Sizin İçin Yapmasına İzin Verin

NEDEN ve NASIL'ı anladığınıza göre, her şeyi kurmanın en hızlı yolu: **Claude Code'un bunu sizin için yapmasına izin vermek**.

Her ikisi de bilgi tabanı ve kurulum rehberi olarak hizmet eden kapsamlı bir gist hazırladım. Bunu Claude Code ile paylaşmanız yeterli; Claude şunları yapacak:

1.  **Senaryonuzu tespit eder** — Yeni proje mi yoksa mevcut kod tabanı mı
2.  **Kontrol listesi oluşturur** — Yapılması gerekenleri takip eder
3.  **Her şeyi kurar** — CLAUDE.md, agent'lar, komutlar, dizin yapısı
4.  **Cross-platform sorunları halleder** — macOS/Linux/Windows'a otomatik uyum sağlar
5.  **Eksik araçları kurar** — `uv`, `gh`, `node` vb. tespit edip kurulum önerir

### Nasıl Kullanılır

Proje dizininizde Claude Code'u açın ve şunu yazın:

```text
Read this gist and set up my project: https://gist.github.com/senrecep/98d3583717581a4138bac62344261f6f
```

### Bundan Sonra Ne Olur

**Yeni Projeler için (henüz kaynak kod yok):**

Claude keşif soruları sorar:

-   Ne inşa ediyorsunuz?
-   Hangi dil/framework?
-   MVP kapsamı nedir?

Ardından her şeyi oluşturur: constitution, CLAUDE.md, agent'lar, komutlar ve Speckit ile ilk özelliğinize başlamanıza yardımcı olur.

**Mevcut Projeler için:**

Claude önce kod tabanınızı analiz eder:

-   Tech stack ve mimarisi tespit eder
-   Build/test/lint komutlarını belirler
-   Mevcut kuralları not eder

Ardından mevcut pattern'lerinize saygı duyan özelleştirilmiş bir Claude ekosistemi oluşturur.

### Gist'in İçeriği

| Bölüm      | Amaç                                                                |
| ---------- | ------------------------------------------------------------------- |
| **Part A** | Kontrol listesiyle yeni proje kurulum akışı                         |
| **Part B** | Kontrol listesiyle mevcut proje kurulum akışı                       |
| **Part C** | Temel şablonlar (CLAUDE.md, agent'lar, komutlar)                   |
| **Part D** | Plugin ve araç kurulum rehberleri                                   |
| **Part E** | Claude için talimatlar (senaryo tespiti, hata yönetimi)             |

### Cross-Platform Desteği

Gist şunlar için otomatik işleme içerir:

-   **Eksik araçlar**: `uv` veya `gh` kurulu değilse, Claude işletim sisteminizi tespit edip doğru kurulum komutunu önerir
-   **İşletim sistemi farklılıkları**: `cat` ve `ls` gibi Unix komutları Windows için otomatik uyarlanır (PowerShell karşılıkları)
-   **Paket yöneticileri**: macOS'ta `brew`, Linux'ta `apt`, Windows'ta `winget` kullanır

### Gist'i Neden Kullanmalı?

| Manuel Kurulum              | Gist Destekli Kurulum               |
| --------------------------- | ----------------------------------- |
| Tüm makaleyi oku            | Kavramlar için makaleyi tara        |
| Tüm adımları hatırla        | Claude kontrol listesini takip eder |
| Şablonları kopyala-yapıştır | Claude şablonları özelleştirir      |
| Kurulum sorunlarını hata ayıkla | Claude hataları yönetir         |
| ~1-2 saat                   | ~10-15 dakika                       |

Makale NEDEN'i açıklıyor. Gist, Claude'a NE YAPACAĞINI söylüyor. Birlikte, dakikalar içinde production seviyesi bir kurulum elde etmenizi sağlar.

## Sonuç

Doğru yapılandırıldığında Claude Code, yazılım geliştirme sürecinizi kökten dönüştürebilir. Bu makalede paylaştığım yapılandırma — plugin'ler, custom agent'lar, hook'lar, MCP server'lar, skill'ler — aylarca süren iteratif bir gelişimin ürünü.

**Temel çıkarımlar:**

1.  **CLAUDE.md kısa ve öz olmalı** — WHY destekli
2.  **Context yönetimi kritik** — %20–40'ta kalite bozulmaya başlar
3.  **Harici bellek şart** — SCRATCHPAD ve OpenContext kullanın
4.  **Plugin ekosistemi güçlü** — LSP + iş akışı + entegrasyon
5.  **Custom agent'lar değerli** — alana özgü uzmanlık
6.  **Hook'lar otomasyonu mümkün kılar** — sürekli öğrenme mümkün
7.  **Test için tarayıcı otomasyonu gerekli** — Dev-browser, agent-browser
8.  **Karmaşık özellikler için Speckit** — yapılandırılmış geliştirme

Bu yapılandırmayı kendi projelerinize uyarlayın. Her proje farklıdır — önemli olan pattern'leri anlamak ve ihtiyaçlarınıza göre özelleştirmektir.

_Son bir not: Yukarıdaki tüm araçlar dahil bu makalenin tamamı, taslak oluşturmadan araştırmaya, yazımdan iteratif düzenlemeye kadar tamamen Claude Code CLI kullanılarak yazılmıştır. Araçlarınızı test etmenin en iyi yolu onları her gün kullanmaktır._

## Kaynaklar

### Hızlı Kurulum

-   [Claude Code Ecosystem Setup Gist](https://gist.github.com/senrecep/98d3583717581a4138bac62344261f6f)

### Resmi Dokümantasyon

-   [Claude Code Documentation](https://docs.anthropic.com/claude-code)
-   [HumanLayer — Writing Good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)

### Topluluk Kaynakları

-   [AI Templates (aitmpl.com/agents)](https://www.aitmpl.com/agents) — Claude Code şablonları için topluluk odaklı platform. Agent'lar, komutlar, ayarlar, hook'lar, MCP'ler, plugin'ler, skill'ler ve eksiksiz proje şablonları bulun. Topluluk katkılarıyla sürekli büyüyen bir ekosistem.
-   [Skills.sh](https://skills.sh/) — Açık Agent Skills Ekosistemi. Claude Code ve diğer AI agent'lar için 200'den fazla kurulabilir skill. `npx skills add <owner/repo>` ile kurun. Vercel, Anthropic, Expo ve topluluk katkıcılarının skill'lerini içerir.
-   [Context7 CLI (Upstash)](https://github.com/upstash/context7/tree/master/packages/cli) — Cross-platform skill kayıt defteri. `npx ctx7 skills install` ile Claude Code, Cursor, Codex, OpenCode ve diğer editörler genelinde AI kodlama skill'lerini yönetin.
-   [Awesome Claude Skills (VoltAgent)](https://github.com/VoltAgent/awesome-claude-skills) — Seçilmiş skill koleksiyonu. Resmi Anthropic skill'lerini, partner skill'lerini ve topluluk katkılarını içerir. Yeni skill ararken başlamak için harika bir kaynak.

### Araçlar ve Projeler

-   [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)
-   [SawyerHood/dev-browser](https://github.com/SawyerHood/dev-browser)
-   [AndyMik90/Auto-Claude](https://github.com/AndyMik90/Auto-Claude)
-   [brobertsaz/claude-os](https://github.com/brobertsaz/claude-os)
-   [0xSojalSec/cc-wf-studio](https://github.com/0xSojalSec/cc-wf-studio)
