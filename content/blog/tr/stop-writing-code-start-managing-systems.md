---
title: "Kod Yazmayı Bırakın, Sistemi Yönetin: AI Destekli Geliştirmenin Gerçek Potansiyeli"
description: "Claude Code'un birden fazla projede üretim ortamında kullanımına dair derin bir inceleme: kod yazmaktan AI sistemlerini orkestra etmeye geçiş, CLAUDE.md stratejisi, context yönetimi, hook'lar, agent'lar, multi-agent iş akışları ve doğrulamanın neden gerçek darboğaz olduğu."
date: "2026-02-28"
slug: "stop-writing-code-start-managing-systems"
mediumUrl: "https://senrecep.medium.com/stop-writing-code-start-managing-systems-the-real-potential-of-ai-powered-development-71fafeb144de"
imageUrl: "/images/stop-writing-code-start-managing-systems.webp"
keywords: ["AI destekli geliştirme", "Claude Code", "multi-agent iş akışları", "context window", "CLAUDE.md stratejisi", "yazılım mühendisliği zihniyeti", "AI orkestrasyonu", "geliştirici verimliliği", "AI doğrulaması", "paralel AI agent'ları"]
author: "Recep Şen"
modifiedDate: "2026-08-08"
category: "AI"
faq:
  - q: "'Kod yazmayı bırakın, sistemi yönetin' pratikte ne anlama geliyor?"
    a: "Manuel olarak kod yazmaktan, sizin adınıza kod yazan, test eden ve inceleyen AI agent'larını yönlendirmeye geçmek anlamına geliyor. Kod yazarı olmak yerine, kısıtları tanımlayan, çıktıları inceleyen ve paralel çalışan birden fazla AI agent'ını orkestra eden bir sistem mimarı oluyorsunuz, tıpkı bir mühendislik ekibini yöneten bir CTO gibi."
  - q: "Claude Code'da kalite düşüşünü önlemek için context window kullanımını nasıl yönetmeliyim?"
    a: "Bir konuşmayı tek bir göreve odaklayın, context kullanımı %40'ı aştığında /compact çalıştırın ve oturumlar arasında kritik bilgileri saklamak için SCRATCHPAD.md kullanın. Büyük keşif görevlerini subagent'lara devredin çünkü onların context'i ana oturumdan bağımsızdır ve statik talimatlarla context harcamamak için CLAUDE.md'yi kısa tutun."
  - q: "Plan → Execute → Verify döngüsü nedir ve neden önemlidir?"
    a: "Plan → Execute → Verify döngüsü, önce AI'ın yaklaşımı planlamasını (salt okunur Plan Mode'da), ardından implementasyonu gerçekleştirmesini, sonra da işi kabul etmeden önce testler ve linting ile sonuçları doğrulamasını sağlayan yapılandırılmış bir iş akışıdır. Bu, kontrolsüz AI değişikliklerini önler, hataları erken yakalanabilir hale getirir ve daha öngörülebilir, incelenebilir çıktılar üretir."
  - q: "AI destekli geliştirmede doğrulama neden darboğaz haline geliyor?"
    a: "Çünkü kod üretmek artık ucuz ve hızlı, ama işin gerçekten çalıştığını teyit etmek hâlâ insan dikkati gerektiriyor. Eklediğiniz her paralel agent inceleme yükünü katlıyor, yani gerçek verimliliğinizin sınırını AI'ın kod yazma hızı değil, testler, hook'lar ve reviewer agent'larla ne kadar doğrulamayı otomatikleştirebildiğiniz belirliyor."
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

Çözüm: düşündüğünüz anda AI'a girdi verebildiğiniz bir iş akışı kurmak. Benim için bu, bir hotkey'e bağlı konuşmadan metne dönüşüm (konuşmak yazmaktan daha hızlıdır ve prompt'lar dağınık dilbilgisine tolerans gösterir), son kopyaladığım her şeyi hatırlayan bir pano yöneticisi ve görsel bug'lar için anında ekran görüntüsü paylaşımı anlamına geliyor. Bir insanla çalışır gibi, "bak, şu kısım bozuk, şunu da düzelt, ha bir de şu var" diyebilmek gibi.

Bunu aklınızda tutun: AI ile çalışırken sizi yavaşlatan AI değil; bilgiyi AI'a aktarma hızınızdır.

## Bölüm 2: CLAUDE.md: Projenizin Stratejik Beyni

### Her Oturumun Başladığı Dosya

CLAUDE.md, Claude Code'un her konuşmanın başında otomatik olarak okuduğu proje talimat dosyasıdır. Claude her oturumda sıfırdan başlar; önceki konuşmaları hatırlamaz. Ama bu dosya sayesinde projenizi "bilir."

Bu dosya, Claude Code deneyiminizin kalitesini belirleyen en büyük faktörlerden biridir. İyi bir CLAUDE.md mühendislik becerisinin yerini tutmaz, ama kötü bir CLAUDE.md uzman bir geliştiriciyi bile sinir eder.

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

**HOW**: Nasıl çalışıyoruz? Komutlar, test pattern'leri, adlandırma kuralları. Burada örnekle öğretin: iyi bir kod parçacığı, bir convention'ı üç paragraflık açıklamadan daha iyi anlatır.

### "Yapma" Bölümü

CLAUDE.md'nize her zaman bir "Yapma" bölümü ekleyin. Claude'un bilinen eğilimleri vardır:

- Aşırı mühendislik eğilimi (ekstra soyutlamalar, gereksiz interface'ler)
- Çok fazla dosya oluşturma eğilimi (tek dosyada çözülebilecek şeyleri böler)
- İmkansız senaryolar için hata yönetimi ekleme eğilimi
- Docstring ve yorum ekleme eğilimi (istenmediğinde bile)
- Stub dosya oluşturma eğilimi (dosya var ama `return null`, `return {}`, `TODO`, `console.log` yer tutucularıyla dolu; dosyanın var olması gerçek implementasyon anlamına gelmez)

Bu eğilimleri CLAUDE.md'de açıkça belirtmek, gereksiz işlerden kaçınmanın en ucuz yoludur.

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

`**/*.test.tsx` pattern'i, hangi dizinde olursa olsun tüm kod tabanındaki test dosyalarını yakalar. Aynı mantık geçerli: API endpoint'leri için `**/*.api.ts`, Terraform dosyaları için `terraform/**/*`. Her biri kendi özel kurallarıyla.

Bir de context avantajı var: bu kurallar yalnızca eşleşen dosyalar düzenlenirken yüklenir. Context'te kalıcı olarak yer kaplamazlar, yalnızca ilgili olduklarında devreye girerler.

## Bölüm 3: Context Window: Anlaşılması Gereken En Kritik Kavram

### Nedir ve Neden Önemlidir

Context window, Claude'un çalışma belleğidir. Her mesaj, okunan her dosya, her komut çıktısı bu ortak bütçede birikir. Opus'ta bu bütçe yaklaşık 200.000 token'dır.

Çoğu geliştirici, context %100'e ulaşana kadar her şeyin düzgün çalışacağını varsayar.

**Gerçek:** Düşüş kademelidir ve çubuk dolu görünmeden çok önce başlar. %60'ı geçtiğinde Claude önceki talimatları unutur, aynı hataları tekrarlar, yanlış dosyaları düzenler. Pratik kuralım: %40 civarında aksiyon alın, %60'ı beklemeyin.

Ama sorun sadece context'in "dolması" değil; aynı zamanda aktif olarak **çürümesidir**. Buna "context rot" deniyor.

Eski tool çıktıları, zaten düzeltilmiş bug'lardan kalan debug izleri, refactor edilmiş dosyaların eski versiyonları: hepsi context'te birikir. Model güncel olanı eskimiş olandan ayırt edemez. Bayatlamış bilgi sadece yer kaplamaz; aktif olarak zarar verir. Model eski veriyi güncelmiş gibi ele alır ve onun üzerine kararlar verir: yeniden adlandırılmış değişkenlere referans verir, değişmiş pattern'leri takip eder.

Bu yüzden bu kadar çok multi-agent kurulumu birkaç görevden sonra dağılır. Model aptallaşmadı. Context zehirlendi.

Bir not: bu tablo sürekli iyileşiyor. Modeller her sürümde uzun oturumlarda daha dayanıklı hale geliyor; Claude Code da neyi compact edeceği, neyi özetleyeceği ve hafızaya neyi kaydedeceği konusunda giderek akıllanıyor. Bugünün terminal agent'ları, bir yıl önce raydan çıkacakları durumlarda, bazen pencere neredeyse doluyken bile tutarlı kalabiliyor. Bu yüzden bu bölümdeki eşikleri fizik kuralı gibi değil, bir mantalite olarak okuyun: oturumlarınızı gözle görülür şekilde daha etkili kılıyorlar, ama kesin kurallar değiller.

### Bir Konuşma = Bir Görev

Eşikler nerede olursa olsun geçerli olan bir alışkanlık var: bir konuşma, bir görev. Auth sistemi + veritabanı şeması + UI bileşenleri + test yazma; hepsini tek bir konuşmada yapmaya çalışmayın. Her biri ayrı bir oturum olmalı.

"Ama context'i az önce açıkladım, yeni oturumda tekrar mı açıklamam gerekecek?" diye düşünebilirsiniz. Hayır. CLAUDE.md projenizi bilir, oturum hafızanız ise mevcut durumu tutar (bunun nasıl olduğunu bir sonraki alt bölümde ele alıyoruz). Yeni oturum sıfırdan başlamaz.

### Oturumlar Arası Hafıza

Claude stateless'tır; her konuşma sıfırdan başlar. Oturumlar arasında bilgi taşımanın çeşitli yöntemleri var. Ben OMC (oh-my-claudecode) plugin'inin project-memory özelliğini kullanıyorum: teknoloji yığınını, mimari kararları, convention'ları, notları ve direktifleri JSON formatında saklayan, projeye özel bir depo ve her oturum bunu otomatik olarak okuyor.

Hangi aracı kullanırsanız kullanın, önemli olan prensip şudur: oturum sonunda önemli bilgileri kaydedin, oturum başında okuyun.

### Pratik Context Yönetimi

**HUD'u (Heads-Up Display) Kullanın**: Claude Code'un terminal durum çubuğunda bir HUD bulunur. Gerçek zamanlı bilgi gösterir:

- Aktif model (Opus, Sonnet, Haiku)
- Oturum süresi
- Harcanan token sayısı
- Mevcut maliyet ve saatlik maliyet oranı
- Cache hit oranı
- İzin modu (Normal, Auto-Accept, Bypass); Shift+Tab ile geçiş yapılır

**Context doluluk çubuğu**: izlenmesi gereken şey budur. Bunu takip etmek context yönetiminin temelidir; aksiyon alma zamanının geldiğini anında göreceksiniz.

**`/compact` zamanlaması**: Çubuk yukarıdaki eşiğe ulaştığında, kalite düşmeye başlamadan önce proaktif olarak çalıştırın.

**`/clear` ile temiz başlangıç**: Bir görev tamamlandığında veya konu değiştiğinde yeni bir oturum başlatın.

**Bilgi sıralaması önemlidir**: AI modelleri uzun girdilerin başını ve sonunu iyi işler ama ortaya gömülü bilgileri kaçırabilir. Uzun bir analiz sonucu veya hata logu gönderiyorsanız, en kritik bilgiyi başa koyun. "Bu fonksiyonda null pointer var, ilgili log çıktısı aşağıda" diye başlamak, 500 satırlık bir logun ortasına gömülü bir ipucundan çok daha etkilidir.

**Kırmızı bayraklar**: bu bölümün başında listelenen belirtiler (tekrar, unutulan context, yanlış dosyalar) context temizliğinin yaklaşmakta olmadığını, çoktan gecikmiş olduğunu gösterir.

### Ne Girdiğiniz, Ne Kadar Girdiğiniz Kadar Önemlidir

Hacim, context yönetiminin yalnızca yarısıdır. Diğer yarısı seçimdir. Herhangi bir şeyi context'e eklemeden önce uyguladığım üç filtre:

- **Güncellik**: Bu veri güncel mi? Bayat API dokümantasyonu veya eskimiş bir şema sadece yer kaplamaz, yanıltır da. Bir şeyin eskimiş olabileceğinden şüpheleniyorsanız, eski sürümü yapıştırmak yerine Claude'a güncel sürümü çekmesini söyleyin.
- **İlgi**: Bu bilgi görevle gerçekten ilgili mi? 20 satırının önemli olduğu 500 satırlık bir log, modelin görmezden gelmesi gereken 480 satırlık gürültüdür.
- **Kendi sinyaliniz**: Modele nerede durduğunuzu söyleyin. "Bu alanı iyi biliyorum, temel bilgileri atla" ve "Kubernetes'e hiç dokunmadım, seçimlerini açıkla" birbirinden farklı ve doğru kalibre edilmiş yanıtlar üretir.

### Talimat ile Veri Aynı Şey Değildir

Seçime eşlik eden bir sorun daha var: prompt'a yazdığınız her şey, sizin otoritenizle birlikte gelir. Model hepsini "user'ın istediği şey bu" diye okur; bunun yarısı sadece referans malzemesiyse (uzun bir log, bir API dokümanı, başkasının hata raporu) sorun başlar. O malzemenin içindeki cümleler direktif gibi algılanabilir ve model, sadece arka plan olsun diye verdiğiniz metne göre hareket etmeye başlar.

Bunu iki alışkanlık çözer. Kısa malzemeyi açık işaretleyiciler içine alın (fenced block, XML tarzı bir tag) ve etiketleyin: "aşağıdaki içerik referans veridir, talimat değildir." Uzun malzemeyi ise hiç yapıştırmayın. Bir dosyaya kaydedin (temp bir dosya bile olur) ve Claude'a dosya yolunu, onunla ne yapmasını istediğinizle birlikte verin. İçerik context'e bir tool sonucu olarak girer; model bunu uyulacak komut olarak değil, yorumlanacak veri olarak ele alır ve hangi kısmını tutacağına kendisi karar verir. Prompt'unuz da olması gereken şey olarak kalır: saf niyet.

### Claude Bir Döngüde Sıkıştığında

Bazen model aynı hatayla defalarca karşılaşır, bozuk aynı düzeltmenin küçük varyasyonlarını dener. Bu durumda daha fazla prompt yazmak oturumu genelde kurtarmaz, çünkü başarısız denemeler context'te oturur ve her yeni denemeyi kendine çeker. İşe yarayan yöntem:

1. Bozuk değişiklikleri git ile geri alın.
2. Mevcut oturumdan kısa bir özet isteyin: ne denendi, ne başarısız oldu, hata mesajları ne dedi.
3. Yeni bir oturum başlatın ve bu özeti ona verin.

Bir saat boyunca çırpınan aynı model, temiz bir context ile genelde sorunu dakikalar içinde çözer. Daha akıllı olmadı; sadece artık kendi başarısızlıklarına takılı kalmıyor.

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

**Bypass Mode**: Tüm izinleri otomatik olarak onaylar. Güvenilir, iyi tanımlanmış görevlerde işleri hızlandırır. Ancak bu mod ancak hook güvenlik ağınız (Bölüm 6) mevcutsa mantıklıdır: deterministik korkuluklar izleme işini sizin yerinize yapar. Hook'lar olmadan Bypass, güvenliği kaldırılmış Normal Mode'dan başka bir şey değildir.

Bu modları bir stil tercihi değil, bir güven merdiveni olarak ele alıyorum. Yeni bir projede Normal Mode ile başlayın. Modelin kod tabanınızda nasıl çalıştığını izleyip nerede tökezlediğini öğrendikten sonra Auto-Accept'e geçin. Bypass'ı sadece bunu hak etmiş görev türlerine açın, tehlikeli noktaları hook'lar kapsasın. İlk günden tam otonomi vermek, insanların silinmiş dosyalar ve force-push'lanmış branch'lerle sonuçlanmasının yoludur.

### Plan Mode: Ayrı Bir Çalışma Modu

Plan Mode, izin modlarından bağımsız bir çalışma modudur. Bu modda Claude hiçbir değişiklik yapamaz; yalnızca analiz eder ve plan önerir. Büyük değişikliklerden önce strateji belirlemek için inanılmaz değerlidir.

Ama Plan Mode'a girmeden önce bir adım var: **hizalama**. AI'a "bir auth sistemi kur" dediğinizde, ilk 5 dakikada 30 karar verir: JWT mı session mı, e-posta doğrulama var mı yok mu, OAuth mı sadece şifre mi, hata mesajları nasıl görünmeli. Sonucu görene kadar hangi kararları verdiğini bilemezsiniz.

Çözüm: planlamadan önce AI'ın gri alanları belirlemesini ve size somut sorular sormasını sağlayın. Şöyle deyin: "Bu özelliği planlamadan önce, gri alanları ve birden fazla makul yaklaşımın olduğu noktaları belirle, sonra bana sor." AI'ın belirsiz noktaları yapılandırılmış seçenekler olarak sunmasını sağlayın: "Oturum yönetimi: A) JWT refresh rotation, B) Redis sunucu taraflı oturum, C) sizin tercihiniz."

Bu 10 dakikalık hizalama oturumu, implementasyon ortasında yön düzeltmekten çok daha ucuzdur; hem token hem de zaman açısından.

### Plan -> Execute -> Verify Döngüsü

Bu, benim için en tutarlı şekilde karşılığını veren çalışma kalıbı ve CTO zihniyetinin pratik uygulamasıdır:

1. **Plan Mode'a geçin**: Claude'un projeyi analiz etmesine ve ne yapacağını planlamasına izin verin
2. **Planı inceleyin**: Mantıklı mı? Eksik bir şey var mı? Gerekirse düzeltme isteyin
3. **Auto-Accept'e geçin**: Claude'un planı uygulamasına izin verin
4. **Doğrulayın**: Build çalışıyor mu? Testler geçiyor mu? Beklenen davranış sağlanıyor mu?

Burada kritik bir ayrım var: "tüm adımlar tamamlandı" doğrulama değildir. Gerçek doğrulama, sonuçları gözlemlemektir. Doğrulama kriterlerini tanımlarken üç katmanda düşünün:

- **Davranışsal**: "Kullanıcı giriş yapabiliyor mu?" Çalıştırıp gözlemlemeniz gerekir.
- **Yapısal**: "auth.ts gerçek bir implementasyon mu, yoksa TODO'lar ve `return null` ile dolu bir stub mı?" Dosyanın var olması yetmez; içeriğin gerçek olması gerekir.
- **Bağlantısal**: "Login handler, auth modülündeki fonksiyonu gerçekten import edip kullanıyor mu?" Dosyalar birbirinden bağımsız olarak var olabilirken birbirine bağlı olmayabilir.

Bu yaklaşıma "goal-backward verification" (hedefe geriye dönük doğrulama) deniyor. "Ne yaptım?" yerine "ne olması gerekiyordu ve oluyor mu?" diye sorarsınız. AI destekli geliştirmede özellikle kritik, çünkü AI'ın en yaygın başarısızlık modu şudur: dosyalar var, build geçiyor, ama parçalar birbirine bağlı değil.

Bu döngüyü özellikle birden fazla dosyayı etkileyen değişiklikler için kullanıyorum. Claude'un ne yapacağını önce görmek, sonra onaylamak hem zaman kazandırır hem de hata riskini azaltır.

## Bölüm 6: Hook'lar: Deterministik Güvenlik Ağları

### Felsefe

Hook'ları şöyle düşünün: Claude bir olasılık makinesidir. Çoğu zaman doğru şeyi yapar, ama bazen yapmaz. Hook'lar, "kesinlikle yapmaması gereken şeyleri yapamayacağını" garanti eden mekanik kilitlerdir.

AI'ın olasılıksal doğasına deterministik garantiler ekliyorsunuz. Bu, AI destekli geliştirmenin temel güvenlik prensibidir.

Ayrım çizgisi şu: tek bir başarısızlık mali zarara veya güvenlik riskine yol açabiliyorsa, deterministik garanti şarttır. Gerisi prompt'larla yönetilebilir. Bununla birlikte, günlük sürtünmeyi azaltan ucuz hook'lar da edinmeye değer; sadece güvenlik açısından kritik olanlar kadar zorunlu değiller.

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

**3. Convention Guard (PostToolUse:Edit|Write)**: Her dosya yazımında projenize özel kuralları kontrol eder. Örneğin, bir TypeScript projesinde: `any` tip kullanımı, `console.log` kalıntıları, `@ts-ignore` kullanımı. İş bölümüne dikkat edin: linter'ınız zaten genel stil kurallarını mekanik olarak yakalıyor, o yüzden Biome veya ESLint'in bedavaya sağladığı şeyi Claude'a öğretmek için context harcamayın. Bu hook, yalnızca projenizin bildiği kurallar içindir.

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
- Karmaşık refactoring (yalnızca modüller gerçekten bağımsızsa; bkz. Bölüm 14)

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

Dürüst bir uyarı: dört agent dört rapor üretir ve birinin bunları uzlaştırması gerekir. Paralellik keşfi hızlandırır, ama inceleme çıktısını da katlar. Bir sentez adımı için bütçe ayırın, ya da daha iyisi, bulgular size ulaşmadan önce bir agent'a birleştirip tekrarları ayıklamasını yaptırın. Bölüm 11, verimliliğinizin sınırını üretim hızının değil, bu uzlaştırma maliyetinin belirlediğini ele alıyor.

## Bölüm 9: Model Routing: Doğru İş İçin Doğru Model

### Üç Model, Üç Amaç

**Haiku**: Hızlı, ucuz. Basit aramalar, dosya bulma, format kontrolleri, hızlı sorular için ideal.

**Sonnet**: Dengeli. Standart implementasyon, debugging, kod incelemesi ve günlük işlerin çoğu için varsayılan tercihiniz olmalı.

**Opus**: Derin akıl yürütme. Karmaşık mimari kararlar, zor bug'lar, büyük refactoring, güvenlik denetimleri için.

### Strateji

Kural basit: varsayılan olarak Sonnet kullanın. Yalnızca gerçekten ihtiyaç duyduğunuzda Opus'a geçin. Basit görevleri Haiku'ya yönlendirin.

Ama karmaşıklık tek eksen değil. Görev uzunluğu da önemlidir: uzun otonom çalışmalarda, bir modelin adım başına güvenilirliği ham zekasından daha çok sayar. Bölüm 13, bunun nedenini matematiksel olarak ele alıyor.

Yönlendirmenin maliyet etkisi gerçek. Yüzde noktasına kadar ölçmedim, ama her şeyi Opus'ta çalıştırmayı bıraktığımdan beri günlük harcamamdaki fark açıkça görülüyor, kabaca yarı yarıya veya daha fazla.

## Bölüm 10: Çapraz Model Orkestrasyonu: Farklı AI'ları Birlikte Kullanmak

### Tek Bir Model Yetmez

Farklı AI modellerini birlikte kullanmak, beklediğimden daha fazla karşılığını verdi.

**Claude Opus**: Derin akıl yürütme oturumları için orkestratörüm. Karmaşık mimari kararlar, çok adımlı planlama, büyük resmi görme. Bu, önceki bölümdeki Sonnet-varsayılan kuralıyla çelişmiyor: günlük implementasyon Sonnet'te kalır, Opus ise kararların yanlış gitmesinin maliyetli olduğu oturumlarda kendini kanıtlar.

**OpenAI Codex/GPT**: Kod analizi, planlama doğrulaması, eleştirel düşünme. Özellikle farklı bir "bakış açısı" sağlamak için değerli.

**Google Gemini**: Büyük context window (1M token), bir görev gerçekten çok sayıda dosyayı tek seferde okumayı gerektirdiğinde işe yarar. Ama büyük pencere bağışıklık anlamına gelmez: Bölüm 3'teki seçim kuralları burada da geçerlidir ve şişirilmiş bir 1M context, şişirilmiş bir 200k context ile aynı şekilde çürür.

### Neden Önemli?

Her AI modelinin kendi güçlü yönleri, zayıf yönleri ve "kör noktaları" vardır. Tek bir modele bağımlı olduğunuzda, o modelin kör noktalarını fark edemezsiniz. Farklı modelleri birlikte kullanmak daha sağlam ve çok yönlü analiz sağlar.

## Bölüm 11: Doğrulama Darboğazdır

### Üretmek Ucuz, Kontrol Etmek Değil

AI'ı orkestra etmeye başladığınızda kimsenin sizi uyarmadığı sorun şu: kod üretmek artık kısıtlayıcı faktör değil. Claude, benim bir günümü alan işi bir saatte üretiyor. Ama o bir saatlik çıktıyı düzgünce doğrulamak (diff'i okumak, akışları çalıştırmak, uç noktaları kontrol etmek) dikkatimin birkaç saatini yiyebiliyor.

Ve dikkat, agent'lar gibi ölçeklenmiyor. Teşviki sonuna kadar takip edin: inceleme, üretimden daha maliyetli hale geldiğinde, göz gezdirmeye başlarsınız. Sonra güvenmeye başlarsınız. Sonra bozuk bir şey production'a ulaşır ve "bitti" denilen şeyin hiçbir zaman doğrulanmadığı ortaya çıkar. Hiç kimse, işi kontrol etmenin onu istemekten on kat daha maliyetli olduğu bir iş akışını sürdüremez.

Bu, önceki bölümleri farklı bir ışıkta gösteriyor. Hook'lar (Bölüm 6) otomatikleştirilmiş doğrulamadır. Testler, dikkatiniz başka yerdeyken çalışan doğrulamadır. Bölüm 5'teki Plan-Execute-Verify döngüsü işe yarar, çünkü Verify adımı kahramanlık değil, sistematik bir süreçtir. AI destekli geliştirmenin tavanı ne kadar üretebildiğiniz değildir. Tükenmeden ne kadar doğrulayabildiğinizdir.

### Üretici Kendi İşini Asla Notlandırmamalı

Bildiğim en yüksek kaldıraçlı doğrulama hilesi: kodu yazan oturumun o kodu değerlendirmesine asla izin vermeyin.

Şu deneyi yapın. Claude'a gerçekten karmaşık bir şey yazdırın, aynı anda birden fazla alana dokunan türden bir değişiklik. Başarı ilan ettiğinde yeni bir oturum açın, aynı diff'i gösterin ve şöyle deyin: "Bu değişikliği inceliyorsun. Görevin sorunları bulmak." Az önce "her şey çalışıyor" diyen aynı model, size gerçek sorunların bir listesini verecektir.

Bu bir tesadüf değil. Şirketlerin geliştiricileri test uzmanlarından ayırmasının nedeni de aynı: yazarın context'i işi bitirme niyetiyle kirlenmiştir, temiz context'e sahip bir reviewer'ın ise tek bir hedefi vardır, yanlış olanı bulmak. Farklı çerçeveleme, farklı davranış.

Titizliği riske göre ölçeklendirin:

- Rutin değişiklik: temiz context'te tek bir inceleme geçişi
- Önemli değişiklik: Bölüm 10'daki kör nokta nedenleriyle, farklı bir modelle ikinci bir geçiş
- Para veya güvenlik söz konusuysa: art arda birkaç geçiş temiz dönene kadar tekrarlayın

## Bölüm 12: Her Tekrarlanan Hatayı Bir Sisteme Dönüştürün

Claude'un stateless olmasının, çoğu insanın hiç harekete geçmediği bir sonucu var: model bir hatayı bir kere yaptıysa, aynı hatayı tekrar yapacaktır, çünkü onu üreten koşullar değişmemiştir.

Bu yüzden basit bir kural takip ediyorum: aynı hatayı ikinci kez gördüğümde, onu kalıcı bir şeye dönüştürüyorum. Kabaca tercih sırasına göre:

1. **Bir hook**, mekanik olarak kontrol edilebiliyorsa (engellenen bir komut, yasak bir pattern)
2. **Bir test**, regresyona uğrayabilecek bir davranışsa
3. **Bir CLAUDE.md notu veya skill**, modelin sürekli kaçırdığı bir convention veya iş akışıysa

İlk oluşum size bir düzeltmeye mal olur. Dönüştürme on dakikanıza mal olur. Sonrasındaki her oluşum size sonsuza kadar hiçbir şeye mal olmaz.

Bunu atlarsanız, aritmetik tersine döner. Kod tabanınızda aktif çalışan bir modelin onlarca tekrarlayan hata modu vardır ve her biri ara sıra bile yeniden ortaya çıksa, gününüz tanıdık hataları düzeltmekle eriyip gider. Daha da kötüsü, hiçbir zaman iyileşmez, çünkü düzelttiğiniz hiçbir şey hiçbir yerde kalıcı hale getirilmemiştir.

Model oturumlar arasında öğrenmez, ama sisteminiz öğrenebilir. Hook'lar birikir. Testler birikir. CLAUDE.md daha da netleşir. Altı ay sonra model aynıdır; kurulumunuz tanınmaz hale gelmiştir. Kendi kendine öğrenen bir sistemin pratikte anlamı budur: daha akıllı bir model değil, daha akıllı bir harness.

## Bölüm 13: Uzun Süren Görevler: Güvenilirlik Katlanarak Artar

### %99,9 ve %99,99 Neden Neredeyse Aynı Değildir

Bir agent'ın bir görevin her adımını zamanın %99,9'unda doğru şekilde tamamladığını varsayalım. Kulağa mükemmel geliyor. Şimdi ona gece boyu süren türden uzun, otonom bir görev verin: bin adımlık okuma, düzenleme, çalıştırma, kontrol etme.

0,999'un 1000. kuvveti yaklaşık 0,37'dir. "Mükemmel" agent'ınız zamanın %37'sinde temiz bir çalıştırma tamamlar.

Şimdi adım başına %99,99'a sahip bir agent alın. Aynı bin adımda: yaklaşık %90 temiz çalıştırma. Yuvarlama hatası gibi görünen bir fark, geceyi güvenle bırakabileceğiniz bir agent'la bırakamayacağınız bir agent'ı birbirinden ayırıyor.

İki pratik sonuç var:

**Model seçimi görev uzunluğuyla değişir.** 20 dakikalık bir görev için en akıllı modeli seçin. 10 saatlik bir çalıştırma için en tutarlı olanı, kendi adımlarını çift kontrol edeni seçin. Hatalar katlandığında titizlik, zekayı yener.

**Checkpoint'ler katlanmayı kırar.** Yukarıdaki matematik, tek bir başarısızlığın her şeyi mahvettiğini varsayıyor, o yüzden başarısızlıkları geri döndürülebilir yapın:

- **Kilometre taşlarında commit'i zorunlu kılın.** Agent'a her tamamlanan parçadan sonra commit yapmasını söyleyin. Bir hata o zaman tüm çalıştırmaya değil, bir rollback'e mal olur.
- **Bir çalıştırma günlüğü tutun.** Agent'a bir dosya tutturun: ne tamamlandı, ne kaldı, ne ters gitti ve nasıl ele alındı. Kesintiye uğrayan bir çalıştırmayı, sıfırdan başlamak yerine bu dosyadan yeni bir agent devam ettirebilir.
- **Önceden bütçe belirleyin.** Zaman, token, kapsam. "Aynı sorunda üç denemeden sonra testler hâlâ başarısız oluyorsa, dur ve bildiklerini yaz" demek, agent'ın çıkışsız bir yolda tüm gece debelenmesine izin vermekten daha iyidir.

Uzun görevleri, yolda bir şeyin ters gideceğini varsayarak planlayın. Hiçbir şey ters gitmezse, harika. Ters giderse, çalıştırma bunu göğüsler.

## Bölüm 14: Doğru Yapılan Paralellik

### Agent Sayısı Bir Çarpan Değildir

Naif varsayım: 10 agent = 10x hız. 10 agent'ı bir kod tabanının aynı kısmına yönlendirdiğinizde gerçekte olan şu: her agent'ın doğru bir değişiklik yapmak için kodun tutarlı bir resmine ihtiyacı vardır ve o resmi oluştururken başka bir agent onu geçersiz kılar. Birbirlerinin işinin üzerine yazarlar, birbirlerinin varsayımlarını bozarlar ve akşamınızı hasarı çözmeye harcarsınız. On agent, sıfır hızlanma.

Paralellik, işin bağımlılık grafiğini takip ettiğinde işe yarar:

- **Gerçekten bağımsız alanlara göre bölün.** Frontend ve backend. Kod paylaşmayan iki servis. Ayrı git worktree'leri, bitince merge edilir. Hızlanmayı gerçek yapan şey bağımsızlıktır.
- **Bir yazar, çok okuyucu.** Değişiklikleri tek bir agent yaparken paralel subagent'lar ona araştırma besler: dosya keşfi, doküman arama, pattern arama. Yazmalar seri kalır, okumalar paralel çalışır, hiçbir şey çakışmaz.

### Paralelleştirmenin En Güvenli Olduğu Şey Keşiftir

Okumanın yan etkisi yoktur, bu da araştırmayı törensiz paralelleştirebileceğiniz tek yer yapar. Sürekli geri döndüğüm bir pattern: aynı soruyu iki veya üç agent'a bağımsız olarak verin, sonra başka bir agent'a raporlarını karşılaştırtın.

Değer, karşılaştırmada saklıdır. Raporlar çelişirse, bu orada belirsiz veya bozuk bir şey olduğuna dair güçlü bir sinyaldir; kendiniz bakın. Uyuşurlarsa, bunu kanıt yerine ölçülü bir kanıt olarak ele alın. Benzer verilerle eğitilmiş modeller kör noktalarını paylaşır ve aynı şekilde kendinden emin bir biçimde yanlış olabilir. Uyuşma aramayı daraltır; davayı kapatmaz.

Bir kural daha: tek agent döngüsü çalışmadan paralelleştirmeyin. Yön yanlışsa, on agent sizi yanlış yere on kat daha hızlı götürür. Önce sistemi sağlamlaştırın (context, doğrulama, checkpoint'ler), paralellik ancak o zaman zaten çalışan bir şeyin üzerine çarpan etkisi yapar.

## Bölüm 15: Test, Güvenlik ve Performans: CTO Kontrol Listesi

### AI Destekli Geliştirmede Test

AI ile kod yazmanın en büyük tuzağı: "şunu hızlıca bitireyim, testleri sonra yazarım." Testler olmadan AI'ın ürettiği kodu doğrulayamazsınız.

**Kural**: AI'a bir feature yazdırırken, aynı prompt'ta testleri de yazmasını isteyin. "Bu feature'ı implement et ve testlerini yaz, sonra testleri çalıştır" deyin. Doğrulama kriterleri size prompt'ta bir ekstra cümleye mal olur ve karşılığında gelen sonucu değiştirir.

### Güvenlik Taraması

CTO zihniyetiyle, her PR öncesinde güvenlik kontrolleri yapın:

1. **Hardcoded secret taraması**: API key'leri, şifreleri, token'ları arama
2. **Input validation kontrolü**: Kullanıcı girdileri doğrulanıyor mu?
3. **OWASP Top 10 incelemesi**: SQL injection, XSS, CSRF riskleri var mı?
4. **Dependency güvenliği**: Bilinen güvenlik açıklarına sahip paketler var mı?

### Performans: Optimize Etmeden Önce Ölçün

AI ile performans çalışmasının bir tuzağı var: model, işaret ettiğiniz şeyi gerçek sorun olup olmadığına bakmadan seve seve optimize eder. O yüzden sıra önemlidir: önce ölçün, sonra devredin. N+1 query kontrolü, eksik index, tek parça yüklenmek yerine stream edilmesi gereken payload için isteyin. Somut, kontrol edilebilir istekler ("bu endpoint'i profille ve zamanın nereye gittiğini göster") gerçek yanıtlar alır; "daha hızlı yap" ise tahmin işi verir.

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
10. **Oturumları kısa tutun.** Bir konuşma = bir görev. Context patlaması = kalite çöküşü.
11. **Tekrarlanan hataları sisteme dönüştürün.** Bir hatanın ikinci oluşumu bir hook, bir test veya bir CLAUDE.md notu kazanır (Bölüm 12).
12. **Üreteni doğrulayandan ayırın.** Temiz context'teki bir inceleme, yazan oturumun göremediğini görür (Bölüm 11).

### Yapmayın

1. **Claude'u linter olarak kullanmayın.** ESLint, Biome, Prettier zaten var. "İki boşluk kullan" gibi kurallar context israfıdır.
2. **CLAUDE.md'yi romana çevirmeyin.** 100 satırın altında tutun. Progressive disclosure kullanın.
3. **Doğrulamadan güvenmeyin.** Claude'un "bitti" demesi yetmez. Build, test, güvenlik; doğrulayın.
4. **Aşırı mühendislik yapmasına izin vermeyin.** CLAUDE.md'de açıkça belirtin: "ekstra soyutlama ekleme, gereksiz interface oluşturma."
5. **Test yazmayı ertelemeyin.** Test edilmemiş AI çıktısı, doğrulanmamış çıktıdır.
6. **Sistem çalışmadan paralelleştirmeyin.** Bozuk bir döngüdeki on agent, on kat daha hızlı kaybeder (Bölüm 14).

## Sonuç: Yolculuk Devam Ediyor

Claude Code benim için "terminalde AI" olarak başladı. Şimdi tam bir geliştirme ekosistemi. CLAUDE.md stratejisi, context yönetimi, hook pipeline'ları, custom agent'lar, multi-agent orkestrasyon, çapraz model kullanımı, kendi kendine öğrenen sistemler; bunların hepsini aylarca süren bir süreçte kademeli olarak öğrendim.

En önemli ders şudur: AI araçlarının gerçek gücü hangi düğmeye bastığınızdan değil, nasıl düşündüğünüzden gelir. CTO gibi düşünün: sadece kod yazmak değil, planlamak, test etmek, güvenliği sağlamak, performansı ölçmek ve bunların hepsini sistematik olarak yapmak.

Burada adil bir itiraz var: daha akıllı modeller tüm bu kurulumu gereksiz kılmayacak mı? Ben tam tersine bahse girerim. Daha akıllı modeller devredebileceğiniz şeyin tavanını yükseltir ve bu makaledeki her şey (doğrulama, context disiplini, checkpoint'ler) o devretmeyi gerçekten mümkün kılan şeydir. Model yeteneği, operatör becerisiyle çarpılır. Yetenek büyüdükçe, sistem kuran insanlarla prompt yazan insanlar arasındaki fark büyür.

**Başlamak için:**

1. İyi bir CLAUDE.md yazın
2. Context yönetimini öğrenin (%40 kuralı)
3. 3 temel hook'u kurun
4. Plan Mode'u alışkanlık haline getirin
5. Üreteni doğrulayandan ayırın

Unutmayın: araçlarınızı keskinleştirmenin en iyi yolu, onları her gün kullanmaktır.
