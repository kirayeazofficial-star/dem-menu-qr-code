import { writeFileSync } from 'node:fs';
import { sampleCategories, sampleItems } from '../sample-menu.js';
// This file is public. Never put credentials or unpublished admin data here.
const demo={name:'Dəm RestoPub',tagline:'Yaxşı dadlar. Xoş anlar.',description:'',phone:'+994 70 686 12 11',address:'Buzovna, Zuğulba 24 B',mapUrl:'',wifiName:'',wifiPassword:'',hours:'',instagram:'',tiktok:'https://www.tiktok.com/@cahanhsv',profileImage:'',coverImage:'',publicUrl:'',currency:'₼',sampleMenu:true,categories:sampleCategories,items:sampleItems};
writeFileSync(new URL('../public/sample-menu.json',import.meta.url),JSON.stringify(demo));
