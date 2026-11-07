# Estilo arquitectónico

SIFITUR Huamanga utiliza un estilo **cliente-servidor web con backend monolítico modular organizado en capas**. El backend Node.js/NestJS se despliega como una aplicación con módulos institucionales; sus instancias son sin estado y se replican detrás del balanceador.

![Arquitectura modular en capas de SIFITUR](../../img/arquitectura-monolitica-sifitur.jpg)

**Exportaciones:** [JPG](../../img/arquitectura-monolitica-sifitur.jpg) · [PNG](../../img/arquitectura-monolitica-sifitur.png) · [SVG ampliable](../../img/fuentes-svg/arquitectura-monolitica-sifitur.svg).

## Lectura del diagrama

La figura desarrolla la organización interna de la **Backend API Application**. Los clientes web y el gateway se sitúan encima de su límite; los almacenes y la cola quedan debajo. A la derecha se muestran los sistemas externos y el trabajador, fuera del proceso de la API. Dentro de la API, las columnas identifican áreas funcionales y las franjas horizontales distinguen presentación, aplicación y dominio, e infraestructura y datos.

| Franja | Elementos de la figura | Responsabilidad y límite |
|---|---|---|
| Clientes web | Consola institucional React, portal del administrado React y portal ciudadano Next.js. | Inspector, coordinador y TI acceden a la consola; prestador y ciudadano utilizan sus portales. Los clientes se despliegan por separado de la API. |
| Gateway / balanceador | NGINX + ModSecurity. | Termina TLS, filtra y reparte las solicitudes entre instancias saludables. Está fuera del proceso del monolito. |
| Controles transversales | NestJS, guardas JWT/RBAC, política de acceso y validadores. | Verifica las rutas privadas según identidad, rol, institución, asignación y titularidad; las consultas públicas no requieren JWT. Login y recuperación conservan sus rutas acotadas sin sesión previa. |
| 1. Presentación | Controladores REST de cada área. | Traduce entradas y resultados e invoca el servicio correspondiente; no accede directamente a SQL ni genera el PDF. |
| 2. Aplicación y dominio | Servicios, casos de uso, riesgo y reglas. | Coordina el comportamiento y la colaboración mediante la API pública de cada módulo. |
| 3. Infraestructura y datos | Persistencia privada, repositorios y adaptadores. | Implementa los contratos del módulo y encapsula el acceso técnico a sus recursos. |
| Recursos de persistencia | PostgreSQL primaria y réplica, Redis y S3. | Son nodos individuales fuera de la API; cada repositorio se conecta a su destino con el protocolo indicado. RabbitMQ se representa aparte como cola durable. |

La columna **Padrón / Riesgo / Operativos** agrupa tres módulos para mantener legible la figura. Conservan sus responsabilidades, datos y contratos propios; no se convierten en un solo módulo. Auditoría participa como capacidad transversal y mediante `AuditoriaPort` en la unidad de trabajo.

## Módulos y recorrido entre capas

| Área / módulo | Entrada | Servicio / coordinación | Persistencia o colaboración |
|---|---|---|---|
| Identidad | `IdentityController`. | `IdentityService`: usuarios, roles, sesión y recuperación. | Persistencia privada de usuarios, roles y sesiones en primaria; la figura no asigna un nombre de clase de repositorio que el modelo C4 no especifica. |
| Padrón y vigencias | `ManagementController`. | `ProviderService`: ficha documental y validaciones pendientes. | `ProviderRepository`; solicita criticidad a Riesgo y coordina visitas con Operativos. |
| Riesgo | Colaboración desde Padrón. | `RiskAssessmentEngine`: criticidad con política versionada y datos explícitos. | Evaluaciones y versiones pertenecen al módulo; esta vista no desglosa su repositorio. |
| Operativos | Gestión institucional y colaboración entre módulos. | `OperativoService`: campañas, asignaciones y versiones de ruta. | `OperativoRepository`; expone la verificación de asignación utilizada por Inspecciones. |
| Inspecciones | `InspectionController`. | `InspectionService` coordina `RegistrarInspeccionCasoUso`. | `InspectionRepository` y `AuditoriaPort`: datos, auditoría y outbox en T1; `EvidenceManager / StorageAdapter` verifica originales y SHA-256. |
| Subsanaciones | `AdministradoController` para expediente y descargo propio; `ManagementController` para evaluación institucional. | `SubsanacionService`: plazos, descargos y evaluación autorizada. | `SubsanacionRepository` conserva observaciones, descargos y resoluciones del módulo. |
| Consulta pública | `PublicQueryController`. | `PublicQueryService`: directorio y QR autorizados. | `CacheRepository / ConsultaPublicaRepository`: proyección pública en Redis; revalida en primaria cuando vence o falla la caché. |
| Indicadores | `IndicadoresController`. | `IndicadoresService`: consultas privadas por distrito y periodo. | `IndicadoresRepository`: lecturas de réplica tolerantes al retraso, con fecha de corte. |

Los nombres y las responsabilidades se contrastan con los [componentes y propiedad de datos](componentes-arquitectonicos.md) y el [nivel 3 de componentes C4](../04-modelo-c4/Nivel3-Diagrama-de-Componentes.md). El [enfoque arquitectónico](enfoque-arquitectonico.md) amplía la organización Clean Architecture de Inspecciones.

## Leyenda de colaboración

| Relación | Significado |
|---|---|
| HTTPS y REST / JSON | Solicitud del cliente al gateway y entrada al backend. |
| Invoca | Llamada síncrona del controlador al servicio de aplicación. |
| Por contrato | El servicio solicita persistencia a través de su contrato; no selecciona un motor ni importa un adaptador concreto. |
| Línea discontinua: Evalúa / Coordina / Valida asignación / Delega evaluación | Colaboración entre áreas mediante la API pública del receptor. No permite utilizar el repositorio privado de otro módulo. |
| Persiste | Operativos solicita la persistencia de sus datos dentro de la agrupación visual de repositorios de gestión. |
| SQL / TLS, RESP / TLS, Puerto S3 y AMQPS | Acceso específico a primaria o réplica, Redis, objetos y mensajería. Puerto S3 representa la colaboración con EvidenceManager / StorageAdapter. |
| HTTPS hacia sistemas externos | Las consultas de los módulos pasan por SunatClient, MinceturClient o GisClient. El trabajador utiliza NotificationClient para la pasarela. |

Las flechas describen **colaboración en ejecución**. Las dependencias de código siguen Clean Architecture: aplicación y dominio conocen contratos internos; infraestructura los implementa y la composición conecta las implementaciones. Cada almacén tiene un nodo y una responsabilidad propia. No existe un repositorio universal ni una transacción única entre PostgreSQL, Redis, S3 y RabbitMQ.

## Organización del sistema

| Unidad | Responsabilidad | Tecnología |
|---|---|---|
| Consola administrativa | Registro de inspecciones y evidencias, padrón, operativos, riesgo, usuarios y evaluación de descargos. | React SPA |
| Portal del administrado | Expediente propio y presentación de subsanaciones. | React SPA |
| Portal ciudadano | Directorio público, formalidad y QR. | Next.js SSR |
| Backend modular | Casos de uso y autorización institucional. | Node.js y NestJS |
| Trabajador | Documentos, proyecciones y notificaciones. | Node.js y RabbitMQ |
| Persistencia | Datos institucionales, lectura, caché y objetos. | PostgreSQL, Redis y S3 |

## Reglas del monolito modular

1. Los módulos de negocio del backend se despliegan juntos y se comunican mediante su API pública.
2. Cada módulo mantiene propiedad lógica sobre sus tablas y repositorios.
3. Clean Architecture organiza las dependencias internas de cada módulo.
4. Los clientes web y el trabajador tienen ejecución independiente del backend.
5. La consulta pública no requiere JWT; las operaciones privadas verifican identidad, rol y pertenencia del expediente.
6. La primaria confirma escrituras; caché y réplica atienden lecturas con políticas de actualización explícitas.
7. Las tareas asíncronas usan outbox, identificador estable, reintentos y consumidores idempotentes.

## Bases de datos, almacenes y servicios externos de la figura

| Elemento visible | Conexiones documentadas | Protocolo / condición |
|---|---|---|
| PostgreSQL primaria | Persistencia de identidad, gestión, inspecciones y subsanaciones; revalidación de la consulta pública; outbox y resultados del trabajador. | SQL / TLS; confirma escrituras, auditoría y outbox en transacciones locales T1/T2. |
| PostgreSQL réplica | Recibe replicación de primaria; IndicadoresRepository consulta lecturas autorizadas. | Replicación PostgreSQL y SQL / TLS; reportes tolerantes al retraso, con fecha de corte. |
| Redis | CacheRepository consulta la proyección pública; el trabajador actualiza o invalida versiones. | RESP / TLS; antigüedad máxima propuesta de 60 s. |
| Almacén S3 compatible | Inspecciones verifica originales mediante EvidenceManager / StorageAdapter; el trabajador lee evidencias y conserva PDF y hash. | HTTPS / S3 API; objetos, firma, integridad SHA-256, versionado y retención. |
| RabbitMQ | El trabajador publica y consume tareas con confirmación y acuse posterior a persistir. | AMQPS / TLS; cola durable, separada de las bases de datos. |
| SUNAT RUC | ProviderService solicita consulta tributaria mediante SunatClient. | HTTPS; integración prevista, con acceso por confirmar. |
| MINCETUR | ProviderService solicita consulta sectorial mediante MinceturClient. | HTTPS; integración prevista, con acceso por confirmar. |
| OpenStreetMap / GIS | OperativoService e IndicadoresService solicitan cartografía mediante GisClient. | HTTPS; cartografía de referencia. |
| Pasarela SMS / correo | NotificationClient, dentro del trabajador, envía actas y avisos y registra el resultado. | HTTPS; aceptación y entrega verificable se distinguen. |

La flecha de primaria a réplica expresa replicación; la réplica analítica no es una copia de seguridad. El standby síncrono y las réplicas físicas de infraestructura se detallan en el HLD. La figura conserva el alcance lógico de los módulos y sus recursos.

## Procesos, integraciones y confirmación durable

| Unidad / recurso | Ejecución y colaboración |
|---|---|
| Instancia Backend API | Un proceso Node.js/NestJS contiene los módulos institucionales desplegados juntos. Las instancias son sin estado y se replican detrás del gateway. |
| Trabajador independiente | `QueuePublisher`, `ProcesarActaCasoUso` y `NotificationClient` procesan outbox, emisión PDF, proyecciones y avisos. Escala por separado de la API. |
| RabbitMQ | El trabajador publica con confirmación, consume las tareas durables y acusa después de persistir el resultado. La API confirma su outbox en PostgreSQL. |
| SUNAT / MINCETUR / GIS | Adaptadores de los módulos responsables realizan consultas por HTTPS, con tiempos de espera y reintentos acotados. |
| Pasarela SMS / correo | El trabajador solicita el envío y conserva su resultado; aceptación y entrega verificable son estados distintos. |

T1 confirma inspección, auditoría y outbox después de verificar los objetos. El trabajador conserva PDF y hash antes de confirmar T2 y registrar el aviso posterior. Fallar al notificar conserva el acta emitida y la tarea recuperable. Son transacciones locales de PostgreSQL; la coordinación con S3 y RabbitMQ utiliza outbox, confirmaciones e idempotencia.

El [nivel 2 de contenedores](../04-modelo-c4/Nivel2-DiagramadeContenedores.md) muestra los procesos, almacenes e integraciones. La [arquitectura inicial](arquitectura-inicial.md) desarrolla instancias, continuidad y dominios de fallo.

## Límites y compensaciones

El monolito modular permite transacciones locales y reduce coordinación operativa, pero sus módulos comparten el ciclo de publicación y un fallo de proceso afecta a la instancia completa. Se mitiga mediante instancias redundantes, contratos de módulo y validación de regresión. El trabajador utiliza el mismo modelo de negocio con entrada de mensajería y escala por separado; la presencia de RabbitMQ no convierte cada módulo en un microservicio.

## Herramientas y fuentes de diagramas

Estos diagramas se elaboran con **Archify**, conforme al contenido de este documento. Cada imagen JPG se guarda en `img/` y se incrusta en su sección correspondiente. El JSON es la fuente editable; JPG, PNG y SVG son exportaciones generadas desde su visor nativo.

| Diagrama | Fuente | Visor |
|---|---|---|
| Monolito modular en capas | [JSON Archify](../../.archify/sifitur-20261106-082100/arquitectura-monolitica-sifitur/candidate.json) | [HTML interactivo](../../.archify/sifitur-20261106-082100/arquitectura-monolitica-sifitur/arquitectura-monolitica-sifitur.html) |

[Catálogo y reproducción de diagramas](../../diagrams/README.md).
