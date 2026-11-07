import fs from 'node:fs';
const input=process.argv[2]??'diagrams/structurizr/modelo/workspace.json';
const workspace=JSON.parse(fs.readFileSync(input,'utf8'));
const view=workspace.views.componentViews.find(v=>v.key==='nivel3-componentes');
if(!view)throw new Error('No existe la vista nivel3-componentes.');
const system=workspace.model.softwareSystems.find(s=>s.name==='SIFITUR Huamanga');
const elements=[...workspace.model.people,...workspace.model.softwareSystems,...system.containers,...system.containers.flatMap(c=>c.components??[])];
const identifiers=new Map(elements.map(e=>[e.id,e.properties?.['structurizr.dsl.identifier']]));
// Filas funcionales: identidad, inspecciones, padrón, descargos, consulta pública e indicadores.
const positions={consola:[60,1000],portal:[60,2400],publico:[60,3100],identity:[800,300],inspection:[800,1000],providers:[800,1700],claims:[800,2400],query:[800,3100],metrics:[800,3800],access:[1650,300],validation:[1650,1000],risk:[1650,1700],operations:[1650,2400],repository:[2550,1000],evidence:[2550,1700],managementRepo:[2550,2400],cache:[2550,3100],reports:[2550,3800],integrations:[2550,4500],primary:[3450,1000],objects:[3450,1700],worker:[3450,2400],redis:[3450,3100],replica:[3450,3800],broker:[4300,2400],pasarela:[5150,2400],sunat:[5150,3100],mincetur:[5150,3800],gis:[5150,4500]};
for(const element of view.elements){const key=identifiers.get(element.id);if(!positions[key])throw new Error('Falta posición de '+key);[element.x,element.y]=positions[key];}
delete view.automaticLayout;
view.dimensions={width:5800,height:5100};
const routes={
'consola->identity':[[650,1100],[650,450]],
'consola->providers':[[650,1250],[650,1850]],
'consola->claims':[[600,1300],[600,2250],[1025,2250]],
'consola->metrics':[[550,1350],[550,3950]],
'inspection->access':[[1425,1150],[1425,450]],
'providers->access':[[1475,1850],[1475,450]],
'claims->access':[[1525,2550],[1525,450]],
'metrics->access':[[1575,3950],[1575,450]],
'inspection->operations':[[1625,1250],[1625,2550]],
'inspection->repository':[[1025,800],[2775,800]],
'inspection->evidence':[[1025,1450],[2350,1450],[2350,1850]],
'providers->operations':[[1600,1900],[1600,2550]],
'providers->managementRepo':[[1025,2150],[2775,2150]],
'providers->integrations':[[1250,2100],[2300,2100],[2300,4350],[2775,4350]],
'claims->managementRepo':[[1025,2850],[2775,2850]],
'operations->integrations':[[1875,2850],[2425,2850],[2425,4650]],
'metrics->integrations':[[1025,4300],[2775,4300]],
'identity->primary':[[1025,700],[3675,700]],
'managementRepo->primary':[[3250,2550],[3250,1400],[3675,1400]],
'cache->primary':[[3200,3250],[3200,1450],[3550,1450]],
'primary->replica':[[3350,1150],[3350,3950]],
'worker->primary':[[4100,2550],[4100,1150]],
'worker->pasarela':[[3675,2900],[5375,2900]],
'integrations->sunat':[[4950,4650],[4950,3250]],
'integrations->mincetur':[[4850,4700],[4850,3950]]
};
const relationships=new Map(elements.flatMap(e=>e.relationships??[]).map(r=>[r.id,r]));
const labelPositions={'inspection->operations':20,'managementRepo->primary':25,'consola->metrics':85,'inspection->access':20,'providers->access':20,'claims->access':10,'metrics->access':10,'providers->integrations':50,'metrics->integrations':35,'integrations->sunat':85,'integrations->mincetur':80,'worker->pasarela':60};
for(const relationship of view.relationships){const model=relationships.get(relationship.id);const key=identifiers.get(model.sourceId)+'->'+identifiers.get(model.destinationId);relationship.routing='Direct';relationship.position=labelPositions[key]??50;if(routes[key])relationship.vertices=routes[key].map(([x,y])=>({x,y}));else delete relationship.vertices;}
fs.writeFileSync(input,JSON.stringify(workspace,null,2)+'\n');
console.log('Nivel 3: '+view.elements.length+' elementos y '+view.relationships.length+' relaciones organizados.');
