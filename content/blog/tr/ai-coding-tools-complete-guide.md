---
title: "AI Kodlama Araçları: Claude Code, OpenCode ve Modern Geliştirme için Kapsamlı Rehber"
description: "Sıfırdan production'a: Claude Code ve OpenCode ile AI destekli geliştirmeye hakim olun. Temel kavramlar, CLAUDE.md yapılandırması, context yönetimi, MCP, skills ve doğru aracı seçmek için eksiksiz bir rehber."
date: "2026-01-24"
slug: "ai-coding-tools-complete-guide"
mediumUrl: "https://senrecep.medium.com/ai-coding-tools-the-complete-guide-to-claude-code-opencode-modern-development-eb9da4477dc1"
imageUrl: "/images/The-Complete-Guide-to-Claude-Code-OpenCode-Modern-Development.webp"
keywords: ["Claude Code", "OpenCode", "AI kodlama araçları", "CLAUDE.md", "MCP", "context yönetimi", "AI destekli geliştirme", "kod üretimi"]
author: "Recep ŞEN"
modifiedDate: "2026-01-24"
category: "AI"
faq:
  - q: "Claude Code ile OpenCode arasındaki fark nedir?"
    a: "Claude Code, Anthropic'in terminal tabanlı AI asistanıdır; subagent'ları, hook'ları ve zengin bir plugin ekosistemini destekler ancak yalnızca Claude modelleriyle çalışır. OpenCode ise Ollama aracılığıyla yerel modeller dahil 75'ten fazla AI sağlayıcısını destekleyen açık kaynaklı bir alternatiftir; daha fazla model esnekliği sunar fakat daha az yerleşik orkestrasyon özelliğine sahiptir."
  - q: "CLAUDE.md nedir ve neden önemlidir?"
    a: "CLAUDE.md, AI kodlama aracı için kalıcı bellek görevi gören proje düzeyinde bir yapılandırma dosyasıdır. Projenin kurallarını, sınırlarını, komutlarını ve bağlamını tanımlayarak AI'ın tekrarlanan açıklamalar gerektirmeksizin kod tabanınızı anlamasını sağlar. Context window'u şişirmemek için 100 satırın altında tutulması önerilir."
  - q: "MCP sunucuları AI kodlama araçlarını nasıl genişletir?"
    a: "Model Context Protocol (MCP) sunucuları, harici API'ları, veritabanlarını ve araçları doğrudan AI'a sunar. Bu sayede Claude Code veya OpenCode'a GitHub, veritabanları, dokümantasyon veya özel iş mantığına gerçek zamanlı erişim verebilir, bilgileri manuel olarak kopyalayıp yapıştırmanıza gerek kalmaz."
---

## Giriş: AI Kodlama Devrimi

Hâlâ ChatGPT veya Claude.ai'dan kod kopyalayıp editörünüze yapıştırıyorsanız, yazılım geliştirmedeki temel bir dönüşümü kaçırıyorsunuz. Modern AI kodlama araçları yalnızca sorulara yanıt vermez — **doğrudan kod tabanınızla etkileşime girer**, dosyalarınızı okur, komut çalıştırır ve sizin için kod yazar.

Bu rehber sizi tam bir başlangıç noktasından ileri düzey kullanıcı seviyesine taşıyacak:

- AI kodlama araçlarının ne olduğu ve neden önemli oldukları
- Her geliştiricinin bilmesi gereken temel kavramlar
- Claude Code: Anthropic'in resmi terminal tabanlı asistanı
- OpenCode: Multi-agent yeteneklere sahip açık kaynaklı alternatif
- Durumunuza göre doğru aracı nasıl seçersiniz
- Production geliştirme için ileri düzey teknikler

**Hızlı Kurulum**: Uygulamalı öğrenmeyi tercih ediyorsanız bu gist'i AI kodlama aracınızla paylaşın:

```text
Read this gist and set up my project: https://gist.github.com/senrecep/98d3583717581a4138bac62344261f6f
```

## Bölüm 1: Temel Kavramlar

### AI Kodlama Araçları Nedir?

AI kodlama araçları, şunları yapabilen terminal tabanlı asistanlardır:

- Projenizde doğrudan **dosya okuma ve yazma**
- **Komut çalıştırma** (build, test, deploy)
- Tüm kod tabanınızdan **bağlam anlama**
- Talimatlarınıza göre **kod üretme, yeniden düzenleme ve hata ayıklama**

Web tabanlı AI'dan (ChatGPT, Claude.ai) farklı olarak bu araçlar geliştirme ortamınıza doğrudan entegre olur.

## İki Büyük Oyuncu (Ocak 2026)

| Araç            | Geliştirici             | Model Desteği | Maliyet          |
| --------------- | ----------------------- | ------------- | ---------------- |
| **Claude Code** | Anthropic (resmi)       | Yalnızca Claude | $17-200/ay      |
| **OpenCode**    | Topluluk (açık kaynak)  | 75'ten fazla sağlayıcı | Ücretsiz + API maliyetleri |

## Bilmeniz Gereken Beş Sınırlama

Başlamadan önce mevcut AI kodlama araçlarının mükemmel yapamadıklarını anlayın:

**1. Tek Ajan Sorunu**
Çoğu araç, tüm görevler için tek bir genel amaçlı AI kullanır. Bir kişiden aynı anda doktor, avukat ve mimar olmasını istemek gibidir.

**2. Halüsinasyon Riski**
AI, makul görünen ancak yanlış kod üretebilir — var olmayan API'lar icat edebilir veya kullanılmayan kalıplar kullanabilir.

**3. Bağlam Kaybı**
Uzun konuşmalarda AI önceki kararları "unutur". Kendinizi mimari seçimleri tekrar tekrar açıklarken bulursunuz.

**4. Kalite Eksiklikleri**
Üretilen kod otomatik olarak test edilmez. Güvenlik, tipler ve test kapsamını manuel olarak doğrulamanız gerekir.

**5. İş Akışı Parçalanması**
Gereksinimler → kodlama → test → dokümantasyon ayrı konuşmalar gerektirir.

## Bölüm 2: Temel Kavramlar

### CLAUDE.md — Projenizin Beyni

Proje kökünüzde AI'a bağlam sağlayan bir markdown dosyası. **Hem Claude Code hem de OpenCode bu dosyayı okur**.

### Altın Kurallar

1. **100 satırın altında tutun** — Uzun dosyalar dikkati dağıtır
2. **WHAT / WHY / HOW yapısı** — Net organizasyon
3. **NEDEN'i açıklayın** — AI bağlamla daha iyi kararlar alır
4. **NOT TO DO ekleyin** — Bilinen AI eğilimlerini önleyin
5. **Ayrıntılı dokümanlara bağlantı verin** — Kademeli açıklama

### Örnek CLAUDE.md

```text
# MyApp

## WHAT - Proje Genel Bakış
NX monorepo ile React Native uygulaması.

### Tech Stack
- TypeScript 5.8, React Native 0.79
- UI: Tamagui | State: RTK Query

## WHY - Mimari Kararlar
Paralel geliştirme gerektiğinden library-first yaklaşımı.

## HOW - Kurallar
- Tamagui primitive'lerini kullanın — cross-platform tutarlılık
- console.log yok — production performansı

## Sınırlar
- Her zaman: Commit öncesi testleri çalıştırın
- Önce sorun: Yeni bağımlılıklar
- Asla: Secret'ları commit etme
```

### Context Window — Kritik %20-40 Kuralı

**Önemli içgörü**: Kalite %100 context'te değil, **%20-40'ta** düşmeye başlar.

%60 context kullanımından sonra AI:

- Önceki talimatları unutur
- Aynı hataları tekrarlar
- Yanlış dosyaları düzenler
- Daha düşük kaliteli kod üretir

### En İyi Uygulamalar

1. **Bir konuşma = bir özellik**
2. **Düzenli olarak `/compact` kullanın**
3. **Context şiştiğinde `/clear` ile temizleyin**
4. **Oturum belleği için SCRATCHPAD.md'yi güncelleyin**

### Uyarı İşaretleri

| Sinyal                        | Eylem                    |
| ----------------------------- | ------------------------ |
| AI kendini tekrarlıyor        | `/clear`                 |
| Önceki bağlamı unutuyor       | SCRATCHPAD -> `/clear`   |
| Yanlış dosyaları düzenliyor   | Context'i temizle        |
| Kalite düşüşü                 | `/compact` + `/clear`    |

### MCP (Model Context Protocol)

AI araçlarını harici servislerle (veritabanları, API'lar, dokümantasyon) bağlamak için bir standart.

**Kritik**: Claude Code ve OpenCode **farklı MCP formatları** kullanır:

| Özellik | Claude Code                 | OpenCode                   |
| ------- | --------------------------- | -------------------------- |
| Anahtar | `mcpServers`                | `mcp`                      |
| Komut   | `"command": "x"` + `"args"` | `"command": ["x", "y"]`    |
| Tip     | Gerekli değil               | `"type": "local"` gerekli  |
| Geçiş   | N/A                         | `"enabled": true/false`    |

**Claude Code (`~/.claude/mcp.json`):**

```json
{
  "mcpServers": {
    "opencontext": {
      "command": "oc",
      "args": ["mcp"]
    }
  }
}
```

**OpenCode (`~/.config/opencode/opencode.json`):**

```json
{
  "mcp": {
    "opencontext": {
      "type": "local",
      "command": ["oc", "mcp"],
      "enabled": true
    }
  }
}
```

### Skills — Yeniden Kullanılabilir Bilgi

Skills, AI yeteneklerini genişleten talimat setleridir. **Claude Code ve OpenCode arasında paylaşılırlar**.

**Dizin arama sırası (OpenCode):**

| Öncelik | Dizin                        | Claude Code ile Paylaşılıyor mu? |
| ------- | ---------------------------- | -------------------------------- |
| 1       | `.opencode/skills/`          | Hayır                            |
| 2       | `.claude/skills/`            | Evet                             |
| 3       | `~/.config/opencode/skills/` | Hayır                            |
| 4       | `~/.claude/skills/`          | Evet                             |

**Temel içgörü**: Bu **sağlayıcıdan bağımsızdır** — Claude, GPT, Gemini veya GLM kullanıyor olsanız da aynı şekilde çalışır.

**Öneri**: Her iki araç arasında paylaşılan skills için `~/.claude/skills/` kullanın.

## Bölüm 3: Claude Code'a Hakim Olmak

### Kurulum

```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
```

### Temel Plugin'ler

```bash
/plugin install commit-commands
/plugin install code-review
/plugin install github
/plugin install firebase
/plugin install serena
/plugin install context7
```

### Plugin Kategorileri

**LSP (Language Server Protocol):**

- `csharp-lsp`, `typescript-lsp`, `pyright-lsp`, `gopls-lsp`
- Claude'un tipleri anlamasını, hataları tespit etmesini, import önermesini sağlar

**Geliştirme İş Akışı:**

- `commit-commands` — `/commit`, `/commit-push-pr`
- `code-review` — Kalite ve güvenlik incelemesi
- `pr-review-toolkit` — Silent failure tespiti, tip analizi

**Entegrasyon:**

- `github`, `atlassian`, `notion`, `firebase`, `linear`, `figma`

**Tarayıcı Otomasyonu:**

- `playwright` — E2E test
- `dev-browser` — Doğrulama için Claude kontrollü tarayıcı

### Özel Ajanlar

`.claude/agents/` içinde özelleşmiş AI asistanları oluşturun:

```yaml
---
name: security-reviewer
description: OWASP odaklı kod incelemesi
tools: Read, Grep, Bash
model: sonnet
---
You are a security auditor focused on OWASP Top 10.

## Approach
1. Identify vulnerabilities
2. Rate severity (critical/high/medium/low)
3. Provide specific fixes
```

### Speckit Entegrasyonu

Karmaşık özellikler için yapılandırılmış geliştirme:

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
specify init . --ai claude
```

### Kritik Adım: Constitution Analizi

**Mevcut projeler için, kurulumdan hemen sonra bunu çalıştırın:**

```bash
/speckit.constitution
```

Bu, kod tabanınızı analiz eder ve şunları çıkarır:

- Kod kalıpları ve kurallar
- Mimari kararlar
- Tech stack özellikleri
- İsimlendirme kuralları

### Özellik Geliştirme İş Akışı

```bash
/speckit.specify "user authentication"
/speckit.clarify
/speckit.plan
/speckit.tasks
/speckit.implement
```

## Bölüm 4: OpenCode'a Hakim Olmak

### Kurulum

```bash
curl -fsSL https://opencode.ai/install | bash
opencode --version
```

### Kimlik Doğrulama

```bash
opencode auth login
# Aboneliğe göre sağlayıcı seçin:
# - Anthropic (Claude aboneliğiniz varsa)
# - OpenAI (ChatGPT Plus'ınız varsa)
# - Google (Gemini'niz varsa)
```

### oh-my-opencode — Multi-Agent Sistemi

oh-my-opencode, OpenCode'u multi-agent bir orkestrasyon sistemine dönüştürür.

**Abonelik Seviyeleri Açıklaması**

| Flag             | Gereksinim           | Etki                            |
| ---------------- | -------------------- | ------------------------------- |
| `--claude=max20` | Claude Pro/Max + 20x | Tam Sisyphus orkestratörü       |
| `--claude=yes`   | Claude Pro/Max       | Standart Sisyphus               |
| `--claude=no`    | Claude yok           | Sisyphus başarısız olabilir     |
| `--openai=yes`   | ChatGPT Plus         | Oracle için GPT-5.2             |

### Ajan Sistemi

| Ajan                | Model                     | Amaç                    |
| ------------------- | ------------------------- | ----------------------- |
| **Sisyphus**        | Claude Opus 4.5           | Ana orkestratör         |
| **Oracle**          | Claude Opus 4.5 / GPT-5.2 | Hata ayıklama, mimari   |
| **Librarian**       | GLM-4.7 (ücretsiz)        | Kod arama, bağlam       |
| **Frontend**        | Claude Opus 4.5           | UI/UX mühendisliği      |
| **Document Writer** | Claude Opus 4.5           | Dokümantasyon           |

### Ultrawork Modu

Paralel ajan çalıştırmayı tetikleyin:

```text
ulw: implement authentication with tests and documentation
```

**Uyarı**: "Token Fırını" — oturum başına $50-100 maliyet çıkarabilir.

## Bölüm 5: Doğrudan Karşılaştırma

### Performans (Gerçek Dünya Testleri)

Opus 4.5 ile topluluk benchmark'larına dayalı:

| Metrik                  | Claude Code | OpenCode |
| ----------------------- | ----------- | -------- |
| Aynı görev tamamlanması | 14 dk       | 27 dk    |
| Token kullanımı         | ~191k       | ~278k    |
| Hız                     | 2x daha hızlı | -      |
| Maliyet                 | %30 daha ucuz | -      |

**Not**: OpenCode'un UX'i yaygın biçimde üstün olarak değerlendiriliyor.

### Özellik Karşılaştırması

| Özellik              | Claude Code   | OpenCode       |
| -------------------- | ------------- | -------------- |
| Model seçenekleri    | Yalnızca Claude | 75'ten fazla sağlayıcı |
| Yerel modeller       | Hayır         | Evet (Ollama)  |
| Context yönetimi     | Mükemmel      | İyi            |
| Subagent'lar         | Yerleşik      | Native değil   |
| Uzak çalışma alanları | Hayır        | Evet           |
| GitHub entegrasyonu  | Evet          | Sınırlı        |
| Web arayüzü          | Evet          | Hayır          |

### Kalite Gözlemleri

**Claude Code avantajları:**

- Daha iyi talimat takibi
- Daha az düzeltme gereksinimi
- Daha hızlı tamamlama

**OpenCode avantajları:**

- Daha fazla test yazdı
- Daha iyi UX
- Model esnekliği

## Bölüm 6: Aracınızı Seçmek

### Hızlı Karar Matrisi

| İstediğiniz...                | Seçin              |
| ----------------------------- | ------------------ |
| Resmi destek + kararlılık     | **Claude Code**    |
| Ücretsiz + model esnekliği   | **OpenCode**       |
| Maksimum otomasyon            | **oh-my-opencode** |

### Senaryoya Dayalı Öneriler

**AI Kodlamaya Yeni Başlayan** — Öneri: OpenCode

Neden:
- Başlamak ücretsiz
- Farklı modellerle deney yapın
- Mali taahhüt olmadan öğrenin
- Yardım için büyük topluluk

**Profesyonel Geliştirici** — Öneri: Claude Code

Neden:
- Resmi destek
- Daha iyi talimat takibi
- Daha hızlı çalıştırma
- Kurumsal SLA'lar mevcut

**Maliyet Bilinçli Ekip** — Öneri: OpenCode + ChatGPT Plus

Neden:
- Geliştirici başına aylık $20
- GPT-4.1 ile iyi kalite
- Vendor lock-in yok

**Kalite Kritik Proje** — Öneri: Claude Code

Neden:
- En iyi kod kalitesi
- Daha iyi talimat takibi
- Daha az düzeltme gereksinimi

## Bölüm 7: Her İki Aracı Birlikte Kullanmak

### Otomatik Olarak Paylaşılanlar

| Dizin                        | Claude Code | OpenCode |
| ---------------------------- | ----------- | -------- |
| `~/.claude/skills/`          | Okur        | Okur     |
| `~/.config/opencode/skills/` | Hayır       | Okur     |
| `.claude/skills/`            | Okur        | Okur     |

**Sonuç**: `~/.claude/skills/` içindeki skills her iki araçla otomatik olarak çalışır.

### Manuel Senkronizasyon Gerektirenler

| Yapılandırma | Claude Code         | OpenCode             | Not                            |
| ------------ | ------------------- | -------------------- | ------------------------------ |
| MCP Servers  | `mcp.json`          | `opencode.json`      | Format dönüşümü gerekli        |
| Commands     | `.claude/commands/` | `.opencode/command/` | Dizini yeniden adlandırın      |
| Agents       | `.claude/agents/`   | `.opencode/agent/`   | Farklı frontmatter             |

## Bölüm 8: İleri Düzey Konular

### Otonom Mod (YOLO Modu)

> **SON DERECE DİKKATLİ KULLANIN** — Bu modlar tüm izin onaylarını atlar. Yalnızca güvenilir, izole ortamlarda kullanın.

### Claude Code

```bash
claude --dangerously-skip-permissions
```

**Güvenlik kısıtlamaları:**

- Root olarak veya sudo ile çalışmaz
- Tamamlanana kadar gözetimsiz çalışır
- Dosya düzenleme veya bash komut onayları yoktur

### OpenCode

```json
{
  "permission": {
    "*": "allow"
  }
}
```

### Ne Zaman Kullanılır

Uygun:

- İzole Docker container'ları
- Tek kullanımlık VM'ler
- Kontrollü kapsamda CI/CD pipeline'ları
- Otomatik test ortamları

Asla kullanmayın:

- Production sunucular
- Hassas veri içeren sistemler
- Paylaşılan geliştirme makineleri
- Güvenilmeyen prompt'lar çalıştırırken

### Hook'lar ve Sürekli Öğrenme

Claude Code, hook'lar aracılığıyla olay tabanlı otomasyonu destekler:

| Hook               | Ne Zaman Çalışır              |
| ------------------ | ----------------------------- |
| `PreToolUse`       | Bir araç çağrılmadan önce     |
| `PostToolUse`      | Bir araç çağrıldıktan sonra   |
| `SessionStart`     | Oturum başlangıcında          |
| `UserPromptSubmit` | Kullanıcı mesaj gönderdiğinde |
| `Stop`             | Ajan durduğunda               |

**Örnek: Düzenlemelerden sonra otomatik lint**

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{
        "type": "command",
        "command": "npx eslint --fix \"$CLAUDE_FILE_PATH\""
      }]
    }]
  }
}
```

### Claudeception: Sürekli Öğrenme Sistemi

**Sorun:** Claude her oturumda temiz başlar. 45 dakikalık bir hata ayıklama oturumu bir sonraki oturumda unutulur.

**Çözüm:** [Claudeception](https://github.com/blader/Claudeception), açık olmayan keşifleri otomatik olarak çıkarır ve yeniden kullanılabilir skills olarak kaydeder. Aynı sorun bir daha ortaya çıktığında Claude çözümü zaten bilir.

### OpenCode: Native Hook Sistemi Yok

| Özellik             | Claude Code              | OpenCode                   |
| ------------------- | ------------------------ | -------------------------- |
| Event hook'ları     | Evet (5 hook tipi)       | Hayır                      |
| Sürekli öğrenme     | Evet (Claudeception)     | Yalnızca manuel            |
| Otomatik lint       | Evet (PostToolUse)       | Harici araçlar             |
| Oturum belleği      | Evet (Hook'lar + Skills) | Yalnızca Skills (durumsuz) |

**OpenCode için geçici çözüm:** Harici otomasyon (shell script'ler, make hedefleri) kullanın veya topluluk plugin'lerini bekleyin.

### Topluluk Kaynakları

**Şablonlar ve Skills**

- [aitmpl.com](https://aitmpl.com/) — Ajanlar, komutlar, şablonlar
- [skills.sh](https://skills.sh/) — 200'den fazla yüklenebilir skill
- [Context7 CLI](https://github.com/upstash/context7) — Cross-platform skills

**Kurulum:**

```bash
npx skills add vercel/react-best-practices
npx ctx7 skills install better-icons
```

## Ek: Hızlı Başvuru

### Komut Karşılaştırması

| Görev           | Claude Code | OpenCode   |
| --------------- | ----------- | ---------- |
| Başlat          | `claude`    | `opencode` |
| Context temizle | `/clear`    | `/clear`   |
| Compact         | `/compact`  | N/A        |
| Plan modu       | `Shift+Tab` | Benzer     |
| Commit          | `/commit`   | `/commit`  |

### Dizin Yapısı

```text
# Global (kullanıcı düzeyi)
~/.claude/
├── CLAUDE.md           # Global bağlam
├── mcp.json            # MCP sunucuları
├── settings.json       # Hook'lar, tercihler
└── skills/             # Paylaşılan skills (OpenCode ile de çalışır)

# Proje düzeyi
.claude/
├── CLAUDE.md           # Proje bağlamı
├── agents/             # Özel ajanlar
│   ├── code-reviewer.md
│   └── security-auditor.md
├── commands/           # Özel slash komutları
│   └── git-pr.md
└── skills/             # Projeye özel skills
```

---
