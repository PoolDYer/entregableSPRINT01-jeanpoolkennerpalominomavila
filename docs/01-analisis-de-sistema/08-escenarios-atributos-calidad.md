# Escenarios de atributos de calidad de SIFITUR Huamanga

## EQ-01. Rendimiento: consulta pública

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC01 |
| Fuente | Turista / ciudadano |
| Estímulo | Consulta un prestador o resuelve su QR. |
| Artefacto | Portal ciudadano, PublicQueryService y CacheRepository. |
| Entorno | Carga de 1,200 solicitudes/minuto; datos representativos; caché estabilizada. |
| Respuesta esperada | Devuelve exclusivamente la ficha pública autorizada. |
| Medida | P95 < 200 ms para consulta pública; P95 < 250 ms en API transaccional sin transferencia de archivos. |
| Verificación | Medir latencia del servicio, errores, aciertos de caché y tasa de solicitudes durante 30 minutos. |
| Estado | Objetivo de diseño; verificación en el entorno de despliegue. |

## EQ-02. Disponibilidad: continuidad institucional

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC02 |
| Fuente | Usuarios y monitor de servicio |
| Estímulo | Falla una instancia del backend durante una festividad. |
| Artefacto | Gateway, instancias NestJS y operaciones críticas. |
| Entorno | Despliegue redundante y monitoreo activo. |
| Respuesta esperada | Redirige solicitudes a instancias saludables y mantiene la consulta y el registro institucional. |
| Medida | Disponibilidad anual ≥ 99.5 %; durante festividades ≥ 99.9 %. Sobre 365 días, 99.5 % permite 43.8 horas de indisponibilidad. |
| Verificación | Sondas de consulta y registro; calcular tiempo disponible / tiempo observado; simular caída de instancia. |
| Estado | Objetivo de diseño; verificación en el entorno de despliegue. |

## EQ-03. Escalabilidad: demanda estacional

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC03 |
| Fuente | Aumento del tráfico ciudadano |
| Estímulo | Crece la tasa de consulta en campañas turísticas. |
| Artefacto | Balanceador, backend, Redis y réplica de lectura. |
| Entorno | Carga ascendente hasta 1,200 solicitudes/minuto (20 por segundo). |
| Respuesta esperada | Distribuye carga y agrega instancias cuando el uso de CPU supera 70 %. |
| Medida | Sostener 1,200 solicitudes/minuto durante 30 minutos sin pérdida de registros y con los P95 de EQ-01. |
| Verificación | Prueba de carga incremental; registrar CPU, memoria, latencia, errores y número de instancias. |
| Estado | Objetivo de diseño; verificación en el entorno de despliegue. |

## EQ-04. Durabilidad: custodia de evidencias

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC04 |
| Fuente | Inspector y fallo de almacenamiento |
| Estímulo | Se interrumpe el procesamiento tras recibir una fotografía o acta. |
| Artefacto | S3, referencias PostgreSQL, outbox y trabajador. |
| Entorno | Reintentos después de fallos; objetos versionados y copias configuradas. |
| Respuesta esperada | Recupera el procesamiento sin perder originales ni confirmar evidencias inexistentes. |
| Medida | Cero objetos confirmados perdidos en los ensayos; 100 % de hashes coincidentes. La durabilidad de 99.999999999 % anual es el objetivo del servicio S3 contratado. |
| Verificación | Interrumpir cada etapa, restaurar copias y comprobar objetos, referencias y hashes. |
| Estado | Objetivo de diseño; verificación en el entorno de despliegue. |

## EQ-05. Seguridad: acceso por rol y expediente

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC05 |
| Fuente | Usuario sin sesión, rol incorrecto o expediente ajeno |
| Estímulo | Intenta consultar o modificar información privada. |
| Artefacto | Guard JWT/RBAC, controladores y casos de uso privados. |
| Entorno | Rutas privadas con TLS y persistencia cifrada; consulta QR pública separada. |
| Respuesta esperada | Deniega la operación, no cambia información y no expone campos privados. |
| Medida | Rechazar 100 % de casos no autorizados de la matriz; QR público accesible sin JWT; TLS 1.3 y AES-256 verificados en el entorno. |
| Verificación | Pruebas por rol, pertenencia y token; inspeccionar respuestas y configuración de cifrado. |
| Estado | Objetivo de diseño; verificación en el entorno de despliegue. |


## EQ-07. Auditoría: trazabilidad de cambios

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC07 |
| Fuente | Usuario autorizado |
| Estímulo | Crea, modifica o anula un acta. |
| Artefacto | Bitácora append-only y transacción de inspección. |
| Entorno | Operación privada; hora de recepción del servidor y tiempo de captura separados. |
| Respuesta esperada | Registra actor, acción, entidad, fecha y origen; restringe modificación y borrado. |
| Medida | 100 % de mutaciones confirmadas con evento de auditoría; cero UPDATE o DELETE permitidos al usuario de aplicación sobre la bitácora. |
| Verificación | Relacionar transacciones con eventos; probar permisos de escritura y revisión de integridad. |
| Estado | Objetivo de diseño; verificación en el entorno de despliegue. |

## EQ-08. Eficiencia de costos: carga y almacenamiento

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC08 |
| Fuente | Administrador TI |
| Estímulo | Dimensiona capacidad y revisa consumo institucional. |
| Artefacto | Clúster, caché, réplica, objetos y mensajería. |
| Entorno | Misma carga objetivo, región y volumen de archivos en escenarios comparables. |
| Respuesta esperada | Presenta costos mensuales por recurso y utiliza software libre en los componentes indicados. |
| Medida | 100 % de recursos con estimación de costo y consumo; presupuesto mensual institucional pendiente de definición. |
| Verificación | Inventariar recursos, solicitudes, GB almacenados, transferencia y horas de cómputo; comparar con presupuesto aprobado. |
| Estado | Objetivo de diseño; verificación en el entorno de despliegue. |

## EQ-09. Mantenibilidad: sustitución de proveedor

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC09 |
| Fuente | Equipo de desarrollo |
| Estímulo | Sustituye el almacenamiento o notificador de un módulo. |
| Artefacto | Puertos de dominio, adaptadores e InspeccionesModule. |
| Entorno | Pruebas del núcleo ejecutadas sin NestJS ni acceso a red. |
| Respuesta esperada | Agrega una implementación y actualiza la composición conservando las reglas. |
| Medida | Cero cambios en dominio y casos de uso; 100 % de pruebas de contrato y regresión aprobadas. |
| Verificación | Comparar cambios, revisar importaciones y ejecutar pruebas con ambos adaptadores. |
| Estado | Objetivo de diseño; verificación en el entorno de despliegue. |

## Resumen de escenarios

| Código | Atributo | Decisiones relacionadas |
|---|---|---|
| EQ-01 | AC01 | ADR-003 |
| EQ-02 | AC02 | ADR-001, ADR-008 |
| EQ-03 | AC03 | ADR-001, ADR-003 |
| EQ-04 | AC04 | ADR-006 |
| EQ-05 | AC05 | ADR-007 |
| EQ-07 | AC07 | ADR-007 |
| EQ-08 | AC08 | ADR-001, ADR-003 |
| EQ-09 | AC09 | ADR-002, ADR-004 |
| EQ-10 | AC01, AC05 | ADR-003 |
| EQ-11 | AC02, AC09 | ADR-004 |

## Condiciones comunes de medición

Los escenarios describen aceptación futura; la revisión documental no equivale a una prueba del sistema. Las metas de la propuesta se conservan y las precisiones siguientes son parámetros de diseño para validar en la implementación.

| Parámetro | Definición operativa |
|---|---|
| Carga | 1,200 solicitudes/minuto durante 30 minutos, después de 5 minutos de calentamiento; mezcla 95 % lecturas / 5 % escrituras. Registrar conjunto de datos y tamaño de cada evidencia. |
| Latencia | Medir desde el cliente de prueba hasta recepción completa de la respuesta HTTP. Separar consulta QR, transacción de metadatos y transferencia de objetos. Documentar red y ubicación del generador. |
| Errores | Meta propuesta: menos del 1 % de errores técnicos 5xx o timeout; los 4xx esperados de pruebas negativas se registran por separado. No descartar muestras lentas del P95. |
| Archivos | El intervalo de 2–4 segundos del Word se interpreta como objetivo de acuse de metadatos y encolado tras completar la transferencia; el tiempo total de carga depende del tamaño y ancho de banda, que se miden por separado. |
| Disponibilidad | Sondas cada minuto sobre QR y recepción de inspección; una interrupción cuenta desde la primera sonda fallida hasta recuperación. Incluye mantenimiento que impida esas operaciones. |
| Ventanas | 99.5 % anual equivale a 43.8 horas en 365 días. 99.9 % equivale a 1.44 minutos de caída por día de festividad; para 6 días, 8.64 minutos. Corrige la equivalencia de 43 minutos/año incluida en el Word. |
| Costos | Costo mensual = cómputo + bases/replicación + caché + broker + GB de objetos + solicitudes + transferencia + respaldo/monitoreo. DIRCETUR/MPH debe aprobar presupuesto y retención antes del dimensionamiento definitivo. |

## EQ-10. Consistencia de formalidad pública

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC01, AC05; RF13; ADR-003 |
| Fuente | Coordinador que modifica la formalidad de un establecimiento. |
| Estímulo | Se confirma una revocación mientras ciudadanos consultan el QR. |
| Artefacto | Proyección pública, outbox, Redis y PublicQueryService. |
| Entorno | Carga objetivo; publicación demorada o Redis fuera de servicio. |
| Respuesta esperada | Actualiza o invalida la ficha; si expira y no puede revalidarse, informa que la verificación está temporalmente no disponible. |
| Medida | Antigüedad máxima propuesta: 60 segundos desde generación de la proyección; cero respuestas que acrediten formalidad con una proyección vencida en el ensayo. |
| Verificación | Revocar, retrasar eventos, desconectar Redis y consultar cada segundo; revisar versión y fecha de la respuesta. |
| Estado | Parámetro de diseño sujeto a aceptación institucional y prueba. |

## EQ-11. Aislamiento de una integración externa

| Elemento | Descripción |
|---|---|
| Atributo de calidad | AC02, AC09; RC06; ADR-004 |
| Fuente | SUNAT, MINCETUR o pasarela no disponible. |
| Estímulo | Timeout o respuesta temporal de error. |
| Artefacto | Adaptadores, tareas de validación y notificación. |
| Entorno | Inspecciones y consulta pública siguen operativas. |
| Respuesta esperada | Marca consulta pendiente; conserva expediente; difiere reintentos sin bloquear el hilo de recepción. |
| Medida | Parámetros propuestos: timeout de 3 segundos por consulta externa; máximo 3 intentos por tarea antes de cola de revisión; cero expedientes declarados conformes solo por fallo del proveedor. |
| Verificación | Simular timeout, error y recuperación; comprobar independencia de recepción, tareas pendientes y ausencia de duplicados de expediente. |
| Estado | Parámetros de diseño; cuotas y contrato del proveedor por confirmar. |
