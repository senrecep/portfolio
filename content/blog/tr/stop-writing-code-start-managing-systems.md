---
title: "Kod Yazmayı Bırakın, Sistemi Yönetin: AI Destekli Geliştirmenin Gerçek Potansiyeli"
description: "Claude Code'un birden fazla projede üretim ortamında kullanımına dair derin bir inceleme — kod yazmaktan AI sistemlerini orkestra etmeye geçiş, CLAUDE.md stratejisi, context yönetimi, hook'lar, agent'lar ve multi-agent iş akışları."
date: "2026-02-28"
slug: "stop-writing-code-start-managing-systems"
mediumUrl: "https://senrecep.medium.com/stop-writing-code-start-managing-systems-the-real-potential-of-ai-powered-development-71fafeb144de"
imageUrl: "/images/stop-writing-code-start-managing-systems.webp"
keywords: ["AI destekli geliştirme", "Claude Code", "multi-agent iş akışları", "context window", "CLAUDE.md stratejisi", "yazılım mühendisliği zihniyeti", "AI orkestrasyonu", "geliştirici verimliliği"]
author: "Recep Şen"
modifiedDate: "2026-02-28"
category: "AI"
faq:
  - q: "'Kod yazmayı bırakın, sistemi yönetin' pratikte ne anlama geliyor?"
    a: "Manuel olarak kod yazmaktan, sizin adınıza kod yazan, test eden ve inceleyen AI agent'larını yönlendirmeye geçmek anlamına geliyor. Kod yazarı olmak yerine, kısıtları tanımlayan, çıktıları inceleyen ve paralel çalışan birden fazla AI agent'ını orkestra eden bir sistem mimarı oluyorsunuz — tıpkı bir mühendislik ekibini yöneten bir CTO gibi."
  - q: "Claude Code'da kalite düşüşünü önlemek için context window kullanımını nasıl yönetmeliyim?"
    a: "Bir konuşmayı tek bir göreve odaklayın, context kullanımı %40'ı aştığında /compact çalıştırın ve oturumlar arasında kritik bilgileri saklamak için SCRATCHPAD.md kullanın. Büyük keşif görevlerini subagent'lara devredin çünkü onların context'i ana oturumdan bağımsızdır ve statik talimatlarla context harcamamak için CLAUDE.md'yi kısa tutun."
  - q: "Plan → Execute → Verify döngüsü nedir ve neden önemlidir?"
    a: "Plan → Execute → Verify döngüsü, önce AI'ın yaklaşımı planlamasını (salt okunur Plan Mode'da), ardından implementasyonu gerçekleştirmesini, sonra da işi kabul etmeden önce testler ve linting ile sonuçları doğrulamasını sağlayan yapılandırılmış bir iş akışıdır. Bu, kontrolsüz AI değişikliklerini önler, hataları erken yakalanabilir hale getirir ve daha öngörülebilir, incelenebilir çıktılar üretir."
---

## Giriş: AI Araçlarını Zaten Kullanıyordum

Bu makaleye "Claude Code nedir ve nasıl kurulur" diye başlamayacağım. Çünkü bunu okuyan insanların çoğu zaten bir AI aracı kullanıyor. Cursor, Copilot, Windsurf, belki ChatGPT; hepsini denedik, güçlü ve zayıf yönlerini gördük.

Ben de farksız değildim. Yıllardır yazılım geliştiriyorum ve son yıllarda AI araçlarını yoğun şekilde kullanıyordum. Cursor ile başladım, IDE içinde AI destekli geliştirmenin konforunun tadını aldım. Ama bir noktada duvara çarptım: projem büyüdükçe AI'ın yanıtlarının kalitesi düşmeye başladı. Çünkü IDE tabanlı araçlar size bir "asistan" sunuyor: siz yazıyorsunuz, o tamamlıyor. Güzel, ama sınırlı.

Claude Code'a geçtiğimde paradigma değişti. Bu bir asistan değil, bir geliştirme ortamı. Terminalde çalışan, dosyalarınızı okuyan, komutlar çalıştıran, git işlemleri yapan ve hatta paralel çalışmak üzere başka AI instance'ları başlatabilen bir sistem. Ama asıl güç, bu sistemi nasıl yapılandırdığınızda yatıyor.

Claude Code'u aylardır birden fazla projede, farklı teknoloji yığınlarında (.NET backend'lerden React Native mobil uygulamalara, Go servislerinden Next.js frontend'lere) üretim ortamında kullanıyorum. Bu makale, o ayların birikimi. Neyi doğru yaptım, neyi yanlış yaptım, hangi yaklaşımlar gerçekten işe yaradı.

Önemli bir not: bu makaleyi "şu düğmeye tıkla, şu komutu yaz" tarzında bir eğitim olarak değil, bir düşünce çerçevesi olarak okumanızı öneririm. Çünkü AI araçlarının gerçek gücü hangi düğmeye bastığınızdan değil, nasıl düşündüğünüzden gelir.

## Bölüm 1: Bir Zihniyet Değişimine İhtiyacınız Var

### Junior Developer Gibi Değil, CTO Gibi Düşünün

AI destekli geliştirmede en yaygın hata, AI'ı "benim yerime kod yazan bir şey" olarak görmektir. "Şu fonksiyonu yaz," "şu bug'ı düzelt," "şu API'yi ekle"; bunlar geçerli istekler, ama resmin sadece küçük bir parçası.

Gerçek verimlilik, bir projeye A'dan Z'ye bir CTO gibi yaklaştığınızda ortaya çıkar:

- **Planlama**: Ne inşa ediyoruz ve neden?
- **Mimari**: Nasıl yapılandıracağız?
- **Geliştirme**: Nasıl implement edeceğiz?
- **Test**: Doğru çalıştığını nasıl doğrulayacağız?
- **Güvenlik**: Güvenlik açıklarını nasıl tespit edeceğiz?
- **Performans**: Yeterince hızlı mı?
- **Dağıtım**: Nasıl yayına alacağız?

Claude Code'un gerçek gücü, bu yaşam döngüsünün her aşamasında size yardımcı olabilmesidir. Sadece "kod yazma" aşamasında değil. Ve bu makalede bu yaklaşımı detaylı olarak anlatacağım.

### Olasılıksal Düşünmeyi Öğrenin

AI deterministik bir makine değildir. Aynı prompt'u iki kez verin, farklı sonuçlar alabilirsiniz. Bu bir bug değil, çalışma prensibidir. Bu prensibi anladığınızda, AI ile çalışma şekliniz temelden değişir:

- **İlk denemede mükemmel sonuç beklemeyin.** İteratif çalışın. İlk çıktıyı inceleyin, geri bildirim verin, tekrar deneyin.
- **Doğrulama mekanizmaları kurun.** AI "bitti" dedi diye bitmez. Build'in çalıştığını, testlerin geçtiğini, güvenlik taramalarının temiz döndüğünü doğrulayın.
- **Deterministik katmanlar ekleyin.** Hook'lar, linter'lar, test suite'leri; bunlar AI'ın olasılıksal doğasının üzerine kesinlik katmanlarıdır.

Bu zihniyetle başladığınızda, geri kalan her şey çok daha kolay hale gelir.

### Düşünce Hızında Çalışmayı Öğrenin

AI ile çalışırken en büyük darboğazın ne olduğunu biliyor musunuz? AI'ın hızı değil; sizin girdi sağlama hızınız. Bir bug fark ediyorsunuz, terminale geçmeniz, sorunu tanımlamanız, ekran görüntüsü alıp yapıştırmanız, tekrar geri dönmeniz gerekiyor. Her bağlam geçişinde odağınızı kaybediyorsunuz, düşünce silsilesi buharlaşıyor.

Çözüm: düşündüğünüz anda AI'a girdi verebildiğiniz bir iş akışı kurmak. Bu, konuşmadan metne araçları, akıllı pano yöneticileri ve görsel referansların (ekran görüntüleri, URL'ler) hızlı paylaşımını içerir. Bir insanla çalışır gibi, "bak, şu kısım bozuk, şunu da düzelt, ha bir de şu var" diyebilmek gibi.

Bu konuyu ilerleyen bölümlerde detaylı olarak ele alacağım. Ama şimdilik şunu aklınızda tutun: AI ile çalışırken sizi yavaşlatan AI değil; bilgiyi AI'a aktarma hızınızdır.

## Bölüm 2: CLAUDE.md: Projenizin Stratejik Beyni

### En Önemli Dosya

CLAUDE.md, Claude Code'un her konuşmanın başında otomatik olarak okuduğu proje talimat dosyasıdır. Claude her oturumda sıfırdan başlar; önceki konuşmaları hatırlamaz. Ama bu dosya sayesinde projenizi "bilir."

Bu dosya, Claude Code deneyiminizin kalitesini belirleyen en önemli tek faktördür. İyi bir CLAUDE.md ile ortalama bir geliştirici bile etkili sonuçlar alır. Kötü bir CLAUDE.md ile uzman bir geliştirici bile sinir olur.

### Az Çoktur: 100 Satır Kuralı

İlk CLAUDE.md dosyam 160 satırı aşıyordu. Her kuralı, her komutu detaylı olarak yazmıştım. Sonuç? Claude önemli bilgileri kaçırıyordu. Uzun dosya = dağınık dikkat.

Çözüm: CLAUDE.md'nizi 100 satırın altında tutun. Detayları ayrı dosyalara taşıyın. Claude ihtiyaç duyduğunda o dosyalara bakacaktır.

```text
CLAUDE.md (70-100 lines)              - Always read
.claude/rules/architecture.md         - Referenced when needed
.claude/rules/security.md             - Referenced when needed
docs/claude/patterns.md               - Referenced when needed
```

Bu yaklaşıma "progressive disclosure" denir: bilgiyi kademeli olarak açığa çıkarmak.

### WHAT / WHY / HOW Yapısı

Etkili bir CLAUDE.md üç bölümden oluşur:

**WHAT**: Proje nedir? Teknoloji yığını, mimari yapı, temel kavramlar. Tek bir paragraf yeterlidir.

**WHY**: Bu kararları neden aldık? Bu kısım kritik. Claude "neden"i bildiğinde, sınır durumlarında çok daha iyi kararlar verir. Örneğin, sadece "console.log kullanma" demek yerine, "console.log kullanma çünkü üretim ortamında performans sorunlarına neden olur ve hassas verileri sızdırabilir" derseniz, Claude geliştirme sırasında geçici kullanımın kabul edilebilir olduğunu anlar.

**HOW**: Nasıl çalışıyoruz? Komutlar, test pattern'leri, adlandırma kuralları.

### "Yapma" Bölümü

CLAUDE.md'nize her zaman bir "Yapma" bölümü ekleyin. Claude'un bilinen eğilimleri vardır:

- Aşırı mühendislik eğilimi (ekstra soyutlamalar, gereksiz interface'ler)
- Çok fazla dosya oluşturma eğilimi (tek dosyada çözülebilecek şeyleri böler)
- İmkansız senaryolar için hata yönetimi ekleme eğilimi
- Docstring ve yorum ekleme eğilimi (istenmediğinde bile)
- Stub dosya oluşturma eğilimi (dosya var ama `return null`, `return {}`, `TODO`, `console.log` yer tutucularıyla dolu; dosyanın var olması gerçek implementasyon anlamına gelmez)

Bu eğilimleri CLAUDE.md'de açıkça belirtmek, gereksiz işlerden kaçınmanın en etkili yoludur.

### 3 Katmanlı Sınır Belirleme

Claude'a ne yapabileceğini, ne zaman sorması gerektiğini ve ne yapmaması gerektiğini açıkça söyleyin:

- **Her zaman yap**: Test yaz, testleri çalıştır, adlandırma kurallarına uy
- **Önce sor**: Veritabanı migration'ları, yeni dependency ekleme, büyük refactoring
- **Asla yapma**: Secret'ları commit'leme, lock dosyalarını düzenleme, testleri silme

Bu üç katman, Claude'a güvenle hareket edebileceği alanı gösterirken, tehlikeli alanlarda sizi bilgilendirmesini sağlar.

### Global CLAUDE.md

`~/.claude/CLAUDE.md` dosyası, tüm projelere uygulanan global talimatları içerir. İletişim tercihlerimi (özetler Türkçe, teknik terimler İngilizce), sık kullanılan CLI araçlarını ve genel çalışma prensiplerimi burada tanımlıyorum. Bu sayede her projede tekrarlamama gerek kalmıyor.

### Yola Özel Kurallar: Doğru Kural, Doğru Dosya

Şöyle bir senaryo: tüm test dosyalarınıza aynı kuralları uygulamak istiyorsunuz. Ama test dosyaları 50 farklı dizine dağılmış. Her dizine ayrı bir CLAUDE.md mi koyacaksınız? Tabii ki hayır.

`.claude/rules/` dizininde dosya pattern'ine göre kurallar tanımlayabilirsiniz:

```text
---
paths: ["**/*.test.tsx"]
---
Use AAA (Arrange-Act-Assert) pattern in test files.
Prefer real database connections over mocks.
```

`**/*.test.tsx` pattern'i, hangi dizinde olursa olsun tüm kod tabanındaki test dosyalarını yakalar. Aynı mantık geçerli: API endpoint'leri için `**/*.api.ts`, Terraform dosyaları için `terraform/**/*` — her biri kendi özel kurallarıyla.

Bir de context avantajı var: bu kurallar yalnızca eşleşen dosyalar düzenlenirken yüklenir. Context'te kalıcı olarak yer kaplamazlar, yalnızca ilgili olduklarında devreye girerler.

## Bölüm 3: Context Window: Anlaşılması Gereken En Kritik Kavram

### Nedir ve Neden Bu Kadar Önemli?

Context window, Claude'un çalışma belleğidir. Her mesaj, okunan her dosya, her komut çıktısı bu ortak bütçede birikir. Opus'ta bu bütçe yaklaşık 200.000 token'dır.

Çoğu geliştirici, context %100'e ulaşana kadar her şeyin düzgün çalışacağını varsayar. Bu çok yanlış bir varsayımdır.

**Gerçek:** Context %20-40'a ulaştığında kalite düşmeye başlar. %60'tan sonra Claude önceki talimatları unutur, aynı hataları tekrarlar, yanlış dosyaları düzenler.

Bu, Claude Code kullanırken farkında olmanız gereken en önemli teknik gerçekliktir.

Ama sorun sadece context'in "dolması" değil — aynı zamanda aktif olarak **çürümesidir**. Ben buna "context rot" diyorum.

Eski tool çıktıları, zaten düzeltilmiş bug'lardan kalan debug izleri, refactor edilmiş dosyaların eski versiyonları — hepsi context'te birikir. Model güncel olanı eskimiş olandan ayırt edemez. Bayatlamış bilgi sadece yer kaplamaz; aktif olarak zarar verir. Model eski veriyi güncelmiş gibi ele alır ve onun üzerine kararlar verir: yeniden adlandırılmış değişkenlere referans verir, değişmiş pattern'leri takip eder.

Bu yüzden çoğu multi-agent sistemi 3-4 görevden sonra duvara çarpar. Model aptallaşmadı. Context zehirlendi.

### Bir Konuşma = Bir Görev

Bu kuralı kesinlikle uygulayın. Auth sistemi + veritabanı şeması + UI bileşenleri + test yazma; hepsini tek bir konuşmada yapmaya çalışmayın. Her biri ayrı bir oturum olmalı.

"Ama context'i az önce açıkladım, yeni oturumda tekrar mı açıklamam gerekecek?" diye düşünebilirsiniz. Hayır. CLAUDE.md projenizi bilir, project-memory mevcut durumu bilir. Yeni oturum sıfırdan başlamaz.

### Oturumlar Arası Hafıza

Claude stateless'tır; her konuşma sıfırdan başlar. Oturumlar arasında bilgi taşımanın çeşitli yöntemleri var. Ben OMC (oh-my-claudecode) plugin'inin project-memory özelliğini kullanıyorum. Teknoloji yığını, mimari kararlar, convention'lar, önemli notlar ve direktifler gibi bilgileri JSON formatında saklayan, projeye özel kalıcı bir hafıza sistemidir ve her oturumda otomatik olarak erişilebilir.

Hangi aracı kullanırsanız kullanın, önemli olan prensip şudur: oturum sonunda önemli bilgileri kaydedin, oturum başında okuyun.

### Pratik Context Yönetimi

1. **HUD'u (Heads-Up Display) Kullanın**: Claude Code'un terminal durum çubuğunda bir HUD'u var. Bu HUD size gerçek zamanlı bilgi gösterir:

- Aktif model (Opus, Sonnet, Haiku)
- Oturum süresi
- Harcanan token sayısı
- Mevcut maliyet ve saatlik maliyet oranı
- Cache hit oranı
- İzin modu (Normal, Auto-Accept, Bypass); Shift+Tab ile geçiş yapılır

**Context doluluk çubuğu**: en kritik bilgi parçası. Bu çubuğu sürekli izlemek, context yönetiminin temelidir. Dolmaya başladığında ve aksiyon almanız gerektiğinde görsel olarak fark edeceksiniz.

`/compact` **zamanlaması**: Context %40-50'ye yaklaştığında proaktif olarak kullanın. %70'i aşmasını beklemeyin. HUD'daki context çubuğu bu zamanlamayı görsel olarak takip etmeyi kolaylaştırır.

`/clear` **ile temiz başlangıç**: Bir görev tamamlandığında veya konu değiştiğinde yeni bir oturum başlatın.

**Bilgi sıralaması önemlidir**: AI modelleri uzun girdilerin başını ve sonunu iyi işler ama ortaya gömülü bilgileri kaçırabilir. Uzun bir analiz sonucu veya hata logu gönderiyorsanız, en kritik bilgiyi başa koyun. "Bu fonksiyonda null pointer var, ilgili log çıktısı aşağıda" diye başlamak, 500 satırlık bir logun ortasına gömülü bir ipucundan çok daha etkilidir.

**Kırmızı bayraklar**: Claude kendini tekrarlıyorsa, önceki context'i unutuyorsa, yanlış dosyaları düzenliyorsa, context temizliği zamanı gelmiş demektir.

### CLAUDE.md Boyutunun Gizli Maliyeti

CLAUDE.md her oturumda otomatik yüklenir. 2.000 token'lık bir CLAUDE.md, her mesaja ekstra maliyet ekler. 1.000 mesaj boyunca bu, göz ardı edilemeyecek gizli bir maliyet haline gelir. CLAUDE.md'nizi kısa ve odaklı tutmanın bir nedeni daha.

## Bölüm 4: Derin Araştırma: AI'dan Maksimum Değer Elde Etmek

### Neden Önemli?

Derin araştırma, AI kullanım yolculuğumda en büyük verimlilik artışını sağlayan yaklaşımdır. Bir projeye başlamadan veya karmaşık bir karar vermeden önce AI'ın "derin düşünme" modunu kullanarak kapsamlı araştırma yapmak, saatlerce sürecek deneme yanılmayı dakikalara indirebilir.

### İş Akışım

Derin araştırmayı tek bir araca bağlamıyorum. Claude.ai, ChatGPT, Gemini; hepsinin derin araştırma veya benzeri modları var ve her birinin farklı güçlü yönleri var. Önemli olan araç değil, süreçtir:

**Adım 1: Bir konuşmayla başlayın.** Konu hakkında AI ile sohbet edin. Ama sadece soru sormayın; AI'ın size soru sormasını isteyin. "Bu konu hakkında bana sorular sor, gereksinimlerimi anlayalım" deyin. Bu adım kritik çünkü AI'ın hangi bilgiye ihtiyaç duyduğunu ortaya çıkarır.

**Adım 2: AI'ın sorularını yanıtlayın.** AI size 10-15 soru soracaktır. Yanıtlayın. Bu süreç hem kendi düşüncenizi netleştirir hem de AI'a zengin context sağlar.

**Adım 3: Derin araştırma prompt'unu oluşturun.** Konuşmanın sonunda AI'a "şimdi bu konuşmaya dayanarak bana bir derin araştırma prompt'u oluştur" deyin. AI, konuşmadaki tüm bağlamı içeren detaylı, odaklı bir araştırma prompt'u üretecektir.

**Adım 4: Derin araştırmaya gönderin.** Bu prompt'u Claude.ai'ın extended thinking moduna, ChatGPT'nin deep research moduna veya Gemini'nin deep research özelliğine gönderin. Sonuçları karşılaştırın.

**Adım 5: Sonuçları Claude Code'a getirin.** Araştırma sonuçlarını Claude Code oturumunuza getirin. Artık projenize sağlam bir bilgi temeli ile başlıyorsunuz.

### Derin Araştırmayı Ne Zaman Kullanmalısınız?

- Yeni bir teknoloji veya framework seçerken
- Karmaşık mimari kararlar (monolit vs mikroservis, event-driven vs request-driven)
- Performans optimizasyon stratejileri
- Güvenlik yaklaşımı belirlerken
- Büyük bir refactoring öncesi strateji
- Aşina olmadığınız bir alandaki en iyi pratikler

### Önemli Nokta

Derin araştırma "Google'da arama yapmak" değildir. AI'ın büyük miktarda bilgiyi sentezleyip, kaynaklarıyla birlikte sizin özel durumunuza özel detaylı bir analiz sunmasıdır. Bu çıktılar, doğrudan CLAUDE.md'ye veya proje dokümantasyonuna eklenerek Claude Code oturumlarınızın kalitesini dramatik şekilde artırabilir.

## Bölüm 5: İzin Modları ve Plan-Execute-Verify Döngüsü

### İzin Modları

Claude Code'da `Shift+Tab` ile üç izin modu arasında geçiş yapabilirsiniz:

**Normal Mode**: Her dosya düzenlemesi ve komut çalıştırması için onay ister. En güvenli, en yavaş.

**Auto-Accept Mode**: Dosya düzenlemelerini otomatik olarak onaylar. "Ne yaptığını biliyorsun, devam et" demenin yolu. Bash komutları için hâlâ onay ister.

**Bypass Mode**: Tüm izinleri otomatik olarak onaylar. Güvenilir, iyi tanımlanmış görevlerde işleri hızlandırır. Ama dikkatli kullanın; Claude'un attığı her adımı izlemeye devam edin.

### Plan Mode: Ayrı Bir Çalışma Modu

Plan Mode, izin modlarından bağımsız bir çalışma modudur. Bu modda Claude hiçbir değişiklik yapamaz; yalnızca analiz eder ve plan önerir. Büyük değişikliklerden önce strateji belirlemek için inanılmaz değerlidir.

Ama Plan Mode'a girmeden önce bir adım var: **hizalama**. AI'a "bir auth sistemi kur" dediğinizde, ilk 5 dakikada 30 karar verir: JWT mı session mı, e-posta doğrulama var mı yok mu, OAuth mı sadece şifre mi, hata mesajları nasıl görünmeli. Sonucu görene kadar hangi kararları verdiğini bilemezsiniz.

Çözüm: planlamadan önce AI'ın gri alanları belirlemesini ve size somut sorular sormasını sağlayın. Şöyle deyin: "Bu özelliği planlamadan önce, gri alanları ve birden fazla makul yaklaşımın olduğu noktaları belirle, sonra bana sor." AI'ın belirsiz noktaları yapılandırılmış seçenekler olarak sunmasını sağlayın: "Oturum yönetimi: A) JWT refresh rotation, B) Redis sunucu taraflı oturum, C) sizin tercihiniz."

Bu 10 dakikalık hizalama oturumu, implementasyon ortasında yön düzeltmekten çok daha ucuzdur — hem token hem de zaman açısından.

### Plan -> Execute -> Verify Döngüsü

Bu, en verimli çalışma kalıbı ve CTO zihniyetinin pratik uygulamasıdır:

1. **Plan Mode'a geçin**: Claude'un projeyi analiz etmesine ve ne yapacağını planlamasına izin verin
2. **Planı inceleyin**: Mantıklı mı? Eksik bir şey var mı? Gerekirse düzeltme isteyin
3. **Auto-Accept'e geçin**: Claude'un planı uygulamasına izin verin
4. **Doğrulayın**: Build çalışıyor mu? Testler geçiyor mu? Beklenen davranış sağlanıyor mu?

Burada kritik bir ayrım var: "tüm adımlar tamamlandı" doğrulama değildir. Gerçek doğrulama, sonuçları gözlemlemektir. Doğrulama kriterlerini tanımlarken üç katmanda düşünün:

- **Davranışsal**: "Kullanıcı giriş yapabiliyor mu?" Çalıştırıp gözlemlemeniz gerekir.
- **Yapısal**: "auth.ts gerçek bir implementasyon mu, yoksa TODO'lar ve `return null` ile dolu bir stub mı?" Dosyanın var olması yetmez; içeriğin gerçek olması gerekir.
- **Bağlantısal**: "Login handler, auth modülündeki fonksiyonu gerçekten import edip kullanıyor mu?" Dosyalar birbirinden bağımsız olarak var olabilirken birbirine bağlı olmayabilir.

Bu yaklaşıma "hedefe geriye dönük doğrulama" diyorum. "Ne yaptım?" yerine "ne olması gerekiyordu ve oluyor mu?" diye sorarsınız. AI destekli geliştirmede özellikle kritik, çünkü AI'ın en yaygın başarısızlık modu şudur: dosyalar var, build geçiyor, ama parçalar birbirine bağlı değil.

Bu döngüyü özellikle birden fazla dosyayı etkileyen değişiklikler için kullanıyorum. Claude'un ne yapacağını önce görmek, sonra onaylamak hem zaman kazandırır hem de hata riskini azaltır.

## Bölüm 6: Hook'lar: Deterministik Güvenlik Ağları

### Felsefe

Hook'ları şöyle düşünün: Claude bir olasılık makinesidir. Çoğu zaman doğru şeyi yapar, ama bazen yapmaz. Hook'lar, "kesinlikle yapmaması gereken şeyleri yapamayacağını" garanti eden mekanik kilitlerdir.

AI'ın olasılıksal doğasına deterministik garantiler ekliyorsunuz. Bu, tüm AI destekli geliştirmedeki en önemli güvenlik prensibidir.

Kural basit: tek bir başarısızlık mali zarara veya güvenlik riskine yol açabiliyorsa, deterministik garanti şarttır. Gerisi prompt'larla yönetilebilir.

### Hook Türleri

Claude Code, beş farklı noktada hook çalıştırmanıza izin verir:

- **PreToolUse**: Bir tool çağrılmadan önce (engelleme yeteneği)
- **PostToolUse**: Bir tool çağrıldıktan sonra (doğrulama yeteneği)
- **SessionStart**: Bir oturum başladığında (ortam kurulumu)
- **UserPromptSubmit**: Kullanıcı mesaj gönderdiğinde (girdi kontrolü)
- **Stop**: Agent durduğunda (temizlik)

### Başlangıç İçin 3 Hook

Tüm hook ekosistemini bir anda kurmaya çalışmak yerine, şu üçüyle başlayın:

**1. Tehlikeli Git Koruması (PreToolUse:Bash)**: `git push --force`, `git reset --hard`, `git checkout .` gibi yıkıcı git komutlarını engeller. Bu hook tek başına beni sayısız kez kurtardı.

**2. Conventional Commits (PreToolUse:Bash)**: Commit mesajlarının `feat(scope): description` formatına uymasını zorunlu kılar. Bu hook olmadan Claude bazen "fix stuff" gibi anlamsız commit mesajları oluşturuyor.

**3. Convention Guard (PostToolUse:Edit|Write)**: Her dosya yazımında projenize özel kuralları kontrol eder. Örneğin, bir TypeScript projesinde: `any` tip kullanımı, `console.log` kalıntıları, `@ts-ignore` kullanımı.

### İleri Düzey: Architecture Guard

Bu, backend projemizdeki en değerli hook. Her dosya değişikliğinde Clean Architecture katman ihlallerini otomatik olarak kontrol eder. Örneğin, Domain katmanında EF Core import'u veya Application katmanında Infrastructure referansı varsa, hook yakalar ve engeller.

Bunun gibi domain'e özel hook'lar, projenizin mimari bütünlüğünü AI kaynaklı hatalara karşı korur.

## Bölüm 7: Custom Agent'lar: Uzman AI Ekibinizi Kurun

### Agent Nedir?

Agent, belirli bir görev için uzmanlaşmış bir Claude instance'ıdır. `.claude/agents/` dizininde markdown dosyaları olarak yaşarlar. Her agent'ın bir system prompt'u, tool kısıtlamaları ve model seçimi vardır.

### Custom Agent'ları Neden Kullanmalısınız?

Genel amaçlı Claude'a "güvenlik incelemesi yap" demekle, güvenlik konusunda uzmanlaşmış bir agent'a aynı şeyi demek arasında ciddi bir kalite farkı vardır. Çünkü custom bir agent:

- Tool kısıtlamaları sayesinde **yalnızca yapması gerekeni yapar**
- **Odaklanmış context ile çalışır** (yalnızca kendi alanıyla ilgili bilgiler yüklenir)
- **Tutarlı yaklaşım sergiler** (her seferinde aynı kontrol listesini takip eder)
- **Alan bilgisi taşır** (OWASP kontrol listesi, projeye özel güvenlik kuralları)

### Temel Agent Stratejisi

Her proje için en az şu ikisini oluşturmanızı öneririm:

**Code-reviewer agent**: Kod kalitesi, pattern uyumu, SOLID prensipleri, adlandırma kurallarını kontrol eder. Model olarak Sonnet yeterlidir.

**Debugger agent**: Hata analizi, kök neden tespiti, log incelemesi yapar. Read ve Bash tool'larıyla sınırlayın; düzeltmeyi siz onaylayın.

## Bölüm 8: Multi-Agent Çalışma: Gerçek Güç Çarpanı

### Subagent'lar ve Context Avantajı

**Subagent'lar**, kısa ömürlü, odaklı görevler için oluşturulan bağımsız Claude instance'larıdır. Kritik nokta şudur: her subagent'ın kendi bağımsız context'i vardır. Bu ne demek?

Ana oturumunuz context'inin %40'ını zaten kullanmış olsa bile, bir subagent tamamen temiz bir context ile başlar. Bu, context yönetimi açısından devrim niteliğinde bir avantajdır. Araştırma görevlerini, kod incelemelerini ve dosya aramalarını subagent'lara devrettiğinizde, ana oturumunuzun context'i şişmez.

### Team'ler: Kalıcı Koordinasyon

Agent Team'ler, birden fazla Claude Code instance'ını bir ekip olarak koordine etmenize olanak tanır. Subagent'lardan farklı olarak: ekip üyeleri kalıcıdır, birbirlerine mesaj gönderebilir ve paylaşımlı görev listesine erişebilir.

**Subagent'ları ne zaman kullanmalı?**

- Tek seferlik görevler: dosya arama, hızlı kod incelemesi, format kontrolü
- Devam etmeden önce sonucu beklemeniz gereken görevler

**Team'leri ne zaman kullanmalı?**

- Kapsamlı PR incelemesi (güvenlik + kalite + performans + test kapsamı paralel olarak)
- Büyük feature geliştirme (backend + frontend + test paralel olarak)
- Karmaşık refactoring (birden fazla modül eş zamanlı)

### Pratik Senaryo: Kapsamlı Kod İncelemesi

Bir PR incelemeniz gerekiyor. CTO gibi düşünün: sadece "kod güzel mi?" diye sormayın, tüm boyutları inceleyin:

```text
Team Lead (you): Coordination
Teammate 1: Security review (OWASP, input validation, auth)
Teammate 2: Code quality (patterns, SOLID, cleanliness)
Teammate 3: Performance analysis (N+1 queries, memory leaks, caching)
Teammate 4: Test coverage (missing tests, edge cases)
```

4 agent paralel çalışır, her biri kendi uzmanlık alanında derinlemesine inceleme yapar. Sonuçlar kapsamlı bir inceleme raporunda birleştirilir. Bunu tek başınıza yapmaya çalışsanız saatler sürer; paralel agent'larla dakikalar içinde tamamlanır.

## Bölüm 9: Model Routing: Doğru İş İçin Doğru Model

### Üç Model, Üç Amaç

**Haiku**: Hızlı, ucuz. Basit aramalar, dosya bulma, format kontrolleri, hızlı sorular için ideal.

**Sonnet**: Dengeli. Standart implementasyon, debugging, kod incelemesi ve günlük işlerin çoğu için varsayılan tercihiniz olmalı.

**Opus**: Derin akıl yürütme. Karmaşık mimari kararlar, zor bug'lar, büyük refactoring, güvenlik denetimleri için.

### Strateji

Kural basit: varsayılan olarak Sonnet kullanın. Yalnızca gerçekten ihtiyaç duyduğunuzda Opus'a geçin. Basit görevleri Haiku'ya yönlendirin.

Bu stratejinin maliyet etkisi muazzamdır. Her şey için Opus kullanmak yerine, akıllı yönlendirme günlük maliyetlerinizi %60-70 oranında düşürebilir.

## Bölüm 10: Çapraz Model Orkestrasyonu: Farklı AI'ları Birlikte Kullanmak

### Tek Bir Model Yetmez

En büyük verimlilik kazanımlarımdan biri, farklı AI modellerini birlikte kullanmaktan geldi.

**Claude Opus**: Ana orkestratör ve derin akıl yürütme. Karmaşık mimari kararlar, çok adımlı planlama, büyük resmi görme.

**OpenAI Codex/GPT**: Kod analizi, planlama doğrulaması, eleştirel düşünme. Özellikle farklı bir "bakış açısı" sağlamak için değerli.

**Google Gemini**: Büyük context avantajı (1M token). Birçok dosyayı aynı anda analiz etme, UI/UX tasarım incelemesi, detaylı dokümantasyon.

### Neden Önemli?

Her AI modelinin kendi güçlü yönleri, zayıf yönleri ve "kör noktaları" vardır. Tek bir modele bağımlı olduğunuzda, o modelin kör noktalarını fark edemezsiniz. Farklı modelleri birlikte kullanmak daha sağlam ve çok yönlü analiz sağlar.

## Bölüm 15: Test, Güvenlik ve Performans: CTO Kontrol Listesi

### AI Destekli Geliştirmede Test

AI ile kod yazmanın en büyük tuzağı: "şunu hızlıca bitireyim, testleri sonra yazarım." Testler olmadan AI'ın ürettiği kodu doğrulayamazsınız.

**Kural**: AI'a bir feature yazdırırken, aynı prompt'ta testleri de yazmasını isteyin. "Bu feature'ı implement et ve testlerini yaz, sonra testleri çalıştır" deyin. Prompt'a doğrulama kriterleri eklemek, en yüksek kaldıraç etkisine sahip pratiktir.

### Güvenlik Taraması

CTO zihniyetiyle, her PR öncesinde güvenlik kontrolleri yapın:

1. **Hardcoded secret taraması**: API key'leri, şifreleri, token'ları arama
2. **Input validation kontrolü**: Kullanıcı girdileri doğrulanıyor mu?
3. **OWASP Top 10 incelemesi**: SQL injection, XSS, CSRF riskleri var mı?
4. **Dependency güvenliği**: Bilinen güvenlik açıklarına sahip paketler var mı?

## Bölüm 16: Yapın ve Yapmayın

### Yapın

1. **Her proje için iyi bir CLAUDE.md yazın.** Bu dosya olmadan Claude projenizi bilmez.
2. **Context'i aktif olarak yönetin.** HUD'daki context çubuğunu ve maliyet bilgisini izleyin, `/compact` ile erken aksiyon alın, `/clear` ile temiz başlayın.
3. **Plan Mode'u alışkanlık haline getirin.** Büyük değişikliklerden önce ne yapılacağını görün, sonra onaylayın.
4. **Doğrulama kriterleri belirleyin.** "Test yaz" değil, "edge case'leri kapsayan testler yaz ve `npm test` ile çalıştır."
5. **Hook'larla güvenlik ağı örün.** En az 3 temel hook ile başlayın.
6. **Subagent'ları cömertçe kullanın.** Araştırma, inceleme ve arama görevlerini devredin. Ana context'inizi temiz tutun.
7. **Derin araştırma ile başlayın.** Karmaşık görevlerde önce araştırın, sonra implement edin.
8. **Model routing uygulayın.** Basit görevler için Haiku, varsayılan olarak Sonnet, derin analiz için Opus.
9. **Örnekle öğretin.** Üç paragraflık açıklama yerine, bir kod parçacığı gösterin.
10. **Oturumları kısa tutun.** Bir konuşma = bir görev. Uzun oturumlar = düşük kalite.

### Yapmayın

1. **Claude'u linter olarak kullanmayın.** ESLint, Biome, Prettier zaten var. "İki boşluk kullan" gibi kurallar context israfıdır.
2. **Her şeyi tek oturumda yapmayın.** Parçalara bölün. Context patlaması = kalite çöküşü.
3. **CLAUDE.md'yi romana çevirmeyin.** 100 satırın altında tutun. Progressive disclosure kullanın.
4. **Doğrulamadan güvenmeyin.** Claude'un "bitti" demesi yetmez. Build, test, güvenlik; doğrulayın.
5. **Aşırı mühendislik yapmasına izin vermeyin.** CLAUDE.md'de açıkça belirtin: "ekstra soyutlama ekleme, gereksiz interface oluşturma."
6. **Test yazmayı ertelemeyin.** Bu, AI destekli geliştirmenin en büyük tuzağıdır.

## Sonuç: Yolculuk Devam Ediyor

Claude Code benim için "terminalde AI" olarak başladı. Şimdi tam bir geliştirme ekosistemi. CLAUDE.md stratejisi, context yönetimi, hook pipeline'ları, custom agent'lar, multi-agent orkestrasyon, çapraz model kullanımı, kendi kendine öğrenen sistemler; bunların hepsini aylarca süren bir süreçte kademeli olarak öğrendim.

En önemli ders şudur: AI araçlarının gerçek gücü hangi düğmeye bastığınızdan değil, nasıl düşündüğünüzden gelir. CTO gibi düşünün: sadece kod yazmak değil, planlamak, test etmek, güvenliği sağlamak, performansı ölçmek ve bunların hepsini sistematik olarak yapmak.

**Başlamak için:**

1. İyi bir CLAUDE.md yazın
2. Context yönetimini öğrenin (%20-40 kuralı)
3. 3 temel hook'u kurun
4. Plan Mode'u alışkanlık haline getirin

Unutmayın: araçlarınızı keskinleştirmenin en iyi yolu, onları her gün kullanmaktır.
