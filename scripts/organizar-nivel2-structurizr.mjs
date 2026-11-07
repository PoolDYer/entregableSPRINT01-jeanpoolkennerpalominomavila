import fs from 'node:fs';
const input=process.argv[2]??'diagrams/structurizr/modelo/workspace.json';
const w=JSON.parse(fs.readFileSync(input,'utf8'));
const view=w.views.containerViews.find(v=>v.key==='nivel2-contenedores');
if(!view)throw new Error('No existe la vista nivel2-contenedores.');
const system=w.model.softwareSystems.find(s=>s.name==='SIFITUR Huamanga');
const elements=[...w.model.people,...w.model.softwareSystems,...system.containers];
const ids=new Map(elements.map(e=>[e.properties?.['structurizr.dsl.identifier'],e.id]));
const identifier=new Map([...ids].map(([key,id])=>[id,key]));
// Posiciones nativas de Structurizr. El modelo DSL conserva toda la semántica.
const positions={inspector:[80,100],coordinador:[80,650],admin:[80,1200],prestador:[80,1800],ciudadano:[80,2400],consola:[800,650],portal:[800,1800],publico:[800,2400],gateway:[1500,1550],api:[2200,1050],worker:[2200,2200],primary:[2950,650],replica:[3650,650],objects:[2950,1450],redis:[3650,1450],broker:[2950,2200],sunat:[4450,100],mincetur:[4450,800],gis:[4450,1500],pasarela:[4450,2300]};
for(const e of view.elements){const key=identifier.get(e.id);if(!positions[key])throw new Error('Falta posición de '+key);[e.x,e.y]=positions[key];}
delete view.automaticLayout;
view.dimensions={width:5100,height:3050};
const modelRelationships=new Map(elements.flatMap(e=>e.relationships??[]).map(r=>[r.id,r]));
// Carriles explícitos para conexiones largas; no se agregan ni se ocultan relaciones.
const routes={
'inspector->consola':[[650,300],[650,750]],
'admin->consola':[[680,1400],[680,850]],
'consola->gateway':[[1400,800],[1400,1650]],
'portal->gateway':[[1350,1950],[1350,1750]],
'publico->gateway':[[1400,2550],[1400,1800]],
'gateway->api':[[2100,1700],[2100,1200]],
'api->primary':[[2800,1200],[2800,800]],
'api->replica':[[2730,1000],[3875,1000]],
'api->objects':[[2800,1300],[2800,1550]],
'api->redis':[[2720,1360],[3875,1360]],
'api->sunat':[[2375,350],[4300,350],[4300,250]],
'api->mincetur':[[2450,450],[4250,450],[4250,950]],
'api->gis':[[2525,550],[4200,550],[4200,1650]],
'worker->primary':[[2700,2350],[2700,1950],[3540,1950],[3540,1100],[3300,1100]],
'worker->objects':[[2800,2250],[2800,1650]],
'worker->redis':[[2750,2100],[3875,2100]],
'worker->pasarela':[[2425,2750],[4320,2750],[4320,2450]]
};
for(const r of view.relationships){const m=modelRelationships.get(r.id);const key=identifier.get(m.sourceId)+'->'+identifier.get(m.destinationId);r.routing='Direct';r.position=key==='api->replica'?75:50;if(routes[key])r.vertices=routes[key].map(([x,y])=>({x,y}));else delete r.vertices;}
fs.writeFileSync(input,JSON.stringify(w,null,2)+'\n');
console.log('Nivel 2: '+view.elements.length+' elementos y '+view.relationships.length+' relaciones organizados.');
