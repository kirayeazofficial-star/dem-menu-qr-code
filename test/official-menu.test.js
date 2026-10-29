import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createClient} from '@libsql/client';
import {officialCategories,officialItems,officialSets} from '../official-menu.js';
test('eight beer sets match the supplied poster prices and preserve original panel assets',()=>{
 assert.deepEqual(officialSets.map(i=>i.price),[14,25.6,22.8,45.3,39.4,73.8,54,105]);
 assert.deepEqual(officialSets.map(i=>i.name),['4 bakal pivə','8 bakal pivə','8 bakal pivə','12 bakal pivə','12 bakal pivə','20 bakal pivə','20 bakal pivə','20 bakal pivə']);
 for(const set of officialSets){assert.ok(existsSync(new URL('../public'+set.image,import.meta.url)));assert.ok(set.description.length>10);}
 assert.equal(new Set(officialItems.map(i=>i.id)).size,officialItems.length);
 const categories=new Set(officialCategories.map(c=>c.id));assert.ok(officialItems.every(i=>categories.has(i.category)));
 assert.equal(officialItems.find(i=>i.category==='pdf-khinkali').price,1);
 assert.deepEqual(officialItems.filter(i=>i.name==='Sac çolpa').map(i=>i.price),[12,18]);
});
test('PDF import backs up old settings, removes demos, preserves custom data and runs once',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'dem-import-'));const client=createClient({url:'file:'+join(dir,'dem.sqlite')});
 try{
  const previous={name:'Owner venue',phone:'+994 70 686 12 11',profileImage:'/uploads/owner-logo.png',wifiName:'Owner Wi-Fi',wifiPassword:'owner-guest',hours:'20:00–02:00',sampleMenu:true,categories:[{id:'beer',name:'Old beer'},{id:'custom',name:'Owner category'}],items:[{id:'demo-lager',category:'beer',name:'Demo',price:1,description:'',available:true,image:''},{id:'custom-cake',category:'custom',name:'Owner cake',price:23,description:'Keep me',available:true,image:''}]};
  await client.executeMultiple('CREATE TABLE settings(id INTEGER PRIMARY KEY,value TEXT NOT NULL);CREATE TABLE migrations(name TEXT PRIMARY KEY);');
  await client.execute({sql:'INSERT INTO settings VALUES(1,?)',args:[JSON.stringify(previous)]});
  for(const name of ['sample-sets-v1','sample-extras-v1','venue-hours-wifi-v1'])await client.execute({sql:'INSERT INTO migrations VALUES (?)',args:[name]});
  const run=()=>{const {DEM_ADMIN_PASSWORD:unused,...environment}=process.env;const r=spawnSync(process.execPath,['--input-type=module','-e',"await import('./storage.js')"],{env:{...environment,DATA_DIR:dir},encoding:'utf8'});assert.equal(r.status,0,r.stderr);};
  run();let saved=JSON.parse((await client.execute('SELECT value FROM settings WHERE id=1')).rows[0].value);
  assert.equal(saved.sampleMenu,false);assert.equal(saved.items.length,officialItems.length+1);assert.ok(!saved.items.some(i=>i.id.startsWith('demo-')));assert.equal(saved.items.find(i=>i.id==='custom-cake').price,23);assert.equal(saved.profileImage,previous.profileImage);assert.equal(saved.wifiPassword,previous.wifiPassword);assert.equal(saved.hours,previous.hours);
  const backup=JSON.parse((await client.execute("SELECT value FROM settings_backups WHERE name='before-owner-pdf-menu-v1'")).rows[0].value);assert.deepEqual(backup,previous);
  saved.items=saved.items.filter(i=>i.id!=='pdf-set-1');await client.execute({sql:'UPDATE settings SET value=? WHERE id=1',args:[JSON.stringify(saved)]});run();saved=JSON.parse((await client.execute('SELECT value FROM settings WHERE id=1')).rows[0].value);assert.ok(!saved.items.some(i=>i.id==='pdf-set-1'));
 }finally{client.close();rmSync(dir,{recursive:true,force:true});}
});
