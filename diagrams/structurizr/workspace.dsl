workspace "SIFITUR Huamanga" "Arquitectura propuesta de fiscalización turística; RF01–RF15." {
    !impliedRelationships true
    model {
        inspector = person "Inspector de campo" "Registra inspecciones y adjunta fotografías y firmas mediante la web."
        coordinador = person "Coordinador DIRCETUR / MPH" "Planifica operativos y resuelve expedientes."
        admin = person "Administrador TI" "Gestiona accesos y auditoría técnica."
        prestador = person "Prestador turístico" "Consulta su expediente y presenta descargos."
        ciudadano = person "Turista / ciudadano" "Verifica formalidad y QR sin sesión."
        sunat = softwareSystem "SUNAT RUC" "Validación tributaria prevista; acceso por confirmar." "Externo"
        mincetur = softwareSystem "MINCETUR" "Consulta sectorial prevista; acceso por confirmar." "Externo"
        gis = softwareSystem "OpenStreetMap / GIS" "Cartografía de referencia." "Externo"
        pasarela = softwareSystem "Pasarela SMS / correo" "Aceptación y confirmación de avisos." "Externo"
        sifitur = softwareSystem "SIFITUR Huamanga" "Padrón, riesgo, operativos, inspecciones, subsanaciones y consulta pública." {
            consola = container "Consola institucional" "Inspecciones, evidencias, padrón, usuarios, rutas, evaluación y métricas privadas." "React SPA" "Web"
            portal = container "Portal del administrado" "Expediente propio y descargos." "React SPA" "Web"
            publico = container "Portal ciudadano" "Directorio y QR con información pública." "Next.js SSR" "Web"
            gateway = container "Gateway / balanceador" "TLS, WAF, límites de tráfico y reparto a instancias saludables." "NGINX + ModSecurity"
            api = container "Backend API Application" "Monolito modular sin estado; JWT, RBAC y ámbito del expediente." "Node.js / NestJS" {
                identity = component "IdentityController / IdentityService" "Usuarios, roles, sesión y recuperación; RF01, RF02, RF15." "REST / TypeScript"
                access = component "Auth & RBAC Guard / AccessPolicy" "Comprueba institución, asignación y titularidad; RF01, RF02." "Guard / política"
                inspection = component "InspectionController / InspectionService" "Autoriza, deduplica y coordina RegistrarInspeccionCasoUso; RF09–RF11." "Aplicación / TypeScript"
                validation = component "FileValidator / InspectionValidator" "Valida ficha, firma, formato, tamaño e integridad de archivos." "Validadores"
                providers = component "ManagementController / ProviderService" "Padrón, documentos y vigencias; RF05–RF06." "Aplicación / TypeScript"
                risk = component "RiskAssessmentEngine" "Criticidad mediante política versionada; RF07." "Dominio"
                operations = component "OperativoService" "Campañas, polígonos, asignaciones y versiones; RF08." "Aplicación"
                claims = component "AdministradoController / SubsanacionService" "Descargo propio y evaluación institucional; RF12." "Aplicación"
                query = component "PublicQueryController / PublicQueryService" "Ficha pública versionada, sin JWT; RF13." "Aplicación"
                metrics = component "IndicadoresController / IndicadoresService" "Mapas y exportaciones privadas con fecha de corte; RF14." "Aplicación"
                repository = component "InspectionRepository / AuditoriaPort" "Unidad de trabajo: inspección, auditoría y outbox atómicas; RF04, RF09." "Puertos / PostgreSQL"
                managementRepo = component "Repositorios de gestión" "ProviderRepository, OperativoRepository y SubsanacionRepository; propiedad por módulo." "Puertos / PostgreSQL"
                cache = component "CacheRepository / ConsultaPublicaRepository" "Proyección pública de hasta 60 s; revalidación en primaria." "Puertos / Redis"
                reports = component "IndicadoresRepository" "Lecturas autorizadas tolerantes al desfase." "Puerto / PostgreSQL"
                evidence = component "EvidenceManager / StorageAdapter" "Verifica originales, referencias y SHA-256 antes de T1." "Puerto / S3"
                integrations = component "SunatClient / MinceturClient / GisClient" "Adaptadores externos con timeout y reintento acotados." "HTTPS"
            }
            worker = container "Trabajador asíncrono" "QueuePublisher, ProcesarActaCasoUso y NotificationClient: outbox, PDF, proyecciones y avisos idempotentes." "Node.js"
            primary = container "PostgreSQL primaria" "Escrituras, auditoría y outbox; transacciones T1 y T2." "PostgreSQL 16" "Datos"
            replica = container "PostgreSQL réplica" "Reportes tolerantes al retraso, con fecha de corte." "PostgreSQL 16" "Datos"
            redis = container "Caché pública" "Proyecciones autorizadas; antigüedad máxima propuesta de 60 s." "Redis 7" "Datos"
            objects = container "Custodia de objetos" "Originales, firma y PDF; SHA-256, versionado y retención." "S3 compatible" "Datos"
            broker = container "Cola de tareas" "Mensajes persistentes, confirmación y acuse después del commit." "RabbitMQ" "Cola"
        }
        inspector -> consola "Registra y consulta inspecciones web"
        coordinador -> consola "Gestiona fiscalización"
        admin -> consola "Administra accesos y auditoría"
        prestador -> portal "Presenta descargos propios"
        ciudadano -> publico "Consulta formalidad y QR sin sesión"
        consola -> gateway "Gestiona según rol y ámbito" "HTTPS / REST"
        portal -> gateway "Consulta y presenta descargo propio" "HTTPS / REST"
        publico -> gateway "Consulta solo proyección pública" "HTTPS / REST sin JWT"
        gateway -> api "Filtra y distribuye tráfico" "HTTPS / red protegida"
        api -> primary "Confirma datos, auditoría y outbox" "SQL / TLS"
        api -> replica "Consulta indicadores con fecha de corte" "SQL / TLS"
        api -> redis "Consulta proyección vigente" "RESP / TLS"
        api -> objects "Carga y verifica originales" "HTTPS / S3 API"
        api -> sunat "Consulta RUC; fallo deja validación pendiente" "HTTPS"
        api -> mincetur "Consulta registro; fallo no acredita formalidad" "HTTPS"
        api -> gis "Obtiene cartografía de referencia" "HTTPS"
        primary -> replica "Replica para lectura analítica" "Replicación PostgreSQL / TLS"
        worker -> primary "Lee outbox y persiste T2 y resultados" "SQL / TLS"
        worker -> broker "Publica y consume con confirmaciones" "AMQPS / TLS"
        worker -> objects "Lee originales y conserva PDF y hash" "HTTPS / S3 API"
        worker -> redis "Actualiza o invalida proyección versionada" "RESP / TLS"
        worker -> pasarela "Envía actas y avisos; registra resultado" "HTTPS"
        consola -> inspection "Envía operación estable y referencias" "HTTPS / gateway"
        consola -> identity "Gestiona usuarios según privilegios" "HTTPS / gateway"
        consola -> providers "Mantiene padrón y vigencias" "HTTPS / gateway"
        consola -> claims "Evalúa descargos con motivo" "HTTPS / gateway"
        consola -> metrics "Consulta indicadores privados" "HTTPS / gateway"
        portal -> claims "Consulta expediente y presenta descargo propio" "HTTPS / gateway"
        publico -> query "Consulta directorio y QR" "HTTPS / gateway; sin JWT"
        inspection -> access "Verifica identidad y ámbito"
        providers -> access "Verifica rol e institución"
        claims -> access "Verifica titularidad o competencia"
        metrics -> access "Verifica permiso institucional"
        identity -> access "Administra permisos vigentes"
        inspection -> validation "Valida DTO e invariantes"
        inspection -> operations "Comprueba asignación y versionRuta"
        inspection -> evidence "Verifica objetos y hashes"
        inspection -> repository "Solicita T1 e idempotencia"
        providers -> risk "Solicita criticidad versionada"
        providers -> operations "Coordina visitas"
        providers -> claims "ManagementController delega evaluación de descargos"
        providers -> managementRepo "Persiste padrón y documentos"
        operations -> managementRepo "Persiste campañas y rutas"
        claims -> managementRepo "Persiste descargo y resolución"
        providers -> integrations "Valida información institucional"
        operations -> integrations "Obtiene cartografía"
        metrics -> integrations "Obtiene referencia GIS"
        query -> cache "Consulta proyección vigente"
        metrics -> reports "Consulta proyección autorizada"
        identity -> primary "Persiste usuarios, roles y sesiones" "SQL / TLS"
        repository -> primary "T1: datos + auditoría + outbox" "SQL / TLS"
        managementRepo -> primary "Persiste dentro del módulo" "SQL / TLS"
        cache -> redis "Lee copia temporal" "RESP / TLS"
        cache -> primary "Revalida al vencer o fallar Redis" "SQL / TLS"
        reports -> replica "Lee con fecha de corte" "SQL / TLS"
        evidence -> objects "Comprueba original y SHA-256" "HTTPS"
        integrations -> sunat "Consulta tributaria prevista" "HTTPS"
        integrations -> mincetur "Consulta sectorial prevista" "HTTPS"
        integrations -> gis "Consulta cartografía" "HTTPS"
    }
    views {
        systemContext sifitur "nivel1-contexto" {
            include *
            autoLayout lr 350 220
            title "C4 · Nivel 1 · Contexto de SIFITUR Huamanga"
            default
        }
        container sifitur "nivel2-contenedores" {
            include *
            exclude "consola -> api"
            exclude "portal -> api"
            exclude "publico -> api"
            // Distribución manual conservada por scripts/organizar-nivel2-structurizr.mjs.
            title "C4 · Nivel 2 · Contenedores de SIFITUR Huamanga"
        }
        component api "nivel3-componentes" {
            include *
            include worker broker pasarela
            autoLayout tb 240 110
            title "C4 · Nivel 3 · Componentes del Backend API"
        }
        image inspection "nivel4-clases" {
            image nivel4-clases.svg
            title "C4 · Nivel 4 · Clases y contratos de Inspecciones"
        }
        image inspection "nivel4-registro" {
            image nivel4-registro.svg
            title "C4 · Nivel 4 · Secuencia de registro de inspección"
        }
        image inspection "nivel4-secuencia" {
            image nivel4-secuencia.svg
            title "C4 · Nivel 4 · Secuencia de emisión del acta"
        }
        image inspection "nivel4-agregado" {
            image nivel4-agregado.svg
            title "C4 · Nivel 4 · Agregado de Inspecciones"
        }
        styles {
            element "Element" {
                color #ffffff
                background #2463a0
                fontSize 24
            }
            element "Person" {
                shape Person
                background #123a5a
            }
            element "Externo" {
                background #697785
            }
            element "Datos" {
                shape Cylinder
                background #276c64
            }
            element "Cola" {
                shape Pipe
                background #815ca3
            }
            element "Component" {
                shape Component
                background #437ba8
            }
            element "Web" {
                shape WebBrowser
            }
            relationship "Relationship" {
                color #45576b
                fontSize 20
                routing Orthogonal
            }
        }
    }
    configuration {
        scope softwaresystem
    }
    properties {
        "structurizr.introduction" "false"
    }
}
