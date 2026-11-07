# Patrones de diseño

## Objetivo

Definir los patrones seleccionados para implementar el backend de SIFITUR Huamanga, su ubicación y el problema que resuelven.

## Contexto

- Estilo: backend monolítico modular Node.js/NestJS.
- Enfoque interno: Clean Architecture.
- Módulo de referencia: Inspecciones y custodia de evidencias.

## Patrones previstos en el diseño

| Patrón | Dónde se usa | Problema que resuelve | Implementación |
|---|---|---|---|
| Adapter | Evidencias → S3; padrón → SUNAT/MINCETUR; notificaciones → SMS/correo. | Formatos y mecanismos distintos de los proveedores. | Contratos internos y clientes de infraestructura. |
| Repository | Inspecciones, padrón y subsanaciones → PostgreSQL. | Evitar dependencia del negocio de SQL u ORM. | Repositorios PostgreSQL por módulo; dobles de prueba en memoria durante validación. |
| Fábrica estática | Creación de Inspeccion y Evidencia. | Evitar entidades incompletas o inválidas. | Inspeccion.crear(datos) y validación de Evidencia. |
| Facade | Entrada de registro web de inspecciones. | Coordinar validación, evidencia y persistencia con una operación de aplicación. | RegistrarInspeccionCasoUso. |

## Diagramas de patrones

### Adapter: almacenamiento de evidencias

![Adapter de almacenamiento](../../../img/patron-adapter.jpg)

### Fábrica estática: creación de inspecciones

![Factory de inspecciones](../../../img/patron-factory.jpg)

### Facade: registro web

![Facade del flujo de inspección](../../../img/patron-facade.jpg)

## Exportaciones SVG

- [Adapter](../../../img/fuentes-svg/patron-adapter.svg).
- [Factory](../../../img/fuentes-svg/patron-factory.svg).
- [Facade](../../../img/fuentes-svg/patron-facade.svg).

## Repository: persistencia de inspecciones

![Repository de inspecciones](../../../img/patron-repository.jpg)

El repositorio ofrece registro atómico por identificador de operación, consulta y confirmación del acta. El adaptador PostgreSQL aplica unicidad y transacciones; dos solicitudes simultáneas no pueden crear dos inspecciones con la misma operación.

Exportación SVG: [Repository](../../../img/fuentes-svg/patron-repository.svg).

## Alcance de los patrones

`Inspeccion.crear` es una fábrica estática para centralizar invariantes; no requiere una jerarquía Factory Method. `RegistrarInspeccionCasoUso` ofrece una fachada al flujo, pero conserva la autorización y las reglas en sus responsables.

La evaluación de riesgo utiliza una política configurable y versionada. La consulta pública administra la caché desde su servicio de aplicación. La generación del acta y la notificación se coordinan mediante tareas durables, outbox y consumidores del trabajador, según las secuencias del [nivel 4](../../04-modelo-c4/Nivel4-DiagramadeCodigo.md).

## Herramientas y fuentes de diagramas

Estos diagramas se elaboran con **Archify**, conforme al contenido de este documento. Cada imagen JPG se guarda en `img/` y se incrusta en su sección correspondiente. El JSON es la fuente editable; JPG, PNG y SVG son exportaciones generadas desde su visor nativo.

| Diagrama | Fuente | Visor |
|---|---|---|
| Adapter de custodia | [JSON Archify](../../../.archify/sifitur-20261106-082100/patron-adapter/candidate.json) | [HTML interactivo](../../../.archify/sifitur-20261106-082100/patron-adapter/patron-adapter.html) |
| Fábrica estática de Inspeccion | [JSON Archify](../../../.archify/sifitur-20261106-082100/patron-factory/candidate.json) | [HTML interactivo](../../../.archify/sifitur-20261106-082100/patron-factory/patron-factory.html) |
| Fachada de registro web | [JSON Archify](../../../.archify/sifitur-20261106-082100/patron-facade/candidate.json) | [HTML interactivo](../../../.archify/sifitur-20261106-082100/patron-facade/patron-facade.html) |
| Repository idempotente | [JSON Archify](../../../.archify/sifitur-20261106-082100/patron-repository/candidate.json) | [HTML interactivo](../../../.archify/sifitur-20261106-082100/patron-repository/patron-repository.html) |

[Catálogo y reproducción de diagramas](../../../diagrams/README.md).
