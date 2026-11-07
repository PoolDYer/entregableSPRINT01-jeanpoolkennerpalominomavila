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

## Enfoque arquitectónico organizado

La vista Clean Architecture del módulo Inspecciones se organiza con presentación a la izquierda, aplicación sobre el dominio, modelos y contratos en columnas, cuatro adaptadores alineados con sus recursos técnicos y raíz de composición al pie. Sus 23 elementos conservan la separación entre la API y el trabajador. Las realizaciones apuntan desde los adaptadores hacia los puertos internos.

El Markdown amplía la lectura de la figura, las rutas de implementación previstas, la matriz de inyección y la diferencia entre ejecución y dependencia de código. Se revisaron visualmente las exportaciones y se superaron las cuatro puertas de Archify: validate, deliver, check y browser-check. La verificación del repositorio registró 159 comprobaciones y 173 enlaces, sin errores.

## Nivel 2 de contenedores organizado

Se sustituyó la distribución automática por posiciones y recorridos manuales nativos de Structurizr. Actores y portales se sitúan a la izquierda; gateway, API y trabajador, al centro; almacenes y cola, a la derecha; los cuatro sistemas externos quedan alineados fuera del límite de SIFITUR. Se separó la conexión del trabajador a la primaria de la flecha de replicación.

Se comparó el modelo JSON con la revisión anterior: se conservan todos los elementos semánticos y las 22 relaciones visibles. La regeneración aplica el script de distribución antes de exportar el sitio y las imágenes desde el JSON compilado. Las exportaciones PNG y JPG se revisaron visualmente. El control final del repositorio registra 162 comprobaciones y 176 enlaces, sin errores.

## Nivel 3 de componentes organizado

La vista se organiza en entradas y servicios por fila funcional, coordinación de acceso y negocio en la columna central, y repositorios y adaptadores a la derecha. Los componentes disponen de mayor ancho para los nombres completos. Se conservan los dieciséis grupos de componentes, los 29 elementos visibles y las 43 relaciones; el modelo semántico y la distribución del nivel 2 se compararon con la revisión anterior y permanecen iguales.

El trabajador, los almacenes y los clientes web quedan fuera de la frontera de la API; los cuatro sistemas externos quedan fuera del límite de SIFITUR. La regeneración aplica las distribuciones de niveles 2 y 3 antes de exportar desde el JSON de Structurizr. La revisión visual comprueba nombres, etiquetas y recorridos; el verificador comprueba posiciones, cajas y fronteras. El control final registra 166 comprobaciones y 179 enlaces, sin errores.
