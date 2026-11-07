# Diagramas de SIFITUR Huamanga

[Abrir catálogo de diagramas](index.html) · [Volver al proyecto](../README.md).

## Herramientas de autoría

| Alcance | Herramienta | Fuente editable |
|---|---|---|
| Arquitectura, componentes generales, proceso, paquetes, patrones, SOLID, agregado, registro web y estados | Archify | `candidate.json` de cada vista, indexado en [archify-manifest.json](archify-manifest.json). |
| C4 nivel 1: contexto | Structurizr | [workspace.dsl](structurizr/workspace.dsl), vista `nivel1-contexto`. |
| C4 nivel 2: contenedores | Structurizr | Mismo modelo, vista `nivel2-contenedores`. |
| C4 nivel 3: componentes | Structurizr | Mismo modelo, vista `nivel3-componentes`. |
| C4 nivel 4: clases, agregado y secuencias | Structurizr, vistas de imagen vinculadas a Inspecciones | [Clases](structurizr/nivel4-clases.puml), [agregado](structurizr/nivel4-agregado.puml), [registro](structurizr/nivel4-registro.puml) y [emisión](structurizr/nivel4-secuencia.puml). |

Structurizr no modela clases UML de forma nativa. Se usa su mecanismo oficial de [image views para nivel 4](https://docs.structurizr.com/dsl/cookbook/image-view/): las fuentes PlantUML se renderizan localmente a SVG y se incorporan al workspace. Las siete vistas se navegan desde el [visor Structurizr](structurizr/site/index.html). No se envían diagramas a un servidor UML externo.

Las fuentes y visores Archify se conservan en `.archify/sifitur-20261106-082100/`. El catálogo enlaza cada JSON y HTML. Las referencias documentales de los candidatos corresponden a la revisión Git que sirvió de base; describen una arquitectura propuesta, sin atribuir una implementación a este repositorio.

Los Markdown de `docs/` del [repositorio de referencia](https://github.com/PoolDYer/entregableSPRINT01-jeanpoolkennerpalominomavila/tree/main/docs) son la fuente de verdad del contenido. Los diagramas deben respetar sus nombres, responsabilidades, relaciones, condiciones, estados y alcance; los cambios de herramienta no justifican alterar las reglas documentadas. El alcance vigente es exclusivamente web: consola institucional React para inspector, coordinador y TI; portal del administrado React y portal ciudadano Next.js. Las fuentes se actualizan conjuntamente con sus exportaciones.

Cada diagrama se guarda como **JPG en `img/`** y se incrusta mediante una ruta relativa en el Markdown correspondiente. PNG y SVG se conservan como exportaciones adicionales. Archify descarga JPEG desde su menú nativo; para Structurizr se convierte su PNG exportado a JPEG, con fondo blanco y sin cambiar las dimensiones.

El agregado y la secuencia de registro tienen dos representaciones: Archify en el bloque de diseño interno y las vistas UML incorporadas a Structurizr en el bloque C4. Las páginas C4 enlazan exclusivamente sus vistas Structurizr.

## Edición

1. Para un diagrama general, editar su `candidate.json` enlazado desde el catálogo. Conservar responsabilidades, reglas, protocolos y referencias de origen.
2. Para contexto, contenedores o componentes C4, editar `structurizr/workspace.dsl`. Los identificadores del modelo son compartidos y las claves de vista son estables.
   El nivel 2 conserva una [distribución manual](https://docs.structurizr.com/ui/diagrams/manual-layout) en el JSON compilado, aplicada por [organizar-nivel2-structurizr.mjs](../scripts/organizar-nivel2-structurizr.mjs). La regeneración compila el DSL, aplica posiciones y recorridos y exporta desde ese JSON para conservar el orden.
   El nivel 3 sigue el mismo proceso con [organizar-nivel3-structurizr.mjs](../scripts/organizar-nivel3-structurizr.mjs), que organiza entradas, coordinación y adaptadores sin modificar el modelo semántico ni las relaciones.
3. Para nivel 4, editar el `.puml` correspondiente. No editar a mano las exportaciones SVG/PNG.
4. Regenerar y revisar las figuras afectadas. Los recibos Archify distinguen validación automática de inspección visual.

## Reproducción local

Requisitos: Node.js 18 o posterior, Java 21 o posterior, Edge instalado y Playwright para Node. Herramientas utilizadas en esta migración: Archify 3.2.0; Structurizr preview `2026.10.31`; PlantUML `1.2026.9`.

Obtener [Archify](https://github.com/tt-a1i/archify), el [WAR de Structurizr](https://docs.structurizr.com/binaries) con exportador Playwright y el [JAR de PlantUML](https://github.com/plantuml/plantuml/releases). Para esta exportación se usó el WAR preview, que soporta exportación PNG/SVG. Instalar Playwright en una carpeta de herramientas, fuera de las fuentes del proyecto. Los binarios y `node_modules` no se versionan aquí.

Ejecutar desde PowerShell, indicando las rutas de las herramientas:

```powershell
./scripts/regenerar-diagramas.ps1 `
  -ArchifyCli 'C:/herramientas/archify/archify/bin/archify.mjs' `
  -StructurizrWar 'C:/herramientas/structurizr.war' `
  -PlantUmlJar 'C:/herramientas/plantuml.jar' `
  -PlaywrightModule 'C:/herramientas/browser/node_modules/playwright/index.mjs'
```

El script valida las fuentes Archify, genera HTML y exporta PNG/SVG usando su menú nativo; renderiza UML localmente, valida el workspace Structurizr, genera su sitio y exportaciones, copia las imágenes publicadas y actualiza el catálogo y sus referencias. Se detiene si falla una herramienta. Structurizr puede descargar sus navegadores en la primera ejecución. No requiere cuenta en la nube.

Las fuentes vigentes son los JSON existentes enlazados en el catálogo. La regeneración utiliza esos archivos directamente; no se conserva un generador de la migración inicial que pueda sobrescribir correcciones posteriores.

## Verificación documental

El [informe de verificación final](verificacion-final.md) registra el contraste de cada diagrama con su Markdown y las correcciones aplicadas. La [evidencia JSON](verificacion-final.json) contiene reglas comprobadas, referencias y hashes de fuentes e imágenes. Para repetir los controles sobre las exportaciones vigentes:

```powershell
node scripts/verificar-diagramas.mjs
```

Los HTML se pueden abrir localmente. GitHub muestra los PNG y permite consultar las fuentes; para usar los visores HTML, abrirlos desde el repositorio descargado o servir el directorio localmente. El sitio generado de Structurizr se conserva con sus recursos, sin depender de un servicio de alojamiento.
