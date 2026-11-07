# Actores del sistema

| Tipo | Actor / Sistema | Descripción | ¿Qué necesita realizar? |
| :--- | :--- | :--- | :--- |
| **Humano (Autenticado)** | **Inspector de Campo** | Personal fiscalizador (DIRCETUR, MPH, Defensa Civil) que registra las inspecciones mediante la consola web institucional. | Iniciar sesión segura en el aplicativo web, consultar hojas de ruta asignadas, registrar inspecciones, adjuntar fotografías y firmas manuscritas digitalizadas y consultar las actas emitidas. |
| **Humano (Autenticado)** | **Coordinador de Fiscalización** | Jefatura técnica y administrativa sectorial de DIRCETUR y la Municipalidad Provincial de Huamanga. | Iniciar sesión en la consola web administrativa, planificar campañas operativas (p. ej., Semana Santa), delimitar sectores territoriales, asignar hojas de ruta a inspectores, evaluar descargos de subsanación, emitir resoluciones sancionadoras y monitorear el padrón. |
| **Humano (Autenticado)** | **Prestador Turístico (Administrado)** | Representante legal o titular de un establecimiento turístico (hospedaje, restaurante, agencia o guía). | Iniciar sesión en el portal web del administrado, consultar expedientes y actas levantadas contra su establecimiento, registrar descargos formales de subsanación y adjuntar medios probatorios documentales o fotográficos dentro de los plazos de ley. |
| **Humano (Autenticado)** | **Administrador del Sistema (TI)** | Personal técnico responsable de la gobernanza, seguridad y operación de la plataforma de software. | Iniciar sesión administrativa con privilegios elevados, gestionar usuarios y credenciales, asignar y revocar roles/permisos mediante control de acceso RBAC, auditar bitácoras inalterables del sistema y monitorear la infraestructura. |
| **Humano (No Autenticado / Público)** | **Turista / Ciudadano** | Visitante local, nacional, extranjero o residente que accede libremente sin requerir inicio de sesión. | Acceder al portal web ciudadano público, consultar el directorio de hospedajes y agencias verificadas, consultar códigos QR oficiales de los locales para validar su acreditación en tiempo real y consultar la información pública de establecimientos. |
| **Sistema externo** | **Plataforma RUC SUNAT** | Servicio tributario del Estado peruano para consultas de contribuyentes. | Validar en tiempo real el RUC, la razón social, la dirección fiscal y el estado de vigencia y condición de habido del prestador. |
| **Sistema externo** | **Directorio Nacional MINCETUR** | Repositorio ministerial centralizado de prestadores turísticos formales a nivel nacional. | Validar de forma automatizada las categorizaciones oficiales, registros sectoriales y constancias de inscripción. |
| **Sistema externo** | **Servidor OpenStreetMap (GIS)** | Servicio de cartografía e información geoespacial. | Proporcionar capas cartográficas base, referencia cartográfica y soporte para visualización de polígonos territoriales. |
| **Sistema externo** | **Pasarela SMS / Correo Institucional** | Servicio telemático de despacho masivo de notificaciones oficiales. | Despachar copias de actas de fiscalización digitales con hash criptográfico, notificar resoluciones administrativas, emitir alertas por caducidad de certificados y remitir enlaces seguros de recuperación de cuentas. |

## Autorización por operación y ámbito

| Operación | Inspector | Coordinador | Administrador TI | Prestador | Ciudadano |
|---|---|---|---|---|---|
| Capturar / registrar inspección | Solo asignaciones vigentes | Consulta institucional | Sin atribución inspectiva | No | No |
| Mantener padrón y programar operativos | Consulta de ruta | Gestiona su ámbito institucional | No | Consulta su establecimiento | Ficha pública |
| Presentar descargo | Consulta autorizada | Consulta y evalúa | No | Solo expediente propio | No |
| Evaluar / derivar expediente | No | Resuelve con motivo registrado | No | Consulta resultado propio | No |
| Usuarios y permisos | Cuenta propia | Cuenta propia | Gestiona accesos | Cuenta propia | No aplica |
| Bitácora e indicadores privados | Trazas de su operación | Indicadores institucionales | Auditoría técnica autorizada | No | No |
| Directorio y QR | Público | Público | Público | Público | Público |

Un rol no concede acceso universal: cada solicitud valida institución, asignación o titularidad. Administración técnica y resolución de expedientes son responsabilidades separadas. SUNAT y MINCETUR representan integraciones previstas; su acceso técnico, permisos y contratos de servicio se confirman durante implementación.
