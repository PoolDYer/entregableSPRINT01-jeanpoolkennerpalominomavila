import fs from 'node:fs';
const input=process.argv[2]??'diagrams/structurizr/modelo/workspace.json';
const w=JSON.parse(fs.readFileSync(input,'utf8'));
const view=w.views.componentViews.find(v=>v.key==='componentes');
if(!view)throw new Error('No existe la vista C4 componentes.');
const system=w.model.softwareSystems.find(s=>s.name==='SIFITUR Huamanga');
const elements=[...w.model.people,...w.model.softwareSystems,...system.containers,...system.containers.flatMap(c=>c.components??[])];
const ids=new Map(elements.map(e=>[e.id,e.properties?.['structurizr.dsl.identifier']]));
const positions={inspector:[150,60],coordinador:[1000,60],admin:[1850,60],prestador:[3000,60],ciudadano:[4200,60],consola:[900,600],portal:[2950,600],publico:[4200,600],identity:[650,1150],access:[1500,1150],validation:[2350,1150],inspection:[3200,1150],providers:[650,1750],risk:[1500,1750],operations:[2350,1750],claims:[3200,1750],query:[1500,2350],metrics:[2350,2350],managementRepo:[650,2950],cache:[1500,2950],reports:[2350,2950],repository:[3200,2950],integrations:[650,3550],evidence:[3200,3550],primary:[1500,4250],replica:[2350,4250],redis:[4300,2350],objects:[4300,3550],worker:[4300,4250],broker:[4300,4900],sunat:[5100,1150],mincetur:[5100,1750],gis:[5100,2950],pasarela:[5100,4850]};
for(const e of view.elements){const id=ids.get(e.id);if(!positions[id])throw new Error('Falta posición de '+id);[e.x,e.y]=positions[id];}
delete view.automaticLayout;view.dimensions={width:5800,height:5500};
const routes={
'inspector->consola':[[375,520],[1050,520]],
'coordinador->consola':[[1225,540],[1150,540]],
'admin->consola':[[2075,560],[1250,560]],
'consola->identity':[[1125,1000],[950,1000]],
'consola->inspection':[[1425,750],[1425,1000],[3500,1000]],
'consola->providers':[[550,750],[550,1900]],
'consola->claims':[[1125,1050],[4050,1050],[4050,1900]],
'consola->metrics':[[1350,1000],[1350,2200],[2650,2200]],
'portal->claims':[[4000,750],[4000,1900]],
'publico->query':[[4100,750],[4100,2150],[1800,2150]],
'inspection->access':[[3500,1540],[1800,1540]],
'providers->access':[[1350,1900],[1350,1300]],
'claims->access':[[3100,1900],[3100,1610],[1800,1610]],
'metrics->access':[[3075,2500],[3075,1680],[1850,1680]],
'inspection->operations':[[3500,1620],[2700,1620]],
'inspection->evidence':[[3100,1300],[3100,3700]],
'inspection->repository':[[3000,1300],[3000,3100]],
'providers->operations':[[950,2170],[2650,2170]],
'providers->claims':[[1000,2250],[3500,2250]],
'providers->managementRepo':[[1300,1900],[1300,2800],[950,2800]],
'providers->integrations':[[1400,1900],[1400,3700]],
'operations->managementRepo':[[3050,1900],[3050,2720],[950,2720]],
'claims->managementRepo':[[3500,2800],[950,2800]],
'operations->integrations':[[2250,1900],[2250,3380],[950,3380]],
'metrics->integrations':[[2200,2500],[2200,3450],[950,3450]],
'identity->primary':[[570,1300],[570,4400]],
'repository->primary':[[3500,3375],[3000,3375],[3000,4140],[1725,4140]],
'managementRepo->primary':[[950,3340],[1300,3340],[1300,4400]],
'cache->redis':[[2200,3100],[2200,2750],[4525,2750]],
'worker->primary':[[4525,4680],[1725,4680]],
'worker->redis':[[4900,4400],[4900,2500]],
'worker->pasarela':[[4525,4775],[5325,4775]],
'integrations->sunat':[[950,3970],[4950,3970],[4950,1300]],
'integrations->mincetur':[[1025,4020],[4875,4020],[4875,1900]],
'integrations->gis':[[1100,4070],[4800,4070],[4800,3100]]
};
const rels=new Map(elements.flatMap(e=>e.relationships??[]).map(r=>[r.id,r]));
const labels={'consola->claims':80,'consola->metrics':15,'publico->query':30,'inspection->access':50,'claims->access':15,'metrics->access':20,'providers->claims':80,'inspection->operations':10,'providers->integrations':60,'operations->managementRepo':55,'worker->redis':70,'integrations->sunat':85,'integrations->mincetur':80,'integrations->gis':75};
for(const r of view.relationships){const model=rels.get(r.id);const key=ids.get(model.sourceId)+'->'+ids.get(model.destinationId);r.routing='Direct';r.position=labels[key]??50;if(routes[key])r.vertices=routes[key].map(([x,y])=>({x,y}));else delete r.vertices;}
fs.writeFileSync(input,JSON.stringify(w,null,2)+'\n');
console.log('Componentes C4: '+view.elements.length+' elementos y '+view.relationships.length+' relaciones organizados.');
