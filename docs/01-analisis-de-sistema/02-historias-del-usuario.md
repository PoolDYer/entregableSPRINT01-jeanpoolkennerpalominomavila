# Historias del usuario

| ID | Historia de usuario |
| :--- | :--- |
| **HU01** | Como usuario del sistema (inspector, coordinador, prestador, admin), quiero autenticarme mediante credenciales seguras y mantener una sesión protegida por tokens, para acceder únicamente a las funciones autorizadas según mi rol asignado. |
| **HU02** | Como administrador del sistema, quiero gestionar los usuarios, asignar roles y configurar permisos (RBAC), para salvaguardar la segregación de funciones y la seguridad operativa de la plataforma. |
| **HU03** | Como usuario registrado, quiero restablecer mi contraseña mediante correo electrónico verificado, para recuperar mi acceso seguro en caso de olvido o bloqueo de credenciales. |
| **HU04** | Como turista o ciudadano, quiero consultar prestadores formales y consultar sellos QR de locales sin registrarme ni iniciar sesión, para verificar la legalidad del servicio de manera instantánea. |
| **HU05** | Como inspector de campo autenticado, quiero diligenciar fichas técnicas de fiscalización en la consola web institucional, para registrar y consultar las inspecciones de los establecimientos asignados. |
| **HU06** | Como inspector de campo autenticado, quiero adjuntar fotografías y firmas manuscritas digitalizadas mediante el aplicativo web, para conservar evidencias vinculadas e íntegras de la inspección. |
| **HU07** | Como coordinador de fiscalización autenticado, quiero programar campañas tácticas y despachar hojas de ruta digitales a los inspectores, para optimizar el despliegue de personal según el nivel de riesgo de los sectores. |
| **HU08** | Como coordinador de fiscalización autenticado, quiero revisar los descargos remitidos y controlar los plazos de subsanación de los establecimientos, para determinar el levantamiento de observaciones o la derivación a proceso sancionador. |
| **HU09** | Como prestador turístico autenticado, quiero visualizar las actas emitidas hacia mi local y adjuntar pruebas documentales de descargo, para subsanar observaciones antes del vencimiento del plazo administrativo. |
| **HU10** | Como coordinador de fiscalización autenticado, quiero acceder a tableros de mando y mapas GIS de calor sobre informalidad, para evaluar la cobertura inspectiva y respaldar las decisiones institucionales. |
| **HU11** | Como administrador del sistema, quiero consultar la bitácora estructurada de solo anexado (Append-Only Log), para auditar con fines periciales las acciones críticas, accesos y modificaciones efectuadas por los usuarios. |
| **HU12** | Como coordinador, quiero registrar y consultar prestadores y sus documentos, para mantener un padrón institucional actualizado. |
| **HU13** | Como coordinador, quiero recibir alertas de documentos próximos a vencer, para programar acciones preventivas. |
| **HU14** | Como coordinador, quiero conocer el nivel de criticidad del establecimiento, para priorizar la fiscalización. |

## Aceptación de las historias

Cada historia se acepta cuando satisface los criterios de sus RF asociados en la [matriz funcional](03-requisitos-funcionales.md#criterios-de-aceptación-funcional). HU05 y HU06 incluyen recuperación de borradores guardados en el servidor y reenvío de la misma operación; HU08 y HU09 incluyen acceso a expediente ajeno y vencimiento del plazo; HU04 incluye consulta sin token y exclusión de evidencias privadas. Son criterios de diseño, pendientes de ejecución sobre la aplicación.
