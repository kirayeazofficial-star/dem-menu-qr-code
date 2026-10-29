import { sampleCategories, sampleItems } from './sample-menu.js';
import { createClient } from '@libsql/client';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
const databaseUrl = process.env.TURSO_DATABASE_URL || process.env.TURSO_URL;
export const remoteStorage = Boolean(databaseUrl);
if (process.env.VERCEL && !remoteStorage) throw new Error('Vercel requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN. Local storage would lose restaurant data.');
if (remoteStorage && !process.env.TURSO_AUTH_TOKEN) throw new Error('TURSO_AUTH_TOKEN is required.');
export const dataDir = resolve(process.env.DATA_DIR || 'data');
if (!remoteStorage) mkdirSync(dataDir, {recursive:true,mode:0o700});
const client=createClient({url:databaseUrl||`file:${resolve(dataDir,'dem.sqlite')}`,authToken:process.env.TURSO_AUTH_TOKEN});
export const db={prepare(sql){return {async get(...args){return (await client.execute({sql,args})).rows[0];},async run(...args){return client.execute({sql,args});}};},async exec(sql){return client.executeMultiple(sql);}};
await db.exec(`CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY, value TEXT NOT NULL); CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY, hash TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, expires INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, mime TEXT NOT NULL, bytes BLOB NOT NULL); CREATE TABLE IF NOT EXISTS login_attempts (ip TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);`);
export function hashPassword(password){const salt=randomBytes(16).toString('hex');return `${salt}:${scryptSync(password,salt,64).toString('hex')}`;}
export function verifyPassword(password,hash){try{const [salt,key]=hash.split(':');return timingSafeEqual(Buffer.from(key,'hex'),scryptSync(password,salt,64));}catch{return false;}}
export async function setPassword(password){if(typeof password!=='string'||password.length<12||password.length>512)throw new Error('Şifrə 12–512 simvol olmalıdır.');await db.prepare('INSERT OR REPLACE INTO admin VALUES (1, ?)').run(hashPassword(password));await db.exec('DELETE FROM sessions');}
export const defaults={name:'Dəm RestoPub',tagline:'Yaxşı dadlar. Xoş anlar.',description:'Məkanımıza xoş gəlmisiniz. Menyumuzu kəşf edin, rahatlayın və anın dadını çıxarın.',phone:'+994 70 686 12 11',address:'Buzovna, Zuğulba 24 B',mapUrl:'',wifiName:'',wifiPassword:'',hours:'',instagram:'',tiktok:'https://www.tiktok.com/@cahanhsv',profileImage:'',coverImage:'',publicUrl:'',currency:'₼',sampleMenu:true,categories:sampleCategories,items:sampleItems};
await db.prepare('INSERT OR IGNORE INTO settings VALUES (1, ?)').run(JSON.stringify(defaults));
if(process.env.DEM_ADMIN_PASSWORD){if(process.env.DEM_ADMIN_PASSWORD.length<12)throw new Error('DEM_ADMIN_PASSWORD must contain at least 12 characters');await db.prepare('INSERT OR IGNORE INTO admin VALUES (1, ?)').run(hashPassword(process.env.DEM_ADMIN_PASSWORD));}
export async function getSettings(){const row=await db.prepare('SELECT value FROM settings WHERE id=1').get();return {...defaults,...JSON.parse(row.value)};}
