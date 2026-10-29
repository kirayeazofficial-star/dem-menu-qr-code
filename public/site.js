const $ = id => document.getElementById(id);
let settings;
let activeCategory = 'all';
let previewMode = false;
let wifiRevealTimer;
function concealWifi(){clearTimeout(wifiRevealTimer);setText('visible-wifi-password',settings?.wifiPassword?'••••••••':'Heyətimizdən soruşun');setText('wifi-reveal','Göstər');}
function closeWifi(){ $('wifi-dialog').close();concealWifi(); }

function setText(id, value) { $(id).textContent = value || ''; }
function displayPhone(value){const digits=value.replace(/\D/g,'');const international=digits.length===10&&digits.startsWith('0')?'994'+digits.slice(1):digits;return international.length===12&&international.startsWith('994')?`+994 ${international.slice(3,5)} ${international.slice(5,8)} ${international.slice(8,10)} ${international.slice(10)}`:value;}
function formatPrice(price) {
  return price.toLocaleString('az-AZ', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2
  });
}
function photograph(item) {
  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.loading = 'lazy';
    img.className = 'dish-image';
    return img;
  }
  if (settings.sampleMenu && Number.isInteger(item.sampleExtraPhoto)) {
    const image=document.createElement('div');image.className=`sample-extra sample-extra-${item.sampleExtraPhoto}`;image.setAttribute('role','img');image.setAttribute('aria-label',`${item.name} — nümunə şəkli`);return image;
  }
  if (settings.sampleMenu && Number.isInteger(item.sampleSetPhoto)) {
    const image=document.createElement('div');image.className=`sample-set sample-set-${item.sampleSetPhoto}`;image.setAttribute('role','img');image.setAttribute('aria-label',`${item.name} — nümunə şəkli`);return image;
  }
  if (settings.sampleMenu && Number.isInteger(item.samplePhoto)) {
    const image = document.createElement('div');
    image.className = `sample-dish sample-dish-${item.samplePhoto}`;
    image.setAttribute('role', 'img');
    image.setAttribute('aria-label', `${item.name} — nümunə şəkli`);
    return image;
  }
  const empty = document.createElement('div');
  empty.className = 'dish-no-photo';
  empty.textContent = 'Dəm';
  empty.setAttribute('aria-hidden', 'true');
  return empty;
}
function openProduct(item) {
  $('product-photo').replaceChildren(photograph(item));
  setText('product-category', settings.categories.find(c => c.id === item.category)?.name);
  setText('product-name', item.name);
  setText('product-description', item.description);
  setText('product-price', `${formatPrice(item.price)} ${settings.currency}`);
  $('product-sample').hidden = !settings.sampleMenu;
  $('product-dialog').showModal();
}
function renderItems() {
  const query = $('search').value.trim().toLocaleLowerCase('az');
  const items = settings.items.filter(item => item.available
    && (activeCategory === 'all' || item.category === activeCategory)
    && `${item.name} ${item.description}`.toLocaleLowerCase('az').includes(query));
  setText('category-title', query ? 'Axtarış nəticələri'
    : activeCategory === 'all' ? 'Bütün məhsullar'
    : settings.categories.find(c => c.id === activeCategory)?.name);
  setText('result-count', `${items.length} məhsul`);
  $('items').replaceChildren();
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = query ? 'Məhsul tapılmadı. Başqa adla axtarın.' : 'Bu bölmədə hələ məhsul yoxdur.';
    $('items').append(empty);
    return;
  }
  for (const item of items) {
    const article = document.createElement('article');
    article.className = 'menu-card';
    const photoButton = document.createElement('button');
    photoButton.type = 'button';
    photoButton.className = 'dish-button';
    photoButton.setAttribute('aria-label', `${item.name} haqqında ətraflı`);
    photoButton.onclick = () => openProduct(item);
    photoButton.append(photograph(item));
    const body = document.createElement('div');
    body.className = 'dish-body';
    const name = document.createElement('h4');
    name.className = 'dish-name';
    name.textContent = item.name;
    const description = document.createElement('p');
    description.className = 'dish-description';
    description.textContent = item.description;
    const price = document.createElement('strong');
    price.className = 'dish-price';
    price.textContent = formatPrice(item.price);
    const currency = document.createElement('small');
    currency.textContent = settings.currency;
    price.append(currency);
    body.append(name, description, price);
    article.append(photoButton, body);
    $('items').append(article);
  }
}
function renderCategories() {
  $('categories').replaceChildren();
  for (const category of [{ id: 'all', name: 'Hamısı' }, ...settings.categories]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = category.name;
    button.classList.toggle('active', category.id === activeCategory);
    button.setAttribute('aria-pressed', String(category.id === activeCategory));
    button.onclick = () => {
      activeCategory = category.id;
      for (const sibling of $('categories').children) {
        const selected = sibling === button;
        sibling.classList.toggle('active', selected);
        sibling.setAttribute('aria-pressed', String(selected));
      }
      renderItems();
    };
    $('categories').append(button);
  }
}
async function load() {
  try {
    try {
      const response = await fetch('/api/settings', {signal:AbortSignal.timeout(6000)});
      if (!response.ok) throw new Error('Settings unavailable');
      settings = await response.json();
      if (!Array.isArray(settings.items) || !Array.isArray(settings.categories)) throw new Error('Invalid settings');
    } catch {
      const demo = await fetch('/sample-menu.json');
      if (!demo.ok) throw new Error('Demo unavailable');
      settings = await demo.json();
      previewMode = true;
    }
    setText('visible-wifi-name', settings.wifiName || 'Heyətimizdən soruşun');
    concealWifi();
    $('wifi-reveal').hidden=!settings.wifiPassword;
    $('visible-wifi-copy').hidden = !settings.wifiPassword;
    document.title = `${settings.name} · Menyu`;
    setText('venue-name', settings.name);
    setText('header-address', settings.address);
    setText('quick-address',settings.address);
    $('quick-map').hidden=!settings.address&&!settings.mapUrl;
    $('quick-map').href=settings.mapUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.name+' '+settings.address)}`;
    setText('quick-phone',displayPhone(settings.phone));
    $('quick-call').hidden=!settings.phone;
    $('quick-whatsapp').hidden=!settings.phone;
    setText('tagline', settings.tagline);
    $('tagline').hidden = !settings.tagline;
    $('sample-notice').hidden = !settings.sampleMenu;
    if (previewMode) setText('sample-notice','Nümunə menyu · Aktual menyu və qiymətlər üçün bizə zəng edin.');
    $('illustration-note').hidden = !settings.sampleMenu;
    if (settings.profileImage) {
      $('profile').src = settings.profileImage;
      $('profile').hidden = false;
      $('cover-profile').src=settings.profileImage;$('cover-profile').hidden=false;$('cover-logo-fallback').hidden=true;
      $('fallback-brand').hidden = true;
    }
    if (settings.coverImage) {
      $('hero-photo').src = settings.coverImage;
      $('hero-photo').alt = `${settings.name} üz qabığı`;
      $('photo-caption').hidden = true;
    }
    setText('info-address', settings.address);
    setText('map-address', settings.address);
    $('map-section').hidden = !settings.address;
    setText('map-placeholder-address',settings.address);
    if(settings.address) $('venue-map').dataset.src = `https://maps.google.com/maps?q=${encodeURIComponent(settings.name+' '+settings.address)}&output=embed`;
    $('map-external').href=settings.mapUrl||`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.name+' '+settings.address)}`;
    $('info-map').hidden = !settings.address && !settings.mapUrl;
    $('info-map').href = settings.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`;
    setText('contact-phone', settings.phone?displayPhone(settings.phone):'Telefon qeyd edilməyib');
    if (settings.phone) {
      $('contact-phone').href = `tel:${settings.phone.replace(/[^+\d]/g, '')}`;
      $('quick-call').href=$('contact-phone').href;
      $('header-contact').href=$('contact-phone').href;
      let digits = settings.phone.replace(/\D/g, '');
      if (digits.startsWith('0')) digits = '994' + digits.slice(1);
      $('whatsapp-link').href = `https://wa.me/${digits}`;
      $('quick-whatsapp').href=$('whatsapp-link').href;
      $('whatsapp-link').hidden = false;
    }
    setText('info-hours', settings.hours || 'Məlumat üçün bizimlə əlaqə saxlayın.');

    renderCategories();
    renderItems();
  } catch {
    setText('visible-wifi-name', 'Məlumat yüklənmədi');
    setText('visible-wifi-password', 'Heyətimizdən soruşun');
    $('items').textContent = 'Menyu yüklənmədi. Səhifəni yeniləyin.';
    $('load-error').hidden = false;
    setText('load-error', 'Serverlə əlaqə qurulmadı. Bir az sonra yenidən yoxlayın.');
  }
}
$('search').addEventListener('input', () => settings && renderItems());
$('wifi-open').onclick = () => {
  if (!settings) return;
  setText('wifi-name', settings.wifiName || 'Heyətimizdən soruşun');
  setText('wifi-password', settings.wifiPassword || 'Heyətimizdən soruşun');
  $('wifi-copy').hidden = !settings.wifiPassword;
  setText('copy-status', '');
  $('wifi-dialog').showModal();
};
$('wifi-close').onclick = closeWifi;
$('wifi-dialog').addEventListener('click',event=>{if(event.target===$('wifi-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeWifi();}});
$('wifi-dialog').addEventListener('close',()=>{setText('wifi-password','');concealWifi();});
$('wifi-dialog').addEventListener('cancel',concealWifi);
$('product-close').onclick = () => $('product-dialog').close();
$('wifi-copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(settings.wifiPassword);
    closeWifi();setText('visible-copy-status','Şifrə kopyalandı.');
  } catch {
    setText('copy-status', 'Şifrəni seçərək əl ilə kopyalaya bilərsiniz.');
  }
};
load();

$('visible-wifi-copy').onclick = async () => {
  if (!settings?.wifiPassword) return;
  try {
    await navigator.clipboard.writeText(settings.wifiPassword);
    concealWifi();setText('visible-copy-status', 'Şifrə kopyalandı.');
  } catch {
    setText('visible-copy-status', 'Şifrəni seçərək kopyalaya bilərsiniz.');
  }
};

$('bottom-wifi').onclick=()=>$('wifi-open').click();

$('load-map').onclick=()=>{const frame=$('venue-map');if(!frame.dataset.src)return;frame.src=frame.dataset.src;frame.hidden=false;$('map-placeholder').hidden=true;};

$('wifi-reveal').onclick=()=>{if(!settings?.wifiPassword)return;if($('wifi-reveal').textContent==='Gizlət'){concealWifi();return;}setText('visible-wifi-password',settings.wifiPassword);setText('wifi-reveal','Gizlət');clearTimeout(wifiRevealTimer);wifiRevealTimer=setTimeout(concealWifi,15000);};
document.addEventListener('visibilitychange',()=>{if(document.hidden){concealWifi();if($('wifi-dialog').open)closeWifi();}});

function openReservation(){
  if(!settings?.phone){setText('visible-copy-status','Rezerv üçün telefon məlumatı hazır deyil.');return;}
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Baku',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  $('reserve-date').min=today;
  if(!$('reserve-date').value)$('reserve-date').value=today;
  setText('reserve-status','');$('reservation-dialog').showModal();
}
for(let minutes=18*60;minutes<25*60;minutes+=30){const hour=Math.floor(minutes/60)%24;const value=String(hour).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');const option=document.createElement('option');option.value=value;option.textContent=value;$('reserve-time').append(option);}
for(let n=1;n<=20;n++){const option=document.createElement('option');option.value=n;option.textContent=n+' nəfər';option.selected=n===2;$('reserve-guests').append(option);}
$('reserve-open').onclick=openReservation;$('reserve-banner').onclick=openReservation;
$('reserve-close').onclick=()=>$('reservation-dialog').close();
$('reservation-form').onsubmit=event=>{
  event.preventDefault();
  const date=$('reserve-date').value,time=$('reserve-time').value;
  if(new Date(date+'T'+time+':00+04:00').getTime()<=Date.now()){setText('reserve-status','Gələcək tarix və saat seçin.');return;}
  let phone=settings.phone.replace(/\D/g,'');if(phone.startsWith('0'))phone='994'+phone.slice(1);
  const message=['Salam, '+settings.name+' üçün masa rezervi sorğusu göndərirəm.','Ad: '+$('reserve-name').value.trim(),'Tarix: '+date.split('-').reverse().join('.'),'Saat: '+time+' (Bakı vaxtı)','Qonaq sayı: '+$('reserve-guests').value,...($('reserve-note').value.trim()?['Qeyd: '+$('reserve-note').value.trim()]:[]),'Zəhmət olmasa, mövcudluğu təsdiqləyin.'].join('\n');
  window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
  $('reservation-dialog').close();
};
