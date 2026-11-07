# Atributos de calidad

| ID | Atributo de calidad | Objetivo de calidad | Origen |
|---|---|---|---|
| AC01 | Rendimiento y latencia | Consulta pública y QR con P95 menor a 200 ms; API transaccional con P95 menor a 250 ms. | RNF-01 |
| AC02 | Disponibilidad | 99.5 % anual; 99.9 % durante la ventana de festividades. | RNF-02 |
| AC03 | Escalabilidad | Soportar 1,200 solicitudes/minuto con instancias sin estado y balanceo. | RNF-03 |
| AC04 | Durabilidad e integridad | Conservar actas y originales fotográficos con hash y almacenamiento de objetos redundante. | RNF-04 |
| AC05 | Seguridad | TLS 1.3, cifrado AES-256, JWT para funciones privadas y autorización RBAC por expediente. | RNF-05 |
| AC07 | Auditoría | Registrar las acciones sensibles con usuario, tiempo y origen en una bitácora de solo anexado. | RNF-06 |
| AC08 | Eficiencia de costos | Priorizar software libre y medir el gasto de cómputo, almacenamiento y transferencia. | RNF-08 |
| AC09 | Mantenibilidad | Sustituir adaptadores sin modificar el dominio ni los casos de uso de fiscalización. | Clean Architecture |

Los escenarios y su verificación se especifican en [escenarios de atributos de calidad](08-escenarios-atributos-calidad.md).
