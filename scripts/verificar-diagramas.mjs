import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Comprobaciones de publicación y reglas concretas del diseño documentado.
// La interpretación de responsabilidades y alcance se registra en verificacion-final.md.
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const read=p=>fs.readFileSync(p,'utf8');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// Git puede materializar CRLF en Windows; los recibos originales usan LF.
const receiptMatches=(file,expected)=>hash(file)===expected||crypto.createHash('sha256').update(read(file).replaceAll('\r\n','\n')).digest('hex')===expected;
const manifest=JSON.parse(read('diagrams/archify-manifest.json'));
const docs=walk('docs').filter(p=>p.endsWith('.md'));
const docText=docs.map(p=>read(p)).join('\n');
const errors=[];
const rules=[];
function check(rule,condition){rules.push({rule,result:condition?'conforme':'error'});if(!condition)errors.push(rule);}
const specs=new Map(manifest.map(d=>[d.slug,JSON.parse(read(d.input))]));
const clean=specs.get('arquitectura-limpia-sifitur');
const layerMembers={presentacion:['controller','worker_entry','notices'],aplicacion:['register','emit'],dominio:['inspection','evidence','acta','rules','repo','store','pdf_port','notice_port'],infraestructura:['pg','s3','pdf_adapter','mail']};
check('Enfoque organizado: cuatro capas con sus responsabilidades documentadas',clean.boundaries.length===4&&Object.values(layerMembers).every(ids=>clean.boundaries.some(b=>ids.every(id=>b.wraps.includes(id)))));
check('Enfoque organizado: dominio contenido en el marco de aplicación',clean.boundaries.some(b=>[...layerMembers.aplicacion,...layerMembers.dominio].every(id=>b.wraps.includes(id))));
check('Enfoque organizado: cada adaptador realiza su puerto y accede a su recurso', [['pg','repo','postgres_resource'],['s3','store','s3_resource'],['pdf_adapter','pdf_port','pdf_resource'],['mail','notice_port','gateway_resource']].every(([adapter,port,resource])=>clean.connections.some(r=>r.from===adapter&&r.to===port&&r.label==='Realiza')&&clean.connections.some(r=>r.from===adapter&&r.to===resource)&&[adapter,port,resource].every(id=>clean.components.find(c=>c.id===id)?.pos[1]===clean.components.find(c=>c.id===port)?.pos[1])));
check('Enfoque ampliado: cuatro puertos y cuatro realizaciones', ['repo','store','pdf_port','notice_port'].every(id=>clean.connections.some(r=>r.to===id&&r.label==='Realiza'&&r.variant==='dashed')));
check('Enfoque ampliado: casos de uso sin dependencia de adaptadores concretos',clean.connections.filter(r=>['register','emit'].includes(r.from)).every(r=>['inspection','repo','store','pdf_port'].includes(r.to)));
check('Enfoque ampliado: invariantes del dominio limitadas a RN-01 a RN-03',clean.components.find(c=>c.id==='rules').tag==='RN-01 a RN-03');
check('Enfoque ampliado: raíz de composición y separación API/trabajador',clean.components.some(c=>c.id==='composition'&&c.label.includes('InspeccionesModule'))&&clean.components.find(c=>c.id==='register').tag.includes('API')&&clean.components.find(c=>c.id==='emit').tag.includes('trabajador'));
const native=JSON.parse(read('diagrams/structurizr/modelo/workspace.json'));
const system=native.model.softwareSystems.find(s=>s.name==='SIFITUR Huamanga');
const elements=[...(native.model.people??[]),...native.model.softwareSystems,...system.containers,...system.containers.flatMap(c=>c.components??[])];
const byIdentifier=id=>elements.find(e=>e.properties?.['structurizr.dsl.identifier']===id);
const relationships=elements.flatMap(e=>e.relationships??[]);
const hasRelation=(from,to)=>relationships.some(r=>r.sourceId===byIdentifier(from)?.id&&r.destinationId===byIdentifier(to)?.id);
const states=(slug)=>specs.get(slug).states.map(s=>s.label);
const transitions=(slug,from,to)=>specs.get(slug).transitions.some(r=>r.from===from&&r.to===to);
check('C4 N1: cinco actores humanos',native.model.people.length===5);
check('C4 N1: cuatro sistemas externos',native.model.softwareSystems.filter(s=>s.id!==system.id).length===4);
check('C4 N2: once contenedores lógicos web documentados',system.containers.length===11);
check('C4 N3: dieciséis grupos de componentes documentados',byIdentifier('api').components.length===16);
check('Trabajador fuera de la frontera del Backend API',system.containers.some(c=>c.id===byIdentifier('worker').id));
check('La API no publica directamente en RabbitMQ',!hasRelation('api','broker'));
check('Trabajador conectado a primaria, broker, objetos, Redis y pasarela',['primary','broker','objects','redis','pasarela'].every(id=>hasRelation('worker',id)));
const containerView=native.views.containerViews.find(v=>v.key==='nivel2-contenedores');
const visibleRelations=new Set(containerView.relationships.map(r=>r.id));
check('Clientes de N2 pasan por gateway; enlaces inferidos directos a API excluidos',['consola','portal','publico'].every(id=>hasRelation(id,'gateway')&&!relationships.some(r=>r.sourceId===byIdentifier(id).id&&r.destinationId===byIdentifier('api').id&&visibleRelations.has(r.id))));
check('Consulta pública sin JWT y a través de su proyección',/sin JWT/.test(byIdentifier('query').description)&&hasRelation('query','cache'));
check('Revalidación de formalidad desde primaria y lectura de indicadores desde réplica',hasRelation('cache','primary')&&hasRelation('reports','replica'));
check('Nivel 4: cuatro vistas de imagen vinculadas a Inspecciones',native.views.imageViews.length===4&&native.views.imageViews.every(v=>v.elementId===byIdentifier('inspection').id));
check('Registro web: solo BORRADOR, LISTA y RECIBIDA',JSON.stringify(states('estados-captura'))===JSON.stringify(['BORRADOR','LISTA','RECIBIDA']));
check('Conflicto de registro web conserva LISTA',transitions('estados-captura','ready','ready'));
check('Emisión: RECIBIDA, EMITIDA y ANULADA; error no abandona RECIBIDA',JSON.stringify(states('estados-emision'))===JSON.stringify(['RECIBIDA','EMITIDA','ANULADA'])&&transitions('estados-emision','received','received'));
check('Notificación: aceptación distinta de entrega, con revisión y reintento',JSON.stringify(states('estados-notificacion'))===JSON.stringify(['PENDIENTE','ACEPTADA','ENTREGADA','REVISIÓN'])&&transitions('estados-notificacion','pending','pending'));
check('Subsanación: rechazo vuelve a pendiente y derivaciones requieren autorización',transitions('estados-expediente','review','pending')&&['expired','repeat'].every(from=>specs.get('estados-expediente').transitions.some(r=>r.from===from&&r.to==='sanction'&&r.label==='Coordinador autoriza')));
const dip=specs.get('principio-dip');
check('DIP: nombres completos de adaptadores documentados',['RepositorioInspeccionesPostgres','AlmacenEvidenciasS3','GeneradorActasPdf','NotificadorInstitucional'].every(name=>dip.types.some(t=>t.label===name)));
check('DIP: los casos de uso dependen de interfaces, no de adaptadores',dip.relationships.filter(r=>['register','emit'].includes(r.from)).every(r=>dip.types.find(t=>t.id===r.to)?.kind==='interface'));
const aggregate=specs.get('clases-modulo-inspecciones');
check('Agregado: integridad del acta y vínculo de firma explícitos',aggregate.types.find(t=>t.id==='acta').attributes.some(a=>a.name==='hash')&&aggregate.types.find(t=>t.id==='signature').attributes.some(a=>a.name==='vinculoInspeccion'));
check('Agregado: evidencias 1..* y acta 0..1',aggregate.relationships.some(r=>r.to==='evidence'&&r.kind==='composition'&&r.label==='1 a 1..*')&&aggregate.relationships.some(r=>r.to==='acta'&&r.label==='1 a 0..1'));
const sequence=specs.get('secuencia-registrar-inspeccion');
check('Registro web: T1 e integridad condicionadas a operación nueva',sequence.messages.filter(m=>m.id==='paso-7'||m.id==='paso-9').every(m=>m.label.startsWith('Solo nueva')));
check('Registro web: reenvío idéntico 200 y conflicto 409 terminan sin T1',sequence.messages.some(m=>m.note?.includes('200')&&m.note.includes('409')&&m.note.includes('sin T1')));
const emission=read('diagrams/structurizr/nivel4-secuencia.puml');
check('Emisión UML: acuse posterior al commit y fallo de correo no revierte EMITIDA',emission.indexOf('EMITIDA + auditoría + ActaEmitida')<emission.indexOf('acuse después del commit')&&emission.includes('Error de correo no revierte EMITIDA'));
check('Inspector utiliza la consola institucional web',hasRelation('inspector','consola'));
check('Registro web mantiene formato e integridad de evidencias',docText.includes('formato, tamaño')&&docText.includes('SHA-256'));
check('Borradores documentados en PostgreSQL',docText.includes('POST /api/v1/inspecciones/borradores')&&docText.includes('BORRADOR y LISTA se conservan en PostgreSQL'));
const authoredSources=[...docs,'README.md','diagrams/structurizr/workspace.dsl',...manifest.map(d=>d.input),...walk('diagrams/structurizr').filter(p=>p.endsWith('.puml'))];
const prohibited=new RegExp(['m[oó]vil','flut'+'ter','sql'+'ite','off'+'line','sin cone'+'xi[oó]n','sin '+'red','desconectad'].join('|'),'i');
check('Alcance exclusivo web en documentación y fuentes de diagramas',authoredSources.every(p=>!prohibited.test(read(p))));
const c4=['nivel1-contexto','nivel2-contenedores','nivel3-componentes','nivel4-clases','nivel4-registro','nivel4-secuencia','nivel4-agregado'];
const artifacts=[];
for(const slug of [...manifest.map(d=>d.slug),...c4]){
  const jpg=`img/${slug}.jpg`,png=`img/${slug}.png`,svg=`img/fuentes-svg/${slug}.svg`;
  check(`${slug}: JPG incrustado en docs`,docText.includes('/'+slug+'.jpg)'));
  const paths=[jpg,png,svg];
  check(`${slug}: exportaciones presentes`,paths.every(p=>fs.existsSync(p)&&fs.statSync(p).size>0));
  if(!paths.every(p=>fs.existsSync(p)))continue;
  const svgLabels=[...read(svg).matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m=>m[1].replace(/<[^>]*>/g,'')).join(' ');
  check(`${slug}: etiquetas de la figura coherentes con el alcance web`,!prohibited.test(svgLabels));
  const b=fs.readFileSync(jpg);
  check(`${slug}: codificación JPEG real`,b[0]===255&&b[1]===216&&b.at(-2)===255&&b.at(-1)===217);
  const d=manifest.find(d=>d.slug===slug);
  if(d){
    const receipts=walk(path.dirname(d.input)).filter(p=>p.endsWith('.finalize-summary.json')).map(p=>({path:p,value:JSON.parse(read(p))}));
    const receipt=receipts.find(({value:r})=>r.status==='pass'&&receiptMatches(d.input,r.specification.sha256)&&receiptMatches(d.output,r.artifact.sha256)&&Object.values(r.gates).every(g=>g==='pass'));
    check(`${slug}: fuente y HTML coinciden con validación y browser-check`,!!receipt);
    artifacts.push({slug,source:d.input,sourceSha256:hash(d.input),html:d.output,htmlSha256:hash(d.output),receipt:receipt?.path,...Object.fromEntries(paths.map(p=>[p,hash(p)]))});
  }else{
    check(`${slug}: exportaciones publicadas coinciden con Structurizr`,hash(svg)===hash(`diagrams/structurizr/export/${slug}.svg`)&&hash(png)===hash(`diagrams/structurizr/export/${slug}.png`));
    artifacts.push({slug,workspaceSha256:hash('diagrams/structurizr/workspace.dsl'),...Object.fromEntries(paths.map(p=>[p,hash(p)]))});
  }
}
let checkedLinks=0;
for(const file of ['README.md','diagrams/README.md',...docs]){
  for(const m of read(file).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
    const target=decodeURIComponent(m[1].split(/[?#]/)[0]);
    if(!target||/^[a-z]+:/i.test(target))continue;
    if(!fs.existsSync(path.resolve(path.dirname(file),target)))errors.push(`Enlace roto: ${file} -> ${target}`);
    checkedLinks++;
  }
}
const report={date:'2026-11-06',scope:'Verificación documental y de artefactos; no prueba de una aplicación desplegada.',result:errors.length?'error':'conforme',docs:docs.map(p=>({path:p,sha256:hash(p)})),diagramCount:artifacts.length,checkedLinks,rules,artifacts,errors};
fs.writeFileSync('diagrams/verificacion-final.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({result:report.result,diagrams:artifacts.length,docs:docs.length,rules:rules.length,checkedLinks,errors},null,2));
if(errors.length)process.exitCode=1;
