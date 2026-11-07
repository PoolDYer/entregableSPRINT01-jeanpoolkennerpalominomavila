# Requisitos funcionales

## Catálogo de Requisitos Funcionales
| ID | Requisito funcional |
| :--- | :--- |
| **RF01** | El sistema debe permitir la autenticación de usuarios mediante credenciales seguras, generando tokens JWT protegidos criptográficamente para el acceso a las APIs. |
| **RF02** | El sistema debe permitir la administración integral de usuarios, asignación de perfiles y privilegios mediante control de acceso basado en roles (RBAC). |
| **RF04** | El sistema debe registrar en una bitácora inmutable de solo anexado toda operación de creación, actualización o anulación de actas con usuario, marca temporal e IP. |
| **RF05** | El sistema debe permitir registrar, actualizar y consultar centralizadamente a prestadores turísticos (hospedajes, restaurantes, agencias y guías) vinculados a su RUC. |
| **RF06** | El sistema debe controlar las vigencias de licencias municipales, certificados ITSE y registros turísticos, generando alertas preventivas ante vencimientos a menos de 30 días. |
| **RF07** | El sistema debe calcular de manera algorítmica el nivel de criticidad o riesgo (Bajo, Medio, Alto, Crítico) de cada establecimiento evaluando sus antecedentes e infracciones. |
| **RF08** | El sistema debe permitir programar operativos tácticos, segmentar polígonos territoriales y consultar hojas de ruta digitales en la consola web de los inspectores asignados. |
| **RF09** | El sistema debe permitir diligenciar fichas de inspección y guardar borradores en el servidor mediante el aplicativo web, confirmar su registro transaccional y evitar duplicados al reenviar la misma operación. |
| **RF10** | El sistema debe permitir adjuntar fotografías desde el aplicativo web, validar formato, tamaño e integridad del archivo original y vincularlo a la inspección mediante metadatos, hash SHA-256 y hora de recepción del servidor. |
| **RF11** | El sistema debe generar actas digitales en formato PDF con control de integridad, firma manuscrita digitalizada adjunta al expediente y sellado de integridad mediante hash criptográfico, y remitir una copia al administrado mediante correo institucional. |
| **RF12** | El sistema debe gestionar el cómputo de plazos perentorios de subsanación y permitir la carga de pruebas y descargos por parte de los prestadores turísticos. |
| **RF13** | El sistema debe proveer un portal web ciudadano responsivo y público para la consulta de prestadores autorizados y la resolución inmediata de códigos QR sin requerir inicio de sesión. |
| **RF14** | El sistema debe generar mapas de calor GIS y tableros con métricas de informalidad distrital y porcentaje de cobertura inspectiva, con exportación de indicadores a Excel, GeoJSON y PDF. |
| **RF15** | El sistema debe permitir solicitar el restablecimiento de credenciales mediante un enlace temporal remitido al correo registrado. |

## Matriz de Trazabilidad (Historias de Usuario vs Requisitos Funcionales)
| Historia de usuario | Requisitos funcionales relacionados |
| :--- | :--- |
| **HU01** Autenticación y sesión segura | RF01, RF02 |
| **HU02** Gestión de usuarios y control RBAC | RF02, RF04 |
| **HU03** Restablecimiento de credenciales | RF15 |
| **HU04** Consulta pública ciudadana y lector QR | RF13 |
| **HU05** Registro web de inspecciones | RF01, RF09 |
| **HU06** Fotografías y firmas digitalizadas en actas | RF10, RF11 |
| **HU07** Programación de operativos y hojas de ruta | RF07, RF08 |
| **HU08** Evaluación de descargos y plazos de ley | RF06, RF12 |
| **HU09** Envío de subsanaciones por administrados | RF05, RF12 |
| **HU10** Tableros analíticos y mapas de calor GIS | RF14 |
| **HU11** Auditoría e inmutabilidad de registros | RF04 |
| **HU12** Gestión del padrón y documentos | RF05, RF06 |
| **HU13** Alertas de vencimiento | RF06 |
| **HU14** Clasificación del riesgo | RF07 |

## Correspondencia de requisitos

| Requisito de la propuesta web | Requisito del repositorio |
|---|---|
| RF-01 Padrón unificado | RF05 |
| RF-02 Documentos y vigencias | RF06 |
| RF-03 Cálculo de riesgo | RF07 |
| RF-04 Programación de operativos | RF08 |
| RF-05 Registro web de inspecciones | RF09 |
| RF-06 Evidencias fotográficas | RF10 |
| RF-07 Actas y firma digitalizada | RF11 |
| RF-08 Subsanaciones | RF12 |
| RF-09 Consulta ciudadana y QR | RF13 |
| RF-10 Tableros y GIS | RF14 |
| RNF-05 Seguridad | RF01, RF02 |
| RNF-06 Auditoría | RF04 |
| Refinamiento de seguridad de acceso (HU03; no enumerado en el Word) | RF15 |

## Criterios de aceptación funcional

Los identificadores RF vigentes se conservan para mantener la trazabilidad; los identificadores omitidos no se reutilizan. La tabla anterior corresponde al alcance web actualizado. Los siguientes criterios precisan su comportamiento para el diseño y la posterior verificación.

| ID | Entrada / condición | Resultado verificable | Excepción |
|---|---|---|---|
| RF01 | Cuenta activa y credenciales válidas. | Emite sesión con identidad, rol y vencimiento; protege cada operación privada. | Credencial inválida devuelve error genérico sin revelar existencia de cuentas. |
| RF02 | Administrador autorizado modifica un rol. | Registra permiso, responsable y fecha; el siguiente acceso al servidor usa los permisos vigentes. | Usuario sin privilegio no cambia roles. |
| RF04 | Mutación confirmada sobre un acta. | Existe evento con actor, acción, expediente, fecha del servidor, origen e identificador de correlación. | Si falla el registro de auditoría, no se confirma la mutación. |
| RF05 | RUC, razón social, nombre comercial, dirección y coordenadas del establecimiento. | Crea código único de expediente; actualizaciones mantienen historial y distinguen establecimientos de un mismo RUC. | Consulta externa fallida deja validación pendiente, sin declarar formalidad. |
| RF06 | Documento con fecha de vencimiento. | Revisión diaria avisa cuando faltan menos de 30 días calendario; al vencer cambia su estado. | Reejecución del mismo aviso no genera otra tarea para documento, fecha y destinatario iguales. |
| RF07 | Vigencias, antecedentes de clausura, aforo y denuncias registradas. | Devuelve Bajo, Medio, Alto o Crítico con desglose, fecha y versión de política. | Datos incompletos se señalan para revisión; no se inventan ponderaciones oficiales. |
| RF08 | Campaña, polígono, fechas e inspector activo. | Genera una ruta versionada y permite consultarla en la consola web. | Reasignación concurrente produce conflicto explícito; se consulta la versión vigente. |
| RF09 | Ficha web, operación única, versión y referencias de evidencias. | Guarda el borrador en PostgreSQL y confirma una sola inspección por operación. | Mismo identificador y otro contenido: 409; no sobrescribe el registro anterior. |
| RF10 | Archivo fotográfico original adjuntado desde el formulario web. | Valida formato y tamaño; conserva original, hash SHA-256 y metadatos vinculados. | Archivo inválido o hash incorrecto: 422; no confirma la evidencia. |
| RF11 | Inspección recibida con evidencia y firma digitalizada vinculada. | Genera PDF, conserva referencia y hash, confirma emisión y programa entrega al correo registrado. | Error de generación deja emisión pendiente; error de correo no anula el acta. |
| RF12 | Descargo del titular y plazo registrado en el expediente. | Guarda evidencias del descargo, registra evaluación y transición de estado con responsable y motivo. | Otro titular no accede; presentación fuera de plazo queda identificada para resolución institucional. |
| RF13 | Consulta pública por directorio o QR. | Muestra identificación del local, ubicación, estado y fecha de actualización, sin JWT. | QR inexistente no acredita al local; consulta sin datos vigentes no muestra sello de conformidad. |
| RF14 | Coordinador autorizado selecciona territorio y periodo. | Muestra cobertura e informalidad con filtros y fecha de corte; exporta Excel, GeoJSON y PDF. | Datos nominativos y evidencias privadas no se incorporan a la proyección pública. |
| RF15 | Solicitud al correo registrado. | Envía enlace de un uso con vencimiento; al consumirlo invalida sesiones previas. | Respuesta uniforme para correo desconocido; enlace usado o vencido no cambia contraseña. |

Los archivos de evidencia y descargo se adjuntan desde formularios web. El servidor valida permisos, formato, tamaño, hash y pertenencia al expediente. Las operaciones requieren conexión y solo se consideran guardadas tras la confirmación del servidor.
