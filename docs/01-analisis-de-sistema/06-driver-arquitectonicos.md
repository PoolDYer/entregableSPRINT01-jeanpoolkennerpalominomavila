# Drivers arquitectónicos

| ID | Driver arquitectónico | Origen | ¿Por qué influye en la arquitectura? |
| :--- | :--- | :--- | :--- |
| **DA01** | Segregación de roles (RBAC), autenticación centralizada y control de acceso del aplicativo web. | AC05 - Seguridad / RC02 - RBAC | Exige validación JWT y autorización por rol y expediente en el backend; el WAF y el gateway complementan el control perimetral. |
| **DA03** | Picos de tráfico masivo durante festividades turísticas de Huamanga (30,000 visitantes únicos acumulados en 4 a 6 días). | AC02 - Disponibilidad / AC03 - Escalabilidad | Condiciona el empleo de balanceadores de carga L7, clúster de servidores sin estado (stateless) y réplicas de lectura de base de datos para absorción de demanda. |
| **DA04** | Latencias menores a 200 ms en la consulta ciudadana y lectura de sellos QR oficiales. | AC01 - Rendimiento | Conduce al uso de una capa de memoria ultrarrápida Redis Cache y distribución perimetral CDN para evitar consultas directas al motor transaccional. |
| **DA05** | Custodia e integridad de actas, firmas manuscritas y fotos forenses. | AC04 - Durabilidad / AC07 - Inmutabilidad | Obliga a desacoplar la persistencia de archivos en almacenamiento S3, usar colas asíncronas para sellado criptográfico y bitácoras append-only para auditoría. |
| **DA06** | Interoperabilidad con SUNAT, MINCETUR, cartografía GIS y notificaciones. | RC06 - Integraciones | Impone el diseño de adaptadores y clientes de integración desacoplados en el backend para aislar la disponibilidad interna ante caídas de servicios externos. |
| **DA07** | Cambiar proveedores de persistencia, notificación y validación sin alterar reglas institucionales. | AC09 - Mantenibilidad / RC06 | Determina contratos internos y pruebas independientes del framework. |
| **DA08** | Mantener costos operativos institucionales controlados. | AC08 - Eficiencia de costos | Orienta el uso de software libre, escalado por demanda y separación de cargas de lectura. |

## Trazabilidad de decisiones

| Driver | Requisitos de origen | Decisiones | Escenarios |
|---|---|---|---|
| DA01 | RF01, RF02, RF15; AC05 | ADR-007 | EQ-05 |
| DA03 | RF13; AC02, AC03 | ADR-001, ADR-008 | EQ-02, EQ-03 |
| DA04 | RF13; AC01 | ADR-003 | EQ-01, EQ-10 |
| DA05 | RF04, RF10, RF11; AC04, AC07 | ADR-006, ADR-007 | EQ-04, EQ-07 |
| DA06 | RF05, RF06, RF08, RF11, RF14; RC06 | ADR-004 | EQ-11 |
| DA07 | AC09 | ADR-002, ADR-004 | EQ-09 |
| DA08 | AC08 | ADR-001, ADR-003, ADR-008 | EQ-08 |
