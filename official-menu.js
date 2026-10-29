// Transcribed from the owner's two PDFs. Source files remain available in public/documents/.
export const officialCategories=[
 ['sets','Pivə setləri'],['tea','Çay və kofe'],['cold-drinks','Soyuq içkilər'],['beer','Pivələr'],['snacks','Məzələr'],['khinkali','Xəngəl'],['cold-starters','Soyuq qəlyanaltılar'],['soups','Şorbalar'],['salads','Salatlar'],['hot-meals','İsti yeməklər'],['kebabs','Kabablar'],['saj','Sac yeməkləri'],['sausages','Sosislər'],['sides','Qarnirlər'],['desserts','Desertlər'],['hookah','Qəlyan'],['cocktails','Alkollu kokteyllər'],['nonalcoholic','Alkoqolsuz kokteyllər'],['whisky','Viski'],['liqueur','Likör']
].map(([id,name])=>({id:'pdf-'+id,name}));
const item=(id,category,name,price,description='',extra={})=>({id:'pdf-'+id,category:'pdf-'+category,name,price,description,available:true,image:'',...extra});
export const officialSets=[
 item('set-1','sets','4 bakal pivə',14,'Sadə pendir · Noxud · Hisə verilmiş pətənə',{image:'/assets/menu/beer-set-1.png'}),
 item('set-2','sets','8 bakal pivə',25.60,'Pətənə · Noxud · Hisə verilmiş boğaz · Çipsi',{image:'/assets/menu/beer-set-2.png'}),
 item('set-3','sets','8 bakal pivə',22.80,'Tum · Noxud · Sadə pendir · Düşbərə',{image:'/assets/menu/beer-set-3.png'}),
 item('set-4','sets','12 bakal pivə',45.30,'Pendirli qrenki · Pendir çubuqları · Noxud · Tum · Hisə verilmiş boğaz · Pətənə · Düşbərə',{image:'/assets/menu/beer-set-4.png'}),
 item('set-5','sets','12 bakal pivə',39.40,'Tum · Sadə pendir · Noxud · Hisə verilmiş boğaz · Hisə verilmiş pətənə · Kabanos',{image:'/assets/menu/beer-set-5.png'}),
 item('set-6','sets','20 bakal pivə',73.80,'Qrenki · Kabanos · Qızartma pendir · Pətənə · Düşbərə · Sadə pendir · Tum · Hisə verilmiş boğaz · Ət basdırma · Çipsi',{image:'/assets/menu/beer-set-6.png'}),
 item('set-7','sets','20 bakal pivə',54,'Sadə pendir · Hisə verilmiş pətənə · Hisə verilmiş boğaz · Noxud · Tum · Farel balığı',{image:'/assets/menu/beer-set-7.png'}),
 item('set-8','sets','20 bakal pivə',105,'Tum · Sadə pendir · Noxud · Qızartma pendir · Kabanos · Qrenki · Pətənə · Pendir çubuqları · Düşbərə · Çipsi · Suxari · Farel balığı · Krevetka · Basdırma · Hisə verilmiş boğaz · Hisə verilmiş bel boğaz',{image:'/assets/menu/beer-set-8.png'})
];
const groups={
 'tea':[
 ['Çay sadə',3],['Çay əlavə',2],['Kofe',2],['Kapiçino',3],['Çay pletka',6],['Çay oreo',5],['Çay mürəbbə',7,'PDF-də 7/10 ₼ göstərilib; 7 ₼ seçimi'],['Çay mürəbbə',10,'PDF-də 7/10 ₼ göstərilib; 10 ₼ seçimi'],['Yaşıl çay',5],['Çay dəzgahı (kiçik)',15],['Çay dəzgahı (böyük)',25]
 ],
 'cold-drinks':[
 ['Fanta',3,'330 ml'],['Kola',3,'330 ml'],['Moxito',3,'250 ml'],['Bizon',2,'250 ml'],['Hell',2,'250 ml'],['Redbull',5,'250 ml'],['Sprite',2.5,'0.5 l'],['Cola',3,'1 l'],['Fanta',3,'1 l'],['Sprite',3,'1 l'],['Düşes',3,'0.5 l'],['Sirab qazlı',3,'0.5 l'],['Sirab qazsız',3,'0.5 l'],['Meyvə şirəsi',5,'1 l']
 ],
 'beer':[['NZS',2],['NZS Fuje',2.5],['Xırdalan (şüşə)',4],['Xırdalan (şüşə 0%)',4],['Kul ice',4],['Miller',5],['Corona',7],['Delester',4,'1 l']],
 'snacks':[
 ['Noxud',2],['Noxud qızartma',3],['Saçaqlı sadə',3],['Saçaqlı qızartma',4],['Boğaz',1.5,'1 ədəd'],['Boğaz pors',4],['Boğaz qızartma',5],['Boğaz bel',3,'1 ədəd'],['Pətənək qızartma',4],['Pətənə hisə verilmiş',3],['Düşbərə qızartma',4],['Çipsi',3],['Suxari',2],['Tum',2],['Püstə',6],['Qrenki sadə',3],['Qrenki pendirli',5],['Pendir çubuqları',5],['Toyuq popkorn',8],['Bildirçin',3],['Farel',9],['Şamayka',3],['Kilka',4],['Krevetka',8],['Krevetka tempura',14],['Soğan halqası',4],['Ət basdırma',5],['Göbələk çipsi',6],['Dorado',13]
 ],
 'khinkali':[['Xəngəl gürcü qaynadılmış',1,'1 ədəd']],
 'cold-starters':[['Zeytun',4],['Turşu assorti',4],['Acika',2],['Tərəvəz buketi',4],['Ağ pendir',4],['Qatıq',1],['Pomidor xiyar',3],['Çörək',1],['Limon',1]],
 'soups':[['Mərci',3],['Düşbərə',4],['Dovğa',3],['Tomat şorbası',3.5],['Toyuq şorbası',4]],
 'salads':[['Sezar toyuq',8],['Sezar krevetka',12],['Toyuq salatı',5],['Çoban salatı',3],['Yunan salatı',4],['Paytaxt salatı',5]],
 'hot-meals':[
 ['Quzu çoban qovurma',12],['Can əti çoban qovurma',12],['Can əti şabalıqlı qovurma',12],['Tabaka',14],['Kefli beçə',15],['Qaymaqlı toyuq',13],['Toyuq langet',8],['Ət langet',9],['Toyuq faxitos',9],['Ət faxitos',12],['Toyuq straqanof',10],['Ət straqanof',11],['Sosislə yumurta',5],['Pomidor-yumurta',4],['Toyuq qızartma',15],['Cızbız',12],['Kütüm tavada',20],['Kütüm setkada',22],['Kifal tavada',15],['Kifal setkada',17],['Farel',25]
 ],
 'kebabs':[['Toyuq',5],['Lülə',7],['Tikə',8],['Quzu',9],['Ciyər',5],['Tərəvəz',4],['Ciyər-quyruq',6],['Kartof-quyruq',5],['Kartof közləmə',3],['Kartof lülə',5],['Antrikot',10]],
 'saj':[['Sac çolpa',12,'PDF-dəki 12 ₼ seçimi'],['Sac çolpa',18,'PDF-dəki 18 ₼ seçimi'],['Sac toyuq',20],['Sac quzu',25],['Sac can əti',25],['Sac qarışıq',30]],
 'sausages':[['İveriya',5],['Manqalüstü',5],['Sardelka',5],['Ovçular',5]],
 'sides':[['Düyü',3],['Tərəvəzli düyü',4],['Spagetti',3],['Qreçka',3],['Free',3],['Free ətsayağı',3.5],['Püre',3.5],['Nagest',6]],
 'desserts':[['Meyvə assorti',15,'PDF-dəki 15 ₼ seçimi'],['Meyvə assorti',20,'PDF-dəki 20 ₼ seçimi'],['Dondurma',5],['Ləpə assorti',15],['Tort dilim',4],['Şokolad',4],['Mürəbbə',5,'PDF-dəki 5 ₼ seçimi'],['Mürəbbə',8,'PDF-dəki 8 ₼ seçimi'],['Türk paxlavası',3],['Rület',3]],
 'hookah':[['Saxsı',10],['Qreyfurt',20],['Ananas',23],['Yemiş',25,'Mövsümə görə'],['Premium saxsı',20]],
 'cocktails':[['Shot set',14,'6 ədəd'],['Shot set',20,'12 ədəd'],['Shot set',35,'24 ədəd']],
 'nonalcoholic':[['Mojito',7],['Milkshake şokoladlı',7],['Milkshake çiyələkli',8],['Milkshake bananlı',8],['Milkshake oreo',8]],
 'whisky':[['Jameson',6,'50 ml'],['Jack Daniels',6,'50 ml'],['Chivas Regal 12',7,'50 ml'],['Ballantines',4,'50 ml']],
 'liqueur':[['Jagermeister',6,'50 ml'],['Jagermeister',65,'0.5 l'],['Jagermeister',75,'0.7 l'],['Jagermeister',85,'1 l'],['Rakı',6,'50 ml'],['Rakı',60,'0.5 l'],['Rakı',80,'0.7 l'],['Rakı',99,'1 l']]
};
export const officialItems=[...officialSets,...Object.entries(groups).flatMap(([category,rows])=>rows.map(([name,price,description=''],index)=>item(category+'-'+(index+1),category,name,price,description)))];
export const menuSource='DEM_RESTOPUB_Sekilli_Menu.pdf + dem_restopub_pive_setleri_poster.pdf';
