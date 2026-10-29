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

1. Turso-da verilənlər bazası yaradın və onun HTTPS/libSQL ünvanını və auth tokenini əldə edin. Mövcud Turso bazası da istifadə oluna bilər.
2. Vercel layihəsində **Settings → Environment Variables** bölməsinə bunları təhlükəsiz şəkildə daxil edin:
   - `TURSO_DATABASE_URL`: bazanın ünvanı.
   - `TURSO_AUTH_TOKEN`: bazanın məxfi giriş açarı.
   - `DEM_ADMIN_PASSWORD`: yalnız sizin bildiyiniz 12–512 simvolluq admin şifrəsi.
3. Node.js 24.x seçin, framework preset **Other**, root directory repozitoriyanın kökü olsun. Build command `npm run build`, output directory `public` olaraq `vercel.json`-dan gəlir.
4. GitHub `main` dalını deploy edin. İlk API sorğusunda cədvəllər və ilkin admin hesabı avtomatik yaradılır. Təkrar deploy məlumatları və admin şifrəsini dəyişmir.
5. `/admin` yolundan daxil olun, orijinal loqonu və menyunu əlavə edin. Saytın yayımlanmış ünvanını yazın, yadda saxlayın və QR kodu yükləyin. Çapdan əvvəl başqa telefonla, mobil internet üzərindən yoxlayın.

Məxfi açarları GitHub-a, ekran şəkillərinə və çata yerləşdirməyin. Vercel preview və production üçün ayrı bazalar tövsiyə olunur: eyni bazaya bağlanan preview real menyunu da dəyişir. Uzaq bazanın faktiki qoşulması və Vercel deployment-i bu layihənin lokal testləri ilə təsdiqlənmir; yayım sonrası yoxlanmalıdır.

Vercel-də HTTPS cookie və etibarlı proxy parametrləri avtomatik tətbiq olunur. Başqa hostinqdə `COOKIE_SECURE=true`, bir etibarlı reverse proxy arxasında `TRUST_PROXY=true` istifadə edin.

## Lokal iş və digər Node.js hostinqləri

`TURSO_DATABASE_URL` olmadan lokal SQLite `data/dem.sqlite` faylında işləyir. Köhnə `data/uploads/` şəkillərinin oxunması saxlanılıb; yeni şəkillər bazaya yazılır. Lokal məlumatlar uzaq bazaya avtomatik köçürülmür. Daimi diskli hostinqdə `data/` qovluğunu ehtiyat nüsxələyin. Yerli rejim `npm run admin:set` ilə, uzaq rejim isə təhlükəsiz verilmiş eyni baza dəyişənləri ilə admin şifrəsini yeniləməyə imkan verir; mövcud sessiyalar bağlanır. `DEM_ADMIN_PASSWORD` yalnız ilk admin hesabını yaradır, mövcud hesabın şifrəsini dəyişmir.

| Dəyişən | Standart | Məqsəd |
| --- | --- | --- |
| `PORT` | `3000` | Lokal HTTP portu |
| `HOST` | `0.0.0.0` | Lokal dinləmə ünvanı |
| `DATA_DIR` | `data` | Lokal bazanın qovluğu |
| `TURSO_DATABASE_URL` | yoxdur | Qalıcı bulud bazası; Vercel-də tələb olunur |
| `TURSO_AUTH_TOKEN` | yoxdur | Uzaq bazanın məxfi giriş açarı |
| `DEM_ADMIN_PASSWORD` | yoxdur | İlk admin hesabını yaradır |
| `COOKIE_SECURE` | `false` | Digər HTTPS hostinqlərdə `true` qoyun |
| `TRUST_PROXY` | `false` | Bir etibarlı reverse proxy üçün `true` qoyun |

Admin sessiyası 8 saatdır; cookie HttpOnly və SameSite=Strict parametrləri ilə qorunur. Giriş cəhdlərinin limiti bazada saxlanaraq ayrı serverless instansiyalarda da işləyir. SVG yükləmələri qəbul edilmir. `data/`, `.env` və `node_modules/` Git-ə daxil edilmir.

## Mövcud boş bazaya nümunə əlavə etmək

`node scripts/seed-demo.js` yalnız məhsulu olmayan bazaya nümunə menyu əlavə edir; mövcud məhsulları əvəz etmir. Əmr verilmiş Turso dəyişənləri varsa uzaq bazaya təsir edir, buna görə yalnız nəzərdə tutulan bazada işlədin. Yeni bazalar nümunə menyu ilə avtomatik başlayır.
