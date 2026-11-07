| ID | Decisión | Driver relacionado | Justificación | Resultado previsto |
|---|---|---|---|---|
| ADR-001 | Backend como monolito modular con instancias sin estado. | DA03, DA08. | Mantener una unidad de despliegue del negocio y permitir replicar su ejecución sin administrar microservicios desde el inicio. | Módulos de identidad, padrón, operativos, fiscalización, subsanaciones, riesgo, consulta y auditoría. |
| ADR-002 | Clean Architecture por módulo. | DA05, DA06, DA07. | Aislar reglas de fiscalización de frameworks, persistencia y proveedores. | Dominio, aplicación, presentación e infraestructura con dependencias hacia el interior. |
| ADR-003 | Consulta pública con caché y réplica de lectura. | DA03, DA04. | Absorber el predominio de lecturas y mantener las escrituras institucionales separadas de los reportes. | Redis para fichas públicas y PostgreSQL de lectura para consultas tolerantes a desfase. |
| ADR-004 | Integraciones mediante puertos y adaptadores. | DA06. | Evitar que cambios o indisponibilidad de proveedores invadan los casos de uso. | Adaptadores SUNAT, MINCETUR, GIS y notificaciones. |
| ADR-006 | Evidencias en objetos y tareas asíncronas recuperables. | DA05. | Separar archivos pesados del cómputo y preservar su relación con el expediente. | S3 compatible, RabbitMQ, trabajador e historial de procesamiento. |
| ADR-007 | Autorización por rol y auditoría de acciones sensibles. | DA01, DA05. | Proteger expedientes y mantener trazabilidad de cambios. | JWT para rutas privadas, RBAC en backend y registro de auditoría con acceso restringido. |
| ADR-008 | Recuperación y despliegue redundante. | DA03, DA05, DA08. | Evitar pérdida de datos confirmados y reducir interrupciones. | Standby síncrono, copias, broker replicado y conmutación controlada. |
