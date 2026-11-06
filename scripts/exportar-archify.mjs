import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {pathToFileURL} from 'node:url';

// Dependencia externa, instalada fuera del repositorio. Utiliza el menú nativo Archify.
const modulePath=process.env.PLAYWRIGHT_MODULE??path.join(os.tmpdir(),'sifitur-diagram-tools/browser/node_modules/playwright/index.mjs');
const {chromium}=await import(pathToFileURL(modulePath));
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
  const page=await browser.newPage({viewport:{width:1600,height:1100},acceptDownloads:true});
  const allDiagrams=JSON.parse(fs.readFileSync('diagrams/archify-manifest.json','utf8'));
  const slugIndex=process.argv.indexOf('--slug');
  const requestedSlug=slugIndex>=0?process.argv[slugIndex+1]:null;
  const manifest=requestedSlug?allDiagrams.filter(d=>d.slug===requestedSlug):allDiagrams;
  if(slugIndex>=0&&(!requestedSlug||!manifest.length))throw new Error('Diagrama Archify no encontrado.');
  for (const d of manifest) {
    await page.goto(pathToFileURL(path.resolve(d.output)).href);
    await page.waitForLoadState('networkidle');
    if(process.argv.includes('--inspect')) {
      await page.locator('#btn-export').click();
      console.log(await page.locator('button:visible').evaluateAll(bs=>bs.map(b=>({text:b.textContent.trim(),role:b.getAttribute('role'),id:b.id}))));
      await page.locator('button').filter({hasText:/SVG · Claro/}).click();
      console.log('AFTER',await page.locator('button:visible').evaluateAll(bs=>bs.map(b=>({text:b.textContent.trim(),role:b.getAttribute('role'),id:b.id}))));
      await page.screenshot({path:path.join(os.tmpdir(),'sifitur-diagram-tools/export-debug.png'),fullPage:true});
      break;
    }
    for(const [format,name] of [['svg',/^SVG · Claro/],['png',/^PNG/],['jpg',/^JPEG/]]) {
      await page.locator('#btn-export').click();
      const [download]=await Promise.all([page.waitForEvent('download',{timeout:30000}),page.locator('button').filter({hasText:name}).click()]);
      const destination=format==='svg'?`img/fuentes-svg/${d.slug}.svg`:`img/${d.slug}.${format}`;
      await download.saveAs(destination);
      if((await download.failure())!==null) throw new Error(`Exportación fallida: ${d.slug}`);
      if(format==='svg') {
        // Normaliza solo espacios de fin de línea del CSS exportado por el visor.
        fs.writeFileSync(destination,fs.readFileSync(destination,'utf8').replace(/[\t ]+$/gm,''));
      }
    }
    console.log(`Exportado: ${d.slug}`);
  }
} finally {await browser.close();}
