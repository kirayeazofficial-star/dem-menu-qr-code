# Dəm RestoPub

Mobil cihazlara uyğun QR menyu və şifrə ilə qorunan admin paneli. Azərbaycan dilindədir. Node.js 24+, Express və SQLite istifadə edir.

## Başlatmaq

```sh
npm ci
npm run admin:set
npm start
```

`admin:set` ən azı 12 simvolluq admin şifrəsi soruşur. Bu əmri yalnız etibarlı terminalda işlədin: daxil edilən şifrə terminalda görünür. Avtomatlaşdırma üçün `DEM_ADMIN_PASSWORD` dəyişənini təhlükəsiz şəkildə ötürmək olar; şifrəni repoya və ya əmr arqumentlərinə yazmayın. Şifrə scrypt ilə heşlənir. Şifrəni dəyişmək üçün eyni əmri təkrarlayın; bütün mövcud sessiyalar bağlanır.

Sayt 3000 portunda açılır, admin paneli `/admin` yolundadır. İnkişaf zamanı `npm run dev` istifadə edin. `npm test` ayrıca müvəqqəti verilənlər bazasında funksional testləri işlədir və əsas məlumatlara toxunmur.

## Paneldə nəyi dəyişmək olar?

- Məkanın adı, şüarı, təsviri, loqosu və üz qabığı
- Ünvan, xəritə keçidi, telefon / WhatsApp, Instagram, TikTok və iş saatları
- Müştəri Wi-Fi adı və şifrəsi (saytda hamıya görünür; admin şifrəsindən fərqli saxlayın)
- Menyu kateqoriyaları, məhsullar, təsvirlər, qiymətlər və görünürlük
- Saytın daimi ünvanı və çap üçün PNG formatında QR kod

İlkin məlumatlar göndərilən ekran şəklindən götürülüb: Dəm RestoPub, Buzovna, Zuğulba 24 B, +994 70 686 12 11. Sahibin istəyi ilə 6 şəkilli nümunə məhsul və şərti qiymətlər əlavə edilib; bunlar saytda “Nümunə menyu” kimi işarələnir. Həqiqi menyunu paneldən daxil etdikdən sonra nümunə menyu seçimini söndürün. Şəkillər yaradılmış illüstrasiyalardır, məkanın həqiqi fotoşəkilləri deyil. Loqonun orijinal faylını paneldə “Profil şəkli / loqo” sahəsindən yükləyin. Qonaq səhifəsində loqo yüklənənə qədər mətn əsaslı marka göstərilir.

Dəyişikliklərin saytda görünməsi üçün **Dəyişiklikləri yadda saxla** düyməsini basın. QR kod eyni domenə yönəldiyi müddətdə menyu və Wi-Fi dəyişəndə onu yenidən çap etmək lazım deyil. QR kod xəritə, menyu və Wi-Fi keçidlərini bir saytda birləşdirir; Wi-Fi-a avtomatik qoşulma kodu deyil.

## Vercel-də yayımlama

Vercel konfiqurasiyası `vercel.json` faylındadır. Sayt statik fayllarla, API isə `api/index.js` serverless funksiyası ilə işləyir. Vercel-in müvəqqəti diskinə məlumat yazılmır: menyu, şəkillər, sessiyalar və giriş cəhdləri Turso/libSQL bazasında saxlanır. Tək bazanın istifadəsi ayrıca şəkil saxlama xidmətinə ehtiyacı aradan qaldırır. Şəkillər PNG, JPG və WebP, ən çox 3 MB olmalıdır.

Vercel Storage qoşulma pəncərəsində prefiks kimi `TURSO` seçilərsə, yaranan `TURSO_URL` da qəbul olunur; `TURSO_DATABASE_URL` ilə eyni məqsəd daşıyır.

1. Turso-da verilənlər bazası yaradın və onun HTTPS/libSQL ünvanını və auth tokenini əldə edin. Mövcud Turso bazası da istifadə oluna bilər.
2. Vercel layihəsində **Settings → Environment Variables** bölməsinə bunları təhlükəsiz şəkildə daxil edin:
   - `TURSO_DATABASE_URL`: bazanın ünvanı.
   - `TURSO_AUTH_TOKEN`: bazanın məxfi giriş açarı.
   - `DEM_ADMIN_PASSWORD`: yalnız sizin bildiyiniz 12–512 simvolluq admin şifrəsi.
3. Node.js 24.x seçin, framework preset **Other**, root directory repozitoriyanın kökü olsun. Build command `npm run build`, output directory `public` olaraq `vercel.json`-dan gəlir.
4. GitHub `main` dalını deploy edin. İlk API sorğusunda cədvəllər və ilkin admin hesabı avtomatik yaradılır. Eyni şifrə ilə təkrar deploy məlumatları və admin şifrəsini dəyişmir. `DEM_ADMIN_PASSWORD` yeni dəyərə dəyişdirilərsə, şifrə bir dəfə yenilənir və sessiyalar bağlanır.
5. `/admin` yolundan daxil olun, orijinal loqonu və menyunu əlavə edin. Saytın yayımlanmış ünvanını yazın, yadda saxlayın və QR kodu yükləyin. Çapdan əvvəl başqa telefonla, mobil internet üzərindən yoxlayın.

Məxfi açarları GitHub-a, ekran şəkillərinə və çata yerləşdirməyin. Vercel preview və production üçün ayrı bazalar tövsiyə olunur: eyni bazaya bağlanan preview real menyunu da dəyişir. Uzaq bazanın faktiki qoşulması və Vercel deployment-i bu layihənin lokal testləri ilə təsdiqlənmir; yayım sonrası yoxlanmalıdır.

Vercel-də HTTPS cookie və etibarlı proxy parametrləri avtomatik tətbiq olunur. Başqa hostinqdə `COOKIE_SECURE=true`, bir etibarlı reverse proxy arxasında `TRUST_PROXY=true` istifadə edin.

## Lokal iş və digər Node.js hostinqləri

`TURSO_DATABASE_URL` olmadan lokal SQLite `data/dem.sqlite` faylında işləyir. Köhnə `data/uploads/` şəkillərinin oxunması saxlanılıb; yeni şəkillər bazaya yazılır. Lokal məlumatlar uzaq bazaya avtomatik köçürülmür. Daimi diskli hostinqdə `data/` qovluğunu ehtiyat nüsxələyin. Yerli rejim `npm run admin:set` ilə, uzaq rejim isə təhlükəsiz verilmiş eyni baza dəyişənləri ilə admin şifrəsini yeniləməyə imkan verir; mövcud sessiyalar bağlanır. `DEM_ADMIN_PASSWORD` ilk admin hesabını yaradır; əvvəllər istifadə edilməmiş yeni dəyər təyin edildikdə şifrəni bir dəfə yeniləyir. Köhnə deployment-in təkrar başlaması şifrəni əvvəlki dəyərə qaytarmır.

| Dəyişən | Standart | Məqsəd |
| --- | --- | --- |
| `PORT` | `3000` | Lokal HTTP portu |
| `HOST` | `0.0.0.0` | Lokal dinləmə ünvanı |
| `DATA_DIR` | `data` | Lokal bazanın qovluğu |
| `TURSO_DATABASE_URL` | yoxdur | Qalıcı bulud bazası; Vercel-də tələb olunur |
| `TURSO_AUTH_TOKEN` | yoxdur | Uzaq bazanın məxfi giriş açarı |
| `DEM_ADMIN_PASSWORD` | yoxdur | Admin hesabını yaradır və yeni dəyərlə şifrəni yeniləyir |
| `COOKIE_SECURE` | `false` | Digər HTTPS hostinqlərdə `true` qoyun |
| `TRUST_PROXY` | `false` | Bir etibarlı reverse proxy üçün `true` qoyun |

Admin sessiyası 8 saatdır; cookie HttpOnly və SameSite=Strict parametrləri ilə qorunur. Giriş cəhdlərinin limiti bazada saxlanaraq ayrı serverless instansiyalarda da işləyir. SVG yükləmələri qəbul edilmir. `data/`, `.env` və `node_modules/` Git-ə daxil edilmir.

## Mövcud boş bazaya nümunə əlavə etmək

`node scripts/seed-demo.js` yalnız məhsulu olmayan bazaya nümunə menyu əlavə edir; mövcud məhsulları əvəz etmir. Əmr verilmiş Turso dəyişənləri varsa uzaq bazaya təsir edir, buna görə yalnız nəzərdə tutulan bazada işlədin. Yeni bazalar nümunə menyu ilə avtomatik başlayır.

## Şəkillər və xəritə

Menyu şəkilləri və pub atmosferi üçün yaradılmış şəkillər layihənin `public/assets/` qovluğundadır. Yeni build `public/sample-menu.json` faylını açıq nümunə məlumatları ilə yaradır. API əlçatan olmayanda müştəri səhifəsi yalnız aydın işarələnmiş nümunə menyu göstərir; bu, bazanın və admin panelinin hazır olması demək deyil. Admin məlumatları statik fayla köçürülmür. Sahibin açıq göstərilməsini istədiyi qonaq Wi-Fi məlumatları nümunə faylda da yer alır.

Xəritə paneli adminin daxil etdiyi ünvan üzrə Google Maps axtarışını açır. Dəqiq məkan pinini seçmək üçün xəritə keçidini paneldə qeyd edin; “Xəritədə aç” həmin keçiddən istifadə edir. Daxili xəritə istifadəçi “Google xəritəsini göstər” düyməsinə basanda yüklənir; Google xidmətinə brauzerdən giriş tələb olunur. Xəritə rəsmlərinin xarici şəbəkədə yüklənməsi lokal avtomatik testlərlə təsdiqlənməyib.

## Açıq görünüş və şifrə davranışı

Müştəri səhifəsi və admin paneli açıq krem/yaşıl rənglərdədir. Paneldə yüklənmiş orijinal profil şəkli həm başlıqda, həm üz qabığında göstərilir; şəkil dəyişdirilmir. Müştəri Wi-Fi şifrəsi ilk açılışda maskalanır, “Göstər” ilə 15 saniyə görünür, kopyalamadan və səhifədən uzaqlaşmadan sonra yenidən gizlənir. Wi-Fi pəncərəsi kopyalamadan sonra bağlanır; bağlama düyməsi, Escape və pəncərədən kənara toxunmaq da işləyir. Bu, görünüş davranışıdır: müştəri Wi-Fi məlumatları açıq API-də qonaqlara təqdim olunur, admin şifrəsi deyil.

Nümunə menyuya qəlyan–çay, dostlar və çay süfrəsi setləri əlavə olunub. Mövcud nümunə bazasında yalnız bu üç yeni məhsul və əlaqəli kateqoriyalar bir dəfə əlavə edilir; əvvəlki redaktələr saxlanır. Həqiqi menyu rejimində avtomatik məhsul əlavə edilmir. Nümunə şəkilləri və qiymətləri həqiqi məkan təklifi kimi təqdim etməyin.

## TikTok profilindən təsdiqlənən əlaqə

Dəm RestoPub: Buzovna, Zuğulba 24 B; +994 70 686 12 11; WhatsApp eyni nömrədədir; TikTok `@cahanhsv`. Birbaşa zəng, WhatsApp və xəritə keçidləri üz qabığının altında göstərilir və paneldən dəyişən məlumatları izləyir. Məkan məlumatları aşağıda ilkin olaraq açıqdır. Mövcud yüklənmiş loqo və profil şəkli dəyişdirilmir.

Nümunə kataloq 12 məhsula qədər genişləndirilib: meyvə tabağı, naqqets–fri və saçaq pendir–noxud əlavə olunub. Bunların qiymət və şəkilləri təsdiqlənmiş real təklif deyil. Əlavələr nümunə rejimində bir dəfə tətbiq olunur, həqiqi menyu və mövcud redaktələr əvəz edilmir.

## İş saatı və rezerv sorğusu

Sahibin təyin etdiyi ilkin iş saatı 18:00–01:00, qonaq Wi-Fi adı Dəm RestoPub, qonaq şifrəsi isə 12345-dir. Bu qonaq şifrəsi admin şifrəsi deyil. Dəyərlər bir dəfə yenilənir, sonrakı panel redaktələri saxlanır.

Masa rezervi forması ad, təqvim tarixi, Bakı vaxtı ilə saat, qonaq sayı və istəyə görə qeyd toplayır. Keçmiş vaxtlar qəbul edilmir. Forma yalnız WhatsApp-da əvvəlcədən hazırlanmış sorğu açır; mesajı istifadəçi göndərir. Rezervlər tətbiq bazasında saxlanmır və avtomatik təsdiqlənmir. Telefon nömrəsi paneldə dəyişəndə rezerv sorğusunun ünvanı da dəyişir.

Admin paneli saytın `/admin` yolundadır; giriş üçün Vercel-də ilkin olaraq `DEM_ADMIN_PASSWORD` kimi təyin olunan şifrə istifadə edilir.

## Admin şifrəsi unudulubsa

Vercel layihəsində Environment Variables bölməsində `DEM_ADMIN_PASSWORD` üçün yeni, əvvəllər istifadə edilməmiş, 12–512 simvolluq şifrə təyin edin; Production üçün yadda saxlayın və Redeploy edin. Yeni yayımın ilk API sorğusunda şifrə yenilənir və köhnə sessiyalar bağlanır. Şifrəni çata göndərməyin.

Telefon +994 70 686 12 11 formatında göstərilir. Wi-Fi düymələri tək əməliyyat qrupundadır; telefon və WhatsApp ayrıca kartda yerləşir. Üz qabığı bölünməmiş pub interyeridir, loqo sağ tərəfdədir.

## Sahibin hazır menyusu

Nümunə məhsullar sahibin göndərdiyi iki PDF əsasında hazırlanmış kataloqla əvəz olunur. İlk açılışda pivə setləri göstərilir; digər kateqoriyalar düymələrdən seçilir. Axtarış bütün menyunu əhatə edir. Hər iki orijinal PDF saytdan açıla bilər. Mənbə, əhatə və oxunma məhdudiyyətləri `MENU_IMPORT.md` faylındadır. Mövcud məlumatların idxaldan əvvəlki surəti bazada saxlanır; şəxsi əlavə və məkan məlumatları qorunur. `npm test` PDF qiymətləri, admin redaktəsi, mənbə faylları və idxalın təkrarlanmamasını da yoxlayır.

## Vercel-də framework seçimi

`vercel.json` faylında `framework: null` qəsdən təyin edilib. Saytın statik çıxışı `public/`, serverless API girişi isə `api/index.js`-dir. Express avtomatik seçilərsə, Vercel səhvən `public/` daxilində server entrypoint axtara bilər. Bu dəyişiklik Vercel CLI 65.7.0 ilə, lokal layihə ayarında Express seçilmiş halda yoxlanıb: statik səhifələr və `nodejs24.x` API funksiyası yaradılıb. Bu lokal build yoxlaması Production mühitinin məxfi dəyişənlərinin və canlı Turso bağlantısının yoxlanması demək deyil.

## Admin server xətası verəndə

Vercel girişində startup xətaları JSON 503 cavabı ilə qaytarılır; baza URL-i, baza tokeni və admin şifrəsinin uzunluğu üçün ayrıca xəta kodları var. Məxfi dəyərlər loga yazılmır. Digər başlanğıc xətaları üçün Runtime Logs-da `DEM API initialization failed` və xəta kodunu yoxlayın. Admin brauzeri Vercel-in plaintext/HTML xətasını da göstərir və JSON parse xətasını istifadəçiyə çıxarmır.

Uzaq Turso bağlantısı `@libsql/client/http` ilə stateless HTTPS üzərindən, lokal iş isə SQLite ilə işləyir. Lokal testlərin və Vercel build-in keçməsi canlı Turso icazələrinin yoxlanması deyil.

`dem-menu-qr-code-<deployment-id>-<team>.vercel.app` konkret yayımın ünvanıdır; sonrakı push və redeploy nəticələri həmin köhnə linki dəyişdirmir. Yeni yayımı Vercel-də son Ready deployment-in Visit düyməsi ilə açın, daimi istifadə üçün layihənin Production domenini götürün.
