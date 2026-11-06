# Nivel 1 · Diagrama de contexto del sistema

> **Proyecto:** SIFITUR Huamanga · **Modelo:** C4 · Nivel 1

## 1. Objetivo

Mostrar SIFITUR como una caja única: quiénes usan el sistema y con qué servicios externos se comunica. Audiencia: responsables institucionales, usuarios, equipo técnico y docentes.

## 2. Diagrama

![Contexto del sistema SIFITUR](../../img/nivel1-contexto.jpg)

Exportación SVG: [nivel1-contexto.svg](../../img/fuentes-svg/nivel1-contexto.svg).

## 3. Personas

| Persona | Acción en el sistema |
|---|---|
| Inspector de campo | Inspecciona, registra firmas y fotografías y sincroniza actas. |
| Coordinador DIRCETUR/MPH | Mantiene padrón, programa operativos y evalúa descargos. |
| Administrador TI | Administra usuarios, permisos, auditoría y configuración. |
| Prestador turístico | Consulta su expediente y presenta subsanaciones. |
| Turista / ciudadano | Consulta formalidad y resuelve códigos QR sin iniciar sesión. |

## 4. Sistemas

| Sistema | Tipo | Responsabilidad |
|---|---|---|
| SIFITUR Huamanga | Sistema en alcance. | Fiscalización integral y verificación pública de servicios turísticos. |
| SUNAT RUC | Externo. | Validación de datos tributarios del prestador. |
| MINCETUR | Externo. | Consulta de registros y constancias sectoriales. |
| OpenStreetMap / GIS | Externo. | Provisión de cartografía base. |
| Pasarela SMS / correo | Externo. | Entrega de actas, avisos y recuperación de acceso. |

## 5. Relaciones

| Origen | Destino | Relación de negocio |
|---|---|---|
| Inspector | SIFITUR | Registra inspecciones y evidencias. |
| Coordinador | SIFITUR | Planifica y supervisa la fiscalización. |
| Administrador | SIFITUR | Gestiona accesos y auditoría. |
| Prestador | SIFITUR | Presenta descargos de su establecimiento. |
| Ciudadano | SIFITUR | Verifica la formalidad del servicio. |
| SIFITUR | SUNAT | Consulta datos del RUC. |
| SIFITUR | MINCETUR | Consulta información sectorial. |
| SIFITUR | OpenStreetMap | Obtiene cartografía. |
| SIFITUR | Pasarela SMS / correo | Remite documentos y alertas. |

## 6. Decisiones y supuestos

La consulta ciudadana muestra únicamente información pública. Actas, firmas, evidencias y descargos requieren autorización por rol y expediente. Los servicios externos conservan su administración independiente y se integran mediante adaptadores.

Siguiente nivel: [Contenedores](Nivel2-DiagramadeContenedores.md).

## 7. Alcance e invariantes de las vistas

Las cinco personas y los cuatro sistemas externos conservan su identidad al navegar por C4. El nivel 2 indica su canal y el nivel 3 el componente que atiende la interacción. En el nivel 3 la pasarela se muestra a través del trabajador, que constituye otro contenedor; sus clases no se ubican dentro de la frontera de la API.

El acceso a SUNAT y MINCETUR se modela como integración prevista. No se presupone que una API pública permita todas las consultas sin acuerdo, credenciales o límites. La publicación del estado institucional es responsabilidad de SIFITUR y no una respuesta automática de un tercero.

## Herramientas y fuentes de diagramas

Estas vistas se gestionan en **Structurizr** desde [workspace.dsl](../../diagrams/structurizr/workspace.dsl). [Abrir el visor C4](../../diagrams/structurizr/site/index.html).

Los niveles 1–3 son vistas nativas del modelo. Structurizr integra el nivel 4 como vistas de imagen vinculadas al componente Inspecciones; las clases y secuencias se mantienen en PlantUML y se renderizan localmente.

| Vista | Fuente | Visor |
|---|---|---|
| nivel1-contexto | [Modelo DSL](../../diagrams/structurizr/workspace.dsl) | [Structurizr](../../diagrams/structurizr/site/index.html?diagram=nivel1-contexto) |

[Catálogo y reproducción de diagramas](../../diagrams/README.md).
