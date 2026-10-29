import { db, getSettings } from '../storage.js';
import { sampleCategories, sampleItems } from '../sample-menu.js';
const settings=await getSettings();
if(settings.items.length){console.log('Existing menu preserved; no sample items added.');}else{settings.categories=sampleCategories;settings.items=sampleItems;settings.sampleMenu=true;await db.prepare('UPDATE settings SET value=? WHERE id=1').run(JSON.stringify(settings));console.log('Clearly labelled sample menu added to empty menu.');}
