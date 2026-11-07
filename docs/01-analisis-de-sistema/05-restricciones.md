# Restricciones

| ID | Restricción | Descripción |
| :--- | :--- | :--- |
| **RC01** | Aplicativo web | El sistema debe desarrollarse como aplicativo web: consola institucional y portal del administrado React SPA, y portal público Next.js SSR. |
| **RC02** | Autenticación y Esquema RBAC | La plataforma debe implementar control de acceso basado en roles (RBAC), tokens JWT de corta duración y renovación de sesión para las funciones privadas del aplicativo web. |
| **RC04** | Comunicación mediante API REST | Toda interacción entre los clientes web y el backend debe ejecutarse mediante servicios API REST protegidos bajo protocolo HTTPS/TLS 1.3. |
| **RC05** | Almacenamiento de Objetos Desacoplado | Las fotografías con metadatos de integridad y las actas firmadas en PDF deben almacenarse en repositorios desacoplados compatibles con S3, sin guardarse en discos de cómputo locales. |
| **RC06** | Integración con Plataformas del Estado | La solución debe integrarse mediante adaptadores desacoplados a la Plataforma RUC de SUNAT, al Directorio de MINCETUR, a servicios GIS OpenStreetMap y a pasarelas SMS/Correo. |
| **RC07** | Cumplimiento Normativo y Legal | El diseño del tratamiento de datos y almacenamiento de expedientes debe ajustarse estrictamente a las disposiciones de la Ley N° 29733 (Ley de Protección de Datos Personales en el Perú). |
| **RC08** | Backend y persistencia institucional | Backend Node.js/NestJS, PostgreSQL primaria y réplica, Redis y RabbitMQ. |
| **RC09** | Control de versiones | Documentación, código y fuentes de diagramas versionados con Git en el repositorio del proyecto. |

## Parámetros institucionales y supuestos

| Aspecto | Tratamiento en el diseño |
|---|---|
| Políticas de riesgo y plazos | Se almacenan versionadas. No se atribuyen ponderaciones ni plazos sancionadores específicos a la institución sin una regla aprobada. |
| Retención de evidencias | La propuesta exige custodia duradera. El plazo concreto, acceso y disposición final se fijan con la política archivística y de datos personales. |
| Presupuesto | No existe monto aprobado en la propuesta; AC08 exige estimar y contrastar consumo antes del despliegue. |
| Dependencias externas | Acceso a API, cuotas, credenciales y capacidades de proveedores pendientes de validación técnica. |
| Documentación de diseño | Las rutas de clases y módulos especifican la implementación prevista; este entregable contiene documentación y diagramas. |
