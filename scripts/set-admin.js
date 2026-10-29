import { setPassword } from '../storage.js';
import { createInterface } from 'node:readline/promises';
let password = process.env.DEM_ADMIN_PASSWORD;
if (!password) { const rl = createInterface({input:process.stdin,output:process.stdout}); password = await rl.question('Yeni admin şifrəsi (ən azı 12 simvol; terminalda görünəcək): '); rl.close(); }
try { await setPassword(password); console.log('Admin şifrəsi yeniləndi. /admin səhifəsindən daxil olun.'); } catch (error) { console.error(error.message); process.exitCode=1; }
