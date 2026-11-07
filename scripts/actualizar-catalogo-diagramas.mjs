import fs from 'node:fs';
import path from 'node:path';

const manifest=JSON.parse(fs.readFileSync('diagrams/archify-manifest.json','utf8'));
const c4=['nivel1-contexto','nivel2-contenedores','componentes','nivel3-componentes','nivel4-clases','nivel4-registro','nivel4-secuencia','nivel4-agregado'];
const title=d=>JSON.parse(fs.readFileSync(d.input,'utf8')).meta.title.replace('SIFITUR · ','');
const rel=(from,to)=>path.relative(path.dirname(from),to).replaceAll('\\','/');
const mdlink=(label,p)=>`[${label}](${p.replaceAll(' ','%20')})`;
const htmlEscape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const rows=manifest.map(d=>`<tr><td>${htmlEscape(title(d))}</td><td><a href="${rel('diagrams/index.html',d.output)}">Abrir Archify</a></td><td><a href="${rel('diagrams/index.html',d.input)}">JSON</a></td><td><a href="../img/${d.slug}.jpg">JPG</a> · <a href="../img/${d.slug}.png">PNG</a> · <a href="../img/fuentes-svg/${d.slug}.svg">SVG</a></td></tr>`).join('\n');
const c4rows=c4.map(slug=>`<tr><td>${slug}</td><td><a href="structurizr/site/index.html?diagram=${slug}">Abrir Structurizr</a></td><td><a href="../img/${slug}.jpg">JPG</a> · <a href="../img/${slug}.png">PNG</a> · <a href="../img/fuentes-svg/${slug}.svg">SVG</a></td></tr>`).join('\n');
fs.writeFileSync('diagrams/index.html',`<!doctype html>
<html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Diagramas · SIFITUR Huamanga</title>
<style>body{font:17px/1.6 system-ui,sans-serif;color:#173451;background:#f4f7fa;max-width:1100px;margin:40px auto;padding:0 24px}h1{line-height:1.15}h2{margin-top:48px}table{border-collapse:collapse;width:100%;background:white}th,td{text-align:left;padding:12px 16px;border-bottom:1px solid #d9e2eb}a{color:#165a9a}p{max-width:85ch}code{background:#e5ecf2;padding:2px 5px}</style>
<h1>Diagramas de SIFITUR Huamanga</h1><p>Arquitectura propuesta para la fiscalización turística. Diagramas generales elaborados con Archify; modelo C4 y navegación entre sus cuatro niveles gestionados con Structurizr.</p>
<p><a href="README.md">Edición y regeneración</a> · <a href="../README.md">Documentación del proyecto</a></p>
<h2>C4 · Structurizr</h2><p><a href="structurizr/workspace.dsl">Modelo workspace.dsl</a>. Niveles 1–3 nativos; nivel 4 integrado mediante vistas de imagen UML vinculadas al componente Inspecciones, con fuentes PlantUML editables y renderizado local.</p><table><thead><tr><th>Vista</th><th>Visor</th><th>Exportaciones</th></tr></thead><tbody>${c4rows}</tbody></table>
<h2>Arquitectura y diseño · Archify</h2><p>Los visores autónomos permiten explorar nodos, consultar fuentes, cambiar tema y exportar imágenes. Cada candidato JSON conserva la referencia al documento y revisión que fundamentaron el diseño.</p><table><thead><tr><th>Diagrama</th><th>Visor</th><th>Fuente editable</th><th>Exportaciones</th></tr></thead><tbody>${rows}</tbody></table>
<p>Las métricas y garantías representan objetivos de diseño pendientes de validación sobre una implementación.</p></html>\n`);

function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const filename of walk('docs').filter(p=>p.endsWith('.md'))){
  let content=fs.readFileSync(filename,'utf8').replace(/\r\n/g,'\n');
  const sourceHeading=content.match(/^## (?:\d+\. )?Herramientas y fuentes de diagramas$/m)?.[0]??'## Herramientas y fuentes de diagramas';
  content=content.split(/\n## (?:\d+\. )?Herramientas y fuentes de diagramas\n/)[0].trimEnd();
  const isC4=filename.replaceAll('\\','/').includes('/04-modelo-c4/')||filename.replaceAll('\\','/').endsWith('/componentes-arquitectonicos.md');
  if(isC4){
    content=content.replaceAll('/clases-modulo-inspecciones.','/nivel4-agregado.').replaceAll('/secuencia-registrar-inspeccion.','/nivel4-registro.');
  }
  content=content.replace(/(!\[[^\]]*\]\([^)]*\/img\/[^/()]+)\.png(\))/g,'$1.jpg$2');
  const images=[...new Set([...content.matchAll(/!\[[^\]]*\]\([^)]*\/([^/()]+)\.(?:jpg|png)\)/g)].map(m=>m[1]))];
  if(!images.length)continue;
  content=content.replaceAll('Fuente editable:','Exportación SVG:').replaceAll('Fuentes editables:','Exportaciones SVG:').replaceAll('## Fuentes editables','## Exportaciones SVG');
  let section='\n\n'+sourceHeading+'\n\n';
  if(isC4){
    section+=`Estas vistas se gestionan en **Structurizr** desde ${mdlink('workspace.dsl',rel(filename,'diagrams/structurizr/workspace.dsl'))}. ${mdlink('Abrir el visor C4',rel(filename,'diagrams/structurizr/site/index.html'))}.\n\n`;
    section+='Los niveles 1–3 son vistas nativas del modelo. Structurizr integra el nivel 4 como vistas de imagen vinculadas al componente Inspecciones; las clases y secuencias se mantienen en PlantUML y se renderizan localmente.\n\n';
    section+='| Vista | Fuente | Visor |\n|---|---|---|\n';
    for(const slug of images.filter(s=>c4.includes(s))){
      const source=slug.startsWith('nivel4-')?`diagrams/structurizr/${slug}.puml`:'diagrams/structurizr/workspace.dsl';
      section+=`| ${slug} | ${mdlink(slug.startsWith('nivel4-')?'UML editable':'Modelo DSL',rel(filename,source))} | ${mdlink('Structurizr',rel(filename,'diagrams/structurizr/site/index.html')+`?diagram=${slug}`)} |\n`;
    }
  }else{
    section+='Estos diagramas se elaboran con **Archify**, conforme al contenido de este documento. Cada imagen JPG se guarda en `img/` y se incrusta en su sección correspondiente. El JSON es la fuente editable; JPG, PNG y SVG son exportaciones generadas desde su visor nativo.\n\n| Diagrama | Fuente | Visor |\n|---|---|---|\n';
    for(const slug of images){const d=manifest.find(d=>d.slug===slug);if(d)section+=`| ${title(d)} | ${mdlink('JSON Archify',rel(filename,d.input))} | ${mdlink('HTML interactivo',rel(filename,d.output))} |\n`;}
    if(images.includes('estados-expediente')){
      section+='\nEl seguimiento de subsanaciones se complementa con máquinas independientes de captura, emisión y notificación:\n\n';
      for(const slug of ['estados-captura','estados-emision','estados-notificacion']){
        const d=manifest.find(d=>d.slug===slug);
        if(!images.includes(slug))section+=`- ${mdlink(title(d),rel(filename,d.output))}: ${mdlink('JSON',rel(filename,d.input))}.\n`;
      }
    }
  }
  section+=`\n${mdlink('Catálogo y reproducción de diagramas',rel(filename,'diagrams/README.md'))}.\n`;
  fs.writeFileSync(filename,content+section);
}
console.log('Catálogo y referencias actualizados.');
