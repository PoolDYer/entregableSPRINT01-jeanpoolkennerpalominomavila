# Verificación del alcance web de SIFITUR Huamanga

La revisión corresponde al aplicativo web y sus servicios centrales. Las métricas son objetivos de diseño; este repositorio contiene documentación y diagramas.

## Alcance vigente

- La consola institucional React atiende a inspector, coordinador y administrador TI.
- El portal React del administrado conserva el acceso al expediente propio y los descargos.
- El portal ciudadano Next.js permite consultar directorio y QR sin sesión.
- Los borradores se guardan en PostgreSQL mediante la API autenticada; las escrituras requieren conexión con el servidor.
- Las evidencias y firmas digitalizadas se adjuntan desde formularios web; se validan formato, tamaño, permisos e integridad.
- PostgreSQL primaria, réplica de lectura, standby síncrono, Redis, S3 y RabbitMQ conservan las responsabilidades de persistencia y continuidad documentadas.
- Los identificadores de requisitos vigentes se conservan; los omitidos no se reutilizan.

## Diagramas y trazabilidad

Se actualizan las 18 fuentes JSON Archify, las cuatro fuentes UML y el modelo DSL de Structurizr. Las 25 vistas publicadas incluyen proceso, arquitectura, componentes, paquetes, agregado, registro, estados, patrones, SOLID y C4 niveles 1 a 4.

El modelo C4 mantiene cinco personas, cuatro sistemas externos, once contenedores lógicos y dieciséis grupos de componentes del backend. La entrada del inspector se canaliza por la consola institucional, el gateway y la API.

Cada vista conserva fuente editable, visor HTML y exportaciones JPG, PNG y SVG. Los recibos generados corresponden a las fuentes vigentes; el informe JSON se obtiene ejecutando `node scripts/verificar-diagramas.mjs`.

## Controles

El verificador comprueba relaciones, fronteras, estados, idempotencia, confirmaciones T1/T2, referencias de archivos, correspondencia de exportaciones y hashes de fuentes y visores. También comprueba enlaces relativos y el alcance exclusivo web de las fuentes documentales.

La revisión visual comprueba legibilidad, ausencia de nodos retirados, entradas web, ubicación de etiquetas y coherencia con las responsabilidades de cada vista.
