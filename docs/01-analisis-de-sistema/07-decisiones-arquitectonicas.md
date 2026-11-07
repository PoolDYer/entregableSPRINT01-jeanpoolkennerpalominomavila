# Decisiones arquitectónicas de SIFITUR Huamanga

## Catálogo de decisiones

| ID | Decisión | Driver relacionado | Justificación | Resultado previsto |
|---|---|---|---|---|
| ADR-001 | Backend como monolito modular con instancias sin estado. | DA03, DA08. | Mantener una unidad de despliegue del negocio y permitir replicar su ejecución sin administrar microservicios desde el inicio. | Módulos de identidad, padrón, operativos, fiscalización, subsanaciones, riesgo, consulta y auditoría. |
| ADR-002 | Clean Architecture por módulo. | DA05, DA06, DA07. | Aislar reglas de fiscalización de frameworks, persistencia y proveedores. | Dominio, aplicación, presentación e infraestructura con dependencias hacia el interior. |
| ADR-003 | Consulta pública con caché y réplica de lectura. | DA03, DA04. | Absorber el predominio de lecturas y mantener las escrituras institucionales separadas de los reportes. | Redis para fichas públicas y PostgreSQL de lectura para consultas tolerantes a desfase. |
| ADR-004 | Integraciones mediante puertos y adaptadores. | DA06. | Evitar que cambios o indisponibilidad de proveedores invadan los casos de uso. | Adaptadores SUNAT, MINCETUR, GIS y notificaciones. |
| ADR-006 | Evidencias en objetos y tareas asíncronas recuperables. | DA05. | Separar archivos pesados del cómputo y preservar su relación con el expediente. | S3 compatible, RabbitMQ, trabajador e historial de procesamiento. |
| ADR-007 | Autorización por rol y auditoría de acciones sensibles. | DA01, DA05. | Proteger expedientes y mantener trazabilidad de cambios. | JWT para rutas privadas, RBAC en backend y registro de auditoría con acceso restringido. |
| ADR-008 | Recuperación y despliegue redundante. | DA03, DA05, DA08. | Evitar pérdida de datos confirmados y reducir interrupciones. | Standby síncrono, copias, broker replicado y conmutación controlada. |

## ADR-001 Backend modular

**Contexto:** la propuesta estima 35 inspectores, 12 coordinadores, 4 administradores, 600 prestadores y una capacidad objetivo de 1,200 solicitudes por minuto. Se necesita controlar el costo operativo y atender picos estacionales.

**Decisión:** una aplicación backend Node.js/NestJS organiza módulos de negocio con interfaces explícitas. Sus instancias se replican detrás del gateway y balanceador. Los clientes web, los almacenes y el trabajador asíncrono constituyen unidades separadas; monolito modular describe el backend, no todo el ecosistema.

**Alternativas:** microservicios por módulo o monolito sin límites internos. Se prefiere la modularidad porque permite separar responsabilidades con menor carga de operación que los microservicios. La existencia de una cola no transforma automáticamente el backend en microservicios.

**Consecuencias:** el backend se publica y escala como unidad. Un cambio requiere validar su integración completa. El trabajador puede escalar por separado para tareas pesadas. Debe evitarse guardar sesiones o archivos definitivos en memoria o disco de una instancia.

## ADR-002 Dependencias hacia el núcleo

**Contexto:** las reglas de riesgo, vigencias y subsanaciones deben poder revisarse sin depender de React, NestJS, Redis o S3.

**Decisión:** el dominio conserva entidades y reglas; aplicación orquesta casos de uso sobre puertos definidos en el dominio; presentación transforma entradas y salidas; infraestructura implementa los puertos. La raíz de composición conecta las implementaciones.

**Alternativas:** servicios de negocio que usan directamente ORM y SDK, o arquitectura hexagonal. Clean Architecture se selecciona para expresar de manera explícita las cuatro responsabilidades.

**Consecuencias:** aumenta el número de contratos y transformaciones. A cambio, reglas y casos de uso pueden probarse con adaptadores en memoria. La mantenibilidad se verifica mediante sustitución de adaptadores y pruebas del núcleo.

## ADR-003 Lecturas públicas y consistencia

**Contexto:** el patrón previsto es 95 % lectura y 5 % escritura; AC01 define consulta pública menor a 200 ms y APIs transaccionales con P95 menor a 250 ms.

**Decisión:** Redis almacena únicamente la proyección pública del padrón y QR. PostgreSQL primaria confirma las escrituras; la réplica atiende reportes y consultas que toleren desfase. Al cambiar la formalidad se invalida o actualiza la ficha pública mediante una tarea registrada de forma durable junto con la transacción.

**Alternativas:** todas las consultas a la primaria o caché sin invalidación. Se prioriza descargar las lecturas manteniendo un mecanismo explícito de actualización.

**Consecuencias:** caché y réplica pueden mostrar datos anteriores al último cambio. Como parámetro inicial de diseño se fija una antigüedad máxima de 60 segundos para la proyección pública; una ficha vencida se revalida o se presenta como temporalmente no verificable. El TTL se calcula desde la fecha de la proyección, sin renovarlo al leerla. La reconstrucción de formalidad consulta la primaria y no una réplica atrasada. La meta requiere validación con DIRCETUR/MPH. Las decisiones sobre sanciones y estados actuales consultan la primaria. Ante fallo de Redis se consulta la base con límites de carga. CDN se aplica a recursos estáticos y solo a respuestas públicas con políticas apropiadas.

## ADR-004 Servicios externos desacoplados

**Contexto:** RC06 identifica SUNAT, MINCETUR, OpenStreetMap y SMS/correo.

**Decisión:** el núcleo define contratos de validación tributaria, consulta sectorial, cartografía y notificación; infraestructura implementa los clientes. Se configuran tiempos límite, reintentos acotados y circuit breaker. Las notificaciones se envían mediante tareas asíncronas con identificador de envío.

**Alternativa:** consumir proveedores desde controladores o entidades. Se descarta porque acopla el negocio al protocolo y al proveedor.

**Consecuencias:** una consulta externa no disponible queda pendiente de validación y no se interpreta como establecimiento conforme. El registro local del expediente puede conservarse. Acceso, permisos, cuotas, contratos de API y disponibilidad de cada integración requieren confirmación antes de implementarla.


## ADR-006 Custodia de evidencias

**Contexto:** RF10 y RF11 y AC04 requieren fotos, firmas digitalizadas y actas relacionadas con el expediente.

**Decisión:** los objetos se guardan con identificadores estables, metadatos y hashes; PostgreSQL conserva sus referencias y estados. La confirmación final exige verificar la persistencia del objeto y la transacción del expediente. Una tabla de salida transaccional (outbox) registra las tareas a publicar en RabbitMQ; el trabajador procesa de forma idempotente y conserva fallos para recuperación.

**Alternativas:** archivos en el disco del servidor o publicar mensajes sin registro transaccional. Se descartan por fragilidad ante cambios de instancia y pérdidas entre escritura y publicación.

**Consecuencias:** PostgreSQL, S3 y RabbitMQ no participan de una única transacción ACID. El flujo necesita estados pendientes, reintentos y conciliación. La consola web muestra el registro como confirmado solo después de recibir el acuse durable del servidor. Se preserva el archivo original; versiones optimizadas para visualizar no lo sustituyen. Versionado, retención, copias y restauración deben configurarse y verificarse. Un hash detecta modificaciones respecto de un valor confiable; no constituye por sí mismo una firma digital certificada ni garantiza no repudio.

## ADR-007 Seguridad y auditoría

**Contexto:** existen rutas privadas para inspectores, coordinadores, administradores y prestadores, y RF13 exige consulta ciudadana sin inicio de sesión.

**Decisión:** el gateway aplica controles perimetrales; el backend verifica JWT y permisos sobre cada operación privada y cada expediente. La consulta pública usa una proyección con campos autorizados y no exige JWT. Las mutaciones sensibles registran usuario, acción, expediente y tiempo del servidor; los metadatos del archivo adjunto se conservan diferenciados de la hora de recepción.

**Alternativa:** validar solo en la interfaz o aplicar autenticación obligatoria al portal QR. La primera deja accesos sin protección efectiva y la segunda contradice RF13.

**Consecuencias:** RBAC se complementa con verificación de pertenencia del expediente. Auditoría requiere permisos de solo inserción para la aplicación, acceso de lectura controlado y detección de alteraciones; llamarla append-only no basta. Cada solicitud web verifica permisos vigentes en el servidor. El objetivo de protección de datos indicado en las fuentes necesita evaluación específica antes de afirmar cumplimiento.

## Validación prevista

| Decisiones | Evidencia a obtener durante implementación |
|---|---|
| ADR-001, ADR-003 | Prueba con 1,200 solicitudes/minuto, latencia P95 y fallo de una instancia; medir retraso de réplica e invalidación. |
| ADR-002, ADR-004 | Reglas probadas sin framework ni servicios externos; sustitución de adaptadores y simulación de caída externa. |
| ADR-006 | Recuperación después de fallar cada paso, verificación de hashes y restauración de evidencias. |
| ADR-007 | Consulta QR sin token; denegación de acceso a expedientes ajenos y trazabilidad de cambios. |

Los criterios de aceptación arquitectónica se detallan en los escenarios de calidad.

## Documentos relacionados

- [Estilo arquitectónico](../02-arquitectura-software/estilo-arquitectonico.md).
- [Enfoque Clean Architecture](../02-arquitectura-software/enfoque-arquitectonico.md).
- [Escenarios de calidad](08-escenarios-atributos-calidad.md).

## ADR-008 Recuperación y despliegue redundante

**Contexto:** AC02, AC04 y AC08 requieren continuidad, custodia y costos controlados; replicar solamente el backend no cubre fallos del gateway, base, caché o broker.

**Decisión:** desplegar instancias API en dos dominios de fallo, entrada redundante, PostgreSQL con standby síncrono para datos confirmados y réplica asíncrona para reportes. La promoción aplica exclusión del primario anterior para evitar dos escritores. Redis puede reconstruirse; su caída deriva a lectura controlada de primaria. RabbitMQ utiliza colas durables replicadas, mensajes persistentes, confirmación del publicador y acuse del consumidor después de persistir el resultado. La outbox conserva tareas hasta confirmar publicación. Las referencias de objetos se verifican antes del acuse de recepción.

**Alternativas:** primaria única con restauración manual o replicación asíncrona como única protección. La primera aumenta la interrupción; la segunda puede perder transacciones ya confirmadas al promover un nodo atrasado.

**Consecuencias:** la redundancia incrementa costo y latencia de escritura. Si el standby síncrono no está disponible, se informa la indisponibilidad temporal en la web y se suspende la confirmación de escrituras antes de degradar silenciosamente la garantía. Las copias con recuperación a un punto temporal y el versionado de objetos protegen frente a borrado o corrupción lógica. RPO objetivo de datos confirmados: 0 ante fallo de un nodo; RTO propuesto: ≤ 5 minutos en conmutación controlada. Una pérdida regional queda fuera de esa garantía hasta definir y ensayar recuperación geográfica.

**Verificación:** fallar instancia, primaria y broker; contrastar registros confirmados, eventos y hashes; medir recuperación y restaurar copias. Son objetivos de diseño, no resultados de pruebas de un despliegue existente.

Referencias técnicas: [entrega confiable en RabbitMQ](https://www.rabbitmq.com/docs/reliability) y [retención de objetos en Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html). Un proveedor compatible con S3 debe acreditar por separado las capacidades de retención contratadas.
