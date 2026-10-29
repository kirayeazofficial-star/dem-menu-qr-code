// Catch initialization failures so admin clients receive JSON instead of a platform crash page.
export default async function handler(req,res){
  try{
    const {default:app}=await import('../server.js');
    return app(req,res);
  }catch(error){
    const code=typeof error?.code==='string'&&/^[A-Z0-9_]{1,60}$/.test(error.code)?error.code:'DEM_STARTUP_FAILED';
    console.error('DEM API initialization failed',{code,name:error?.name||'Error'});
    const messages={
      DEM_DATABASE_URL_MISSING:'Bu yayımda baza ünvanı yoxdur. Vercel Production dəyişənlərində TURSO_DATABASE_URL və ya TURSO_URL olmalıdır.',
      DEM_DATABASE_TOKEN_MISSING:'Bu yayımda baza açarı yoxdur. Vercel Production dəyişənlərində TURSO_AUTH_TOKEN olmalıdır.',
      DEM_ADMIN_PASSWORD_INVALID:'Admin şifrəsi 12–512 simvol olmalıdır. Vercel-də DEM_ADMIN_PASSWORD dəyərini yeniləyib Redeploy edin.'
    };
    if(!res.headersSent){res.statusCode=503;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify({error:messages[code]||'Server baza bağlantısını başlada bilmədi. Vercel Logs bölməsində DEM API initialization failed qeydini yoxlayın.',code}));}
  }
}
