# Verificación final de diagramas

Fecha: 6 de noviembre de 2026. Resultado: **conforme en el alcance documental revisado**, después de las correcciones descritas abajo.

Se contrastaron los **25 diagramas** con los **20 Markdown de `docs/`**, priorizando las tablas de responsabilidades y relaciones, los contratos, las reglas RN/RF y las condiciones de transición. La base de referencia de GitHub es `ac5bd7eb01bceee1c9230e675846fd9d1d4f79db`; la evidencia también registra los hashes de los documentos locales vigentes. Las imágenes JPG incrustadas se regeneraron desde sus fuentes corregidas.

## Correcciones de esta revisión

- Se restituyeron los nombres completos `RepositorioInspeccionesPostgres` y `AlmacenEvidenciasS3` en DIP.
- Se completaron en el agregado los datos de integridad del acta, vínculo de firma, tiempos de captura y presentación, ficha e identidad del expediente. El correo del administrado procede del padrón, conforme al contrato de sincronización.
- La secuencia Archify ahora distingue operación existente y nueva: un reenvío idéntico devuelve el registro vigente con `200`; otro contenido produce `409`; ambos terminan sin ejecutar T1. Solo una operación nueva y válida verifica objetos y confirma datos, auditoría y outbox. Se usa la ruta documentada `/api/v1/inspecciones`.
- En la secuencia UML de registro se explicitaron las interrupciones por autorización, versión e integridad, además de la carrera concurrente de unicidad. Estas condiciones no pueden terminar en una confirmación de registro nuevo.
- Se hicieron explícitos el reintento de notificaciones y el nombre completo `PROCEDIMIENTO SANCIONADOR`, manteniendo las condiciones documentadas.
- La leyenda de componentes identifica consulta, auditoría y trabajador como responsabilidades del backend; no como frontend, almacén de datos o broker. El controlador REST de SOLID también se identifica como backend.
- Se explicitó la revalidación de la proyección pública en primaria cuando Redis falla o la ficha vence.
- En Structurizr se excluyeron de la vista de contenedores los enlaces inferidos cliente → API para mantener el recorrido cliente → gateway → API. En componentes se explicitó la delegación de evaluación del controlador de gestión y los nombres de las responsabilidades ejecutadas fuera de la API en el trabajador.
- Se retiró el generador de la migración inicial: las fuentes de autoría son los JSON vigentes, para evitar que una regeneración revierta estas correcciones.

## Matriz de contraste de contenido

Las abreviaturas de la columna de origen remiten a documentos y secciones de la lista posterior. El resultado corresponde al alcance declarado de cada vista: un contexto no se evalúa como si fuera un diagrama de clases.

| Diagrama | Origen | Contenido contrastado | Resultado |
|---|---|---|---|
| arquitectura-alto-nivel | A1, rutas y continuidad | Cuatro canales; gateway; API sin estado; primaria, standby y réplica diferenciados; caché, objetos y trabajador con outbox. | Conforme |
| arquitectura-limpia-sifitur | A2, capas y dependencias | Presentación → aplicación → dominio; infraestructura implementa contratos; composición e independencia de framework. | Conforme |
| arquitectura-monolitica-sifitur | A3, organización y reglas | Backend modular como unidad de publicación; clientes y trabajador independientes; propiedad de datos y ejecución por puertos. | Conforme |
| componentes | A4, responsabilidades y propiedad | Identidad, padrón, riesgo, operativos, inspecciones, subsanaciones, consulta, indicadores, auditoría y procesamiento asíncrono. | Conforme |
| paquetes-modulo-inspecciones | D1, §§2–3 y 10 | Carpetas previstas, dirección de importaciones, composición y API pública sin exposición de repositorios privados. | Conforme |
| clases-modulo-inspecciones | D1, §§4–5 y 8–10 | Evidencias y firma vinculadas; coordenadas, hash y tiempos; acta opcional; subsanación en otro módulo. | Conforme |
| patron-adapter | D2, Adapter | Caso de uso → contrato; implementación S3 → proveedor; custodia y verificación de integridad. | Conforme |
| patron-repository | D2, Repository; D1, §8 | Contrato y adaptador PostgreSQL; unicidad por institución, inspector y operación; registro atómico y confirmación de acta. | Conforme |
| patron-factory | D2, fábrica estática; D1, §5 | Creación de Inspeccion y Evidencia con invariantes; GPS, origen cámara, firma y hash; sin jerarquía Factory Method. | Conforme |
| patron-facade | D2, Facade; D1, §6 | Entrada única que coordina autorización, idempotencia, validación, custodia y T1; conserva responsabilidades de colaboradores. | Conforme |
| principio-dip | D3, DIP e ISP | Clientes dependen de interfaces; cuatro adaptadores documentados; registro sin dependencia de correo; emisión usa generador. | Conforme |
| solid-modulo-inspecciones | D3, matriz SOLID | Controlador, caso de uso y entidad separados; sustitución de adaptadores, contratos segregados y composición. | Conforme |
| proceso-fiscalizacion | N1, alcance; D1, §9 | Padrón → riesgo → operativo → inspección → emisión; descargos y derivación autorizada; formalidad no se publica por emitir un acta. | Conforme |
| estados-expediente | D1, §9 | PENDIENTE, EN EVALUACIÓN, SUBSANADO, PLAZO VENCIDO, REINCIDENTE y PROCEDIMIENTO SANCIONADOR; condiciones y autorización. | Conforme |
| estados-captura | D1, §§8–9 | BORRADOR → LISTA → RECIBIDA; un error o conflicto conserva LISTA y el borrador; no crea un estado de negocio INCIDENCIA. | Conforme |
| estados-emision | D1, §9 | RECIBIDA → EMITIDA → ANULADA; PDF y hash antes de T2; fallo mantiene RECIBIDA para reintento. | Conforme |
| estados-notificacion | D1, §9 | PENDIENTE, ACEPTADA, ENTREGADA y REVISIÓN; aceptación distinta de entrega; reintento y agotamiento de tres intentos. | Conforme |
| secuencia-registrar-inspeccion | D1, §§6–8 | Autorización, operación estable, comparación de huella, custodia y T1; respuesta 201/200 y conflicto 409 sin sobrescritura. | Conforme |
| nivel1-contexto | C1, §§3–7 | Cinco actores, SIFITUR como sistema único y cuatro sistemas externos; separación de información pública y privada. | Conforme |
| nivel2-contenedores | C2, §§3–7 | Trece contenedores lógicos; almacenamiento móvil embebido; gateway; REST, SQL, RESP, S3 y AMQPS; worker y almacenes. | Conforme |
| nivel3-componentes | C3, §§3–7 | Dieciséis grupos de componentes; entradas, servicios y puertos; autorizaciones; proyección pública; worker fuera de API. | Conforme |
| nivel4-clases | C4, §§2 y 5; D1, §10 | Clases, interfaces y adaptadores de Inspecciones; dependencias al núcleo; casos de uso en API y trabajador. | Conforme |
| nivel4-agregado | C4, §2.3; D1, §§4–5 | Inspeccion compone evidencias y firma; Evidencia contiene Coordenada; Acta 0..1 y Subsanacion 0..*; hash y custodia. | Conforme |
| nivel4-registro | C4, §3.1; D1, §§6–8 | Alternativas de operación existente/nueva, rechazo de autorización o integridad, unicidad concurrente y confirmación durable. | Conforme |
| nivel4-secuencia | C4, §3.2; D1, §9 | Publicación confirmada; consumo idempotente; PDF en S3; T2 antes del acuse; notificación independiente con recuperación. | Conforme |

## Documentos de origen

- N1: [Necesidad del negocio](../docs/01-analisis-de-sistema/00-necesidad-del-negocio.md).
- A1: [Arquitectura inicial](../docs/02-arquitectura-software/arquitectura-inicial.md).
- A2: [Enfoque arquitectónico](../docs/02-arquitectura-software/enfoque-arquitectonico.md).
- A3: [Estilo arquitectónico](../docs/02-arquitectura-software/estilo-arquitectonico.md).
- A4: [Componentes arquitectónicos](../docs/02-arquitectura-software/componentes-arquitectonicos.md).
- D1: [Diseño interno de módulos](../docs/03-diseño-de-software/diseño-interno/diseño-interno-de-modulos.md).
- D2: [Patrones de diseño](../docs/03-diseño-de-software/diseño-interno/patrones-de-diseño.md).
- D3: [Principios de diseño](../docs/03-diseño-de-software/diseño-interno/principios-de-diseño.md).
- C1: [Contexto](../docs/04-modelo-c4/Nivel1-DiagramadeContextodelSistema.md).
- C2: [Contenedores](../docs/04-modelo-c4/Nivel2-DiagramadeContenedores.md).
- C3: [Componentes C4](../docs/04-modelo-c4/Nivel3-Diagrama-de-Componentes.md).
- C4: [Código C4](../docs/04-modelo-c4/Nivel4-DiagramadeCodigo.md).

Actores, historias, RF, atributos de calidad, restricciones, drivers, ADR y escenarios complementan la validación transversal: acceso público sin JWT; autorización privada por rol y expediente; formalidad con antigüedad controlada; captura offline; recepción y emisión separadas; ausencia de una transacción distribuida entre PostgreSQL, S3 y RabbitMQ. Las métricas siguen siendo objetivos de diseño.

## Evidencia de publicación y límites

La [evidencia reproducible](verificacion-final.json) registra **123 controles automáticos**, **169 enlaces locales**, las fuentes vigentes y los hashes de las 25 imágenes JPG, sus PNG/SVG y los HTML Archify. Los 18 HTML Archify tienen recibos de validación y comprobación de navegador que coinciden con sus candidatos actuales. El DSL Structurizr se validó con su herramienta y sus siete vistas se exportaron con el renderer oficial.

La revisión semántica de la matriz anterior es una comparación documental; los controles automáticos comprueban un subconjunto explícito de sus reglas y la integridad de la publicación. No sustituyen esa interpretación por una simple búsqueda de palabras. Se inspeccionaron visualmente como muestra los JPG de sincronización, agregado y contenedores; no se afirma una inspección visual individual de las 25 imágenes.

El nivel 4 usa el mecanismo oficial de vistas de imagen de Structurizr, con UML editable y renderizado local. Las vistas de conjunto agrupan responsabilidades según su alcance; los visores y SVG permiten ampliación. Esta verificación no constituye una prueba de funcionamiento, seguridad, rendimiento o cumplimiento normativo de una aplicación desplegada.
