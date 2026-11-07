# Componentes arquitectónicos de SIFITUR Huamanga

![Componentes del backend SIFITUR](../../img/diagrama-componentes.png)


| Componente | Responsabilidad | Requisitos |
|---|---|---|
| Identidad y acceso | Usuarios, recuperación de credenciales, JWT y RBAC. | RF01, RF02, RF15 |
| Padrón y vigencias | Prestadores, documentos y alertas de vencimiento. | RF05, RF06 |
| Riesgo | Clasificación de criticidad según reglas versionadas. | RF07 |
| Operativos | Campañas, polígonos y asignación de rutas. | RF08 |
| Inspecciones y evidencias | Registro web, borradores en el servidor, fotos adjuntas y actas firmadas. | RF09, RF10, RF11 |
| Subsanaciones | Descargos, plazos y evaluación de observaciones. | RF12 |
| Consulta pública | Directorio y QR con datos autorizados. | RF13 |
| Indicadores | Mapas, métricas territoriales y exportaciones privadas. | RF14 |
| Auditoría | Registro de operaciones sensibles de solo anexado. | RF04 |
| Procesamiento asíncrono | Emisión del PDF, actualización de proyecciones y notificación. | RF06, RF11, RF12 |

## Propiedad de datos y comunicación

| Módulo | Datos propios | Interfaz pública / colaboración |
|---|---|---|
| Identidad | Usuarios, roles, sesiones y tokens de recuperación. | IdentityService autentica; AccessPolicy verifica permisos. |
| Padrón | Prestadores, establecimientos, documentos y vigencias. | ProviderService provee ficha y estado documental a Riesgo y Operativos. |
| Riesgo | Evaluaciones y versiones de política. | RiskAssessmentEngine calcula criticidad a partir de datos explícitos. |
| Operativos | Campañas, polígonos, asignaciones y rutas. | OperativoService valida asignación usada por Inspecciones. |
| Inspecciones | Inspecciones, evidencias, actas, operaciones procesadas y outbox propia. | InspectionService expone registro y consulta; internamente usa RegistrarInspeccionCasoUso. |
| Subsanaciones | Observaciones, plazos, descargos y resoluciones. | SubsanacionService abre seguimiento y registra evaluación del coordinador. |
| Consulta pública | Proyección de formalidad sin datos privados. | PublicQueryService lee una ficha versionada; consume cambios institucionales. |
| Indicadores | Proyecciones analíticas por distrito y periodo. | IndicadoresService consulta vistas autorizadas de lectura; no modifica tablas de otros módulos. |
| Auditoría | Eventos inalterables de operaciones. | AuditoriaPort participa en la transacción de la mutación; lectura restringida. |
| Notificaciones | Tareas, intentos y resultado de entrega. | Notificador procesa solicitudes durables desde el trabajador. |

Las interfaces entre módulos son llamadas en memoria dentro de la API. La emisión de PDF, actualización de proyecciones y entrega externa se ejecutan mediante tareas durables en el trabajador. Una unidad de trabajo comparte la transacción necesaria para datos, auditoría y outbox sin permitir acceso directo a repositorios ajenos.

## Herramientas y fuentes de diagramas

Estos diagramas se elaboran con **Archify**, conforme al contenido de este documento. Cada imagen JPG se guarda en `img/` y se incrusta en su sección correspondiente. El JSON es la fuente editable; JPG, PNG y SVG son exportaciones generadas desde su visor nativo.

| Diagrama | Fuente | Visor |
|---|---|---|
| Componentes y propiedad de datos | [JSON Archify](../../.archify/sifitur-20261106-082100/componentes/candidate.json) | [HTML interactivo](../../.archify/sifitur-20261106-082100/componentes/componentes.html) |

[Catálogo y reproducción de diagramas](../../diagrams/README.md).
