# Product Requirements Document (PRD)
**Proyecto:** SkillMatch UNSA
**Fase:** MVP (Hackatón Transformagob)
**Documento:** Especificaciones de Arquitectura y Viaje de Usuario

---

## 1. Visión General del Producto
**SkillMatch UNSA** es un Hub Inteligente de Intermediación con IA. Actúa como un *Smart Data Gateway* que transforma el modelo de radiodifusión unidireccional en un ecosistema curado, exigiendo la estructuración obligatoria de vacantes y utilizando emparejamiento semántico para conectar oportunidades con el perfil académico verificado del egresado.

### 1.1 Identidad Visual (UI/UX)
El diseño de la interfaz aplicará un sistema de diseño estricto basado en la siguiente paleta de colores para garantizar una jerarquía visual corporativa e institucional:
*   **Primario:** `#371283` (Púrpura institucional, usado para navegación principal y llamados a la acción primarios).
*   **Acento/Alerta:** `#f50343` (Rojo/Rosa vibrante, usado para notificaciones de "Match", insignias y validaciones de fricción positiva).
*   **Fondo/Texto Secundario:** `#0a1a3e` (Azul oscuro profundo, usado para tipografía principal, paneles de lectura y contrastes fuertes).
*   **Superficies:** `#ffffff` (Blanco puro, usado en tarjetas de contenido, tableros y áreas de lectura de perfiles).

---

## 2. Stack Tecnológico
La arquitectura está diseñada para despliegue rápido, alta escalabilidad y procesamiento semántico de baja latencia.

*   **Frontend (Interfaces de Usuario):** Next.js (React) con Tailwind CSS para renderizado del lado del servidor (SSR) y paneles de control ultrarrápidos.
*   **Backend & Autenticación:** Supabase (PostgreSQL como servicio, Auth y Edge Functions).
*   **Base de Datos y Búsqueda Vectorial:** PostgreSQL con la extensión `pgvector` para el almacenamiento y cálculo de similitud (distancia del coseno) de los *embeddings* de perfiles y vacantes.
*   **Motor Semántico (IA):** Modelos de Transformadores de Oraciones (ej. MiniLM) integrados vía APIs (HuggingFace o APIs de OpenAI) para convertir texto estructurado en vectores.
*   **Orquestación y Despliegue:** Vercel (Frontend) y arquitectura MLOps básica para el monitoreo del modelo de inferencia.

---

## 3. Arquitectura de Usuarios y Viaje Principal

### 3.1 Portal de Acceso (Login General)
*   **Autenticación Unificada:** Un único punto de entrada con *Single Sign-On* (SSO) institucional.
*   **Ruteo Dinámico:** El sistema identifica el rol del usuario a través del token JWT y redirige automáticamente al tablero correspondiente (Talento, Industria, Gestión o Arquitectura).

---

### 3.2 Módulo Talento (Egresado UNSA)
**Objetivo:** Mostrar valor inmediato y facilitar la actualización del vector de habilidades sin permitir la alteración del *Ground Truth* institucional.

*   **Tablero de Impacto:** Visualización clara de "Convocatorias Recibidas" mostrando el porcentaje exacto de *Match* (>75%), nombre de la empresa y rango salarial.
*   **Sección Inmutable (Ground Truth):** Panel de solo lectura bloqueado criptográficamente. Muestra Edad, Correo Institucional UNSA, Escuela Profesional, Plan de Estudios y Pertenencia al Tercio/Quinto Superior.
*   **Actualización de Habilidades (Input Dinámico):** Formulario parametrizado para agregar herramientas técnicas, idiomas y experiencia (ej. Next.js, Inglés B1). Incluye un *parser* de currículum (carga en PDF) que extrae datos para rellenar los campos estructurados.
*   **Control de Disponibilidad:** Botones de estado o *toggles* prominentes (Ej. "Búsqueda Activa", "Escuchando Ofertas", "No Disponible") que actúan como filtro duro en la base de datos para no saturar al estudiante inactivo.

---

### 3.3 Módulo Industria (Empleadores)
**Objetivo:** Aplicar fricción positiva para estandarizar la oferta laboral y demostrar la calidad del ecosistema cerrado.

*   **Tablero de Inspiración:** Indicadores globales en la pantalla de inicio (Ej. "9,179 talentos UNSA validados en la red", "450 especialistas en Ciencia de la Computación activos").
*   **Identidad Corporativa:** Tarjeta de perfil de la empresa bloqueada por RUC y Razón Social validada, mostrando el giro del negocio.
*   **Historial de Curación:** Tabla de seguimiento de convocatorias enviadas, mostrando la tasa de conversión (ej. "Convocatoria Frontend: 12 Matches recibidos").
*   **Publicación Estricta (Fricción Positiva):** Formulario de creación de convocatoria con campos de selección obligatorios. El texto libre está restringido. Exige ingresar rangos salariales exactos, modalidad (remoto/presencial) y *skills* técnicos extraídos de una taxonomía predefinida.
*   **Reutilización de Plantillas:** Roles pre-rellenados basados en vacantes históricas de la empresa, permitiendo clonar y re-publicar con un solo clic si las condiciones salariales y técnicas se mantienen.

---

### 3.4 Módulo de Gestión (Administrativo UNSA)
**Objetivo:** Transformar al personal de "copistas de correos" a analistas de datos del mercado laboral.

*   **Tablero de Monitoreo:** Visualización de la salud del ecosistema. Identifica vacantes con exceso de coincidencia (70 matches) frente a vacantes desiertas (0 matches).
*   **Auditoría de Convocatorias:** Capacidad de hacer *drill-down* (profundizar) en cada oferta laboral para visualizar la demografía del talento emparejado.
*   **Controladores Paramétricos (Thresholds):** Interfaz para ajustar la tolerancia del algoritmo de *Match*. El gestor puede bajar el umbral de similitud mínima (ej. del 90% al 75%) para carreras con taxonomías más amplias o roles genéricos, inyectando flexibilidad humana al modelo matemático.

---

### 3.5 Módulo de Arquitectura (Ingeniería y Data)
**Objetivo:** Entorno técnico aislado para el mantenimiento del motor relacional y vectorial.

*   **Gestión de Base de Datos:** Acceso a los esquemas de PostgreSQL y auditoría de las tablas relacionales principales.
*   **Configuración Vectorial:** Panel para gestionar la dimensionalidad de `pgvector` y monitorear el índice de similitud del coseno.
*   **Ajuste del Motor (Fine-Tuning):** Interfaz técnica para recalibrar los pesos matemáticos del algoritmo de puntuación (ej. darle mayor peso a la experiencia técnica sobre la ubicación geográfica).
*   **Integración de Datos:** Herramientas de ingesta para sincronizar los *endpoints* o *dumps* de datos del ERP de la UNSA hacia la tabla inmutable del *Ground Truth*.