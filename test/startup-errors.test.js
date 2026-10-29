import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
test('serverless startup returns safe JSON for missing Production database bindings',()=>{
 for(const scenario of ['url','token']){
  const environment={...process.env,VERCEL:'1'};delete environment.TURSO_DATABASE_URL;delete environment.TURSO_URL;delete environment.TURSO_AUTH_TOKEN;delete environment.DEM_ADMIN_PASSWORD;
  if(scenario==='token')environment.TURSO_DATABASE_URL='libsql://test-only.invalid';
  if(scenario==='url')environment.TURSO_AUTH_TOKEN='test-only-do-not-expose';
  const script=`const {default:handler}=await import('./api/index.js');const headers={};const res={headersSent:false,setHeader(k,v){headers[k]=v;},end(body){console.log(JSON.stringify({status:this.statusCode,headers,body:JSON.parse(body)}));}};await handler({},res);`;
  const run=spawnSync(process.execPath,['--input-type=module','-e',script],{env:environment,encoding:'utf8'});assert.equal(run.status,0,run.stderr);
  const response=JSON.parse(run.stdout);assert.equal(response.status,503);assert.match(response.headers['Content-Type'],/application\/json/);assert.equal(response.headers['Cache-Control'],'no-store');assert.equal(response.body.code,scenario==='url'?'DEM_DATABASE_URL_MISSING':'DEM_DATABASE_TOKEN_MISSING');assert.ok(!run.stdout.includes('test-only-do-not-expose'));assert.ok(!run.stderr.includes('test-only-do-not-expose'));
 }
});
