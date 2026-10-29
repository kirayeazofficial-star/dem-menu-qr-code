import { officialCategories, officialItems } from './official-menu.js';
import { sampleCategories, sampleItems } from './sample-menu.js';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
const databaseUrl = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL;
export const remoteStorage = Boolean(databaseUrl);
if (process.env.VERCEL && !remoteStorage) throw Object.assign(new Error('Database URL missing'),{code:'DEM_DATABASE_URL_MISSING'});
if (remoteStorage && !process.env.TURSO_AUTH_TOKEN) throw Object.assign(new Error('Database token missing'),{code:'DEM_DATABASE_TOKEN_MISSING'});
export const dataDir = resolve(process.env.DATA_DIR || 'data');
if (!remoteStorage) mkdirSync(dataDir, {recursive:true,mode:0o700});
// Remote Vercel functions use stateless HTTPS; local development retains SQLite.
const {createClient}=remoteStorage?await import('@libsql/client/http'):await import('@libsql/client');
const client=createClient({url:remoteStorage?databaseUrl.replace(/^libsql:/,'https:'):`file:${resolve(dataDir,'dem.sqlite')}`,authToken:process.env.TURSO_AUTH_TOKEN});
export const db={prepare(sql){return {async get(...args){return (await client.execute({sql,args})).rows[0];},async run(...args){return client.execute({sql,args});}};},async exec(sql){return client.executeMultiple(sql);}};
await db.exec(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, value TEXT NOT NULL); CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY, hash TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, mime TEXT NOT NULL, bytes BLOB NOT NULL); CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY); CREATE TABLE IF NOT EXISTS login_attempts (ip TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
export function hashPassword(password){const salt=randomBytes(16).toString('hex');return `${salt}:${scryptSync(password,salt,64).toString('hex')}`;}
export function verifyPassword(password,hash){try{const [salt,key]=hash.split(':');return timingSafeEqual(Buffer.from(key,'hex'),scryptSync(password,salt,64));}catch{return false;}}
export async function setPassword(password){if(typeof password!=='string'||password.length<12||password.length>512)throw new Error('Şifrə 12–512 simvol olmalıdır.');await db.prepare('INSERT OR REPLACE INTO admin VALUES (1, ?)').run(hashPassword(password));await db.exec('DELETE FROM sessions');}
export const defaults={name:'Dəm RestoPub',tagline:'Yaxşı dadlar. Xoş anlar.',description:'Məkanımıza xoş gəlmisiniz. Menyumuzu kəşf edin, rahatlayın və anın dadını çıxarın.',phone:'+994 70 686 12 11',address:'Buzovna, Zuğulba 24 B',mapUrl:'',wifiName:'Dəm RestoPub',wifiPassword:'12345',hours:'18:00–01:00',instagram:'',tiktok:'https://www.tiktok.com/@cahanhsv',profileImage:'',coverImage:'',publicUrl:'',currency:'₼',sampleMenu:false,categories:officialCategories,items:officialItems};
await db.prepare('INSERT OR IGNORE INTO settings VALUES (1, ?)').run(JSON.stringify(defaults));
// Upgrade only the illustrative menu, once; preserve all owner edits and deletions thereafter.
if(!await db.prepare('SELECT name FROM migrations WHERE name=?').get('sample-sets-v1')){
  const row=await db.prepare('SELECT value FROM settings WHERE id=1').get();
  const saved=JSON.parse(row.value);
  if(saved.sampleMenu===true){
    const newItems=sampleItems.filter(item=>Number.isInteger(item.sampleSetPhoto)&&!saved.items.some(old=>old.id===item.id));
    const newCategories=sampleCategories.filter(cat=>['sets','hookah'].includes(cat.id)&&!saved.categories.some(old=>old.id===cat.id));
    saved.items=[...newItems,...saved.items];saved.categories=[...newCategories,...saved.categories];
    const update=await db.prepare('UPDATE settings SET value=? WHERE id=1 AND value=?').run(JSON.stringify(saved),row.value);
    if(update.rowsAffected)await db.prepare('INSERT OR IGNORE INTO migrations VALUES (?)').run('sample-sets-v1');
  }else{await db.prepare('INSERT OR IGNORE INTO migrations VALUES (?)').run('sample-sets-v1');}
}
// Add screenshot-inspired sample items once without replacing existing menu edits.
if(!await db.prepare('SELECT name FROM migrations WHERE name=?').get('sample-extras-v1')){
  const row=await db.prepare('SELECT value FROM settings WHERE id=1').get();
  const saved=JSON.parse(row.value);
  if(saved.sampleMenu===true){
    const added=sampleItems.filter(item=>Number.isInteger(item.sampleExtraPhoto)&&!saved.items.some(old=>old.id===item.id));
    const categories=sampleCategories.filter(cat=>cat.id==='fruit'&&!saved.categories.some(old=>old.id===cat.id));
    saved.items=[...saved.items,...added];saved.categories=[...saved.categories,...categories];
    const result=await db.prepare('UPDATE settings SET value=? WHERE id=1 AND value=?').run(JSON.stringify(saved),row.value);
    if(result.rowsAffected)await db.prepare('INSERT OR IGNORE INTO migrations VALUES (?)').run('sample-extras-v1');
  }else{await db.prepare('INSERT OR IGNORE INTO migrations VALUES (?)').run('sample-extras-v1');}
}
// Owner-requested public guest Wi-Fi and opening hours; apply once, preserve later edits.
if(!await db.prepare('SELECT name FROM migrations WHERE name=?').get('venue-hours-wifi-v1')){
  const row=await db.prepare('SELECT value FROM settings WHERE id=1').get();const saved=JSON.parse(row.value);
  saved.wifiName='Dəm RestoPub';saved.wifiPassword='12345';saved.hours='18:00–01:00';
  const result=await db.prepare('UPDATE settings SET value=? WHERE id=1 AND value=?').run(JSON.stringify(saved),row.value);
  if(result.rowsAffected)await db.prepare('INSERT OR IGNORE INTO migrations VALUES (?)').run('venue-hours-wifi-v1');
}
// Owner-authorized import from their PDFs; keep a recoverable copy and unrelated custom entries.
await db.exec('CREATE TABLE IF NOT EXISTS settings_backups (name TEXT PRIMARY KEY, value TEXT NOT NULL)');
if(!await db.prepare('SELECT name FROM migrations WHERE name=?').get('owner-pdf-menu-v1')){
  const row=await db.prepare('SELECT value FROM settings WHERE id=1').get();const previous=JSON.parse(row.value);
  const customItems=previous.items.filter(item=>!item.id.startsWith('demo-')&&!officialItems.some(official=>official.id===item.id));
  const referenced=new Set(customItems.map(item=>item.category));
  const customCategories=previous.categories.filter(category=>!officialCategories.some(official=>official.id===category.id)&&(!sampleCategories.some(sample=>sample.id===category.id)||referenced.has(category.id)));
  const next={...previous,sampleMenu:false,categories:[...officialCategories,...customCategories],items:[...officialItems,...customItems]};
  const serialized=JSON.stringify(next);
  await client.batch([
    {sql:'INSERT OR IGNORE INTO settings_backups VALUES (?,?)',args:['before-owner-pdf-menu-v1',row.value]},
    {sql:'UPDATE settings SET value=? WHERE id=1 AND value=?',args:[serialized,row.value]},
    {sql:'INSERT OR IGNORE INTO migrations SELECT ? WHERE EXISTS (SELECT 1 FROM settings WHERE id=1 AND value=?)',args:['owner-pdf-menu-v1',serialized]}
  ],'write');
}
// Apply each new environment password once; an older deployment must not revert a rotation.
if(process.env.DEM_ADMIN_PASSWORD){
  const password=process.env.DEM_ADMIN_PASSWORD;
  if(password.length<12||password.length>512)throw Object.assign(new Error('Admin password length invalid'),{code:'DEM_ADMIN_PASSWORD_INVALID'});
  const marker='admin-env:'+scryptSync(password,'dem-environment-rotation-v1',32).toString('hex');
  if(!await db.prepare('SELECT name FROM migrations WHERE name=?').get(marker)){
    const admin=await db.prepare('SELECT hash FROM admin WHERE id=1').get();
    if(!admin||!verifyPassword(password,admin.hash)){
      await client.batch([
        {sql:'INSERT OR REPLACE INTO admin VALUES (1, ?)',args:[hashPassword(password)]},
        {sql:'DELETE FROM sessions',args:[]},
        {sql:'INSERT OR IGNORE INTO migrations VALUES (?)',args:[marker]}
      ],'write');
    }else{await db.prepare('INSERT OR IGNORE INTO migrations VALUES (?)').run(marker);}
  }
}
export async function getSettings(){const row=await db.prepare('SELECT value FROM settings WHERE id=1').get();return {...defaults,...JSON.parse(row.value)};}
