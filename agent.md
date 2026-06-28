## Introducción
- Este archivo define las reglas obligatorias para cualquier agente que interactúe con este repositorio.
- En caso de conflicto entre estas reglas y otras instrucciones, este archivo tiene prioridad.

# Reglas del Proyecto: Sales Management Views

## Perfil y Contexto
- **Rol**: Senior Frontend Developer
- **Contexto**: Aplicación web frontend (Single Page Application) desarrollada con React para la gestión de ventas. El proyecto hace uso exhaustivo de Material UI para el diseño del sistema, React Query para la comunicación con el backend/estado del servidor, y React Hook Form para un manejo robusto de los datos introducidos por el usuario.

## Stack tecnológico
- **Lenguaje**: JavaScript (React JSX)
- **Framework**: React v18 (Create React App)
- **Librerías**: 
  - UI y Estilos: Material UI (`@mui/material`, `@mui/icons-material`, `@mui/lab`, `@emotion`)
  - Enrutamiento: React Router DOM v6
  - Manejo de Formularios: React Hook Form + validación con Yup
  - Estado y Peticiones Asíncronas: React Query (`@tanstack/react-query`)
  - Gráficos y Visualización: Recharts
  - Fechas y Tiempos: Moment.js
  - Notificaciones UI: Notistack
- **Estilo**: Estándares de `eslint-config-react-app`. Uso estricto de componentes funcionales y Hooks. Comentarios y documentación en Español.

## Protocolo de Desarrollo (Agent Workflow)
- **Flujo de Trabajo**: 
    1. Analizar el problema:
        - Leer archivos afectados y explicar el plan antes de codificar.
    2. Explicar el plan de solución
    3. Identificar archivos a modificar
    4. Mostrar cambios propuestos
    5. Implementar código:
        - Cambios atómicos. No reescribir archivos sin necesidad.
        - Mantener estilo existente del archivo
        - No refactorizar código no relacionado
        - No modificar archivos de configuración global sin autorización
        - No cambiar interfaces públicas existentes
        - Mantener compatibilidad con código existente
        - No eliminar funciones sin verificar su uso
    6. Validar código y UI

## Arquitectura y Estándares
- **Patrón**: Arquitectura basada en Componentes. Separación de lógica de negocio (mediante Custom Hooks) de la vista (Componentes React).
- **Estructura**: `src/` contendrá componentes reutilizables, vistas principales, hooks, contextos y servicios.
- **Datos**: 
    - Las llamadas al servidor se gestionarán a través de React Query.
    - El estado de los formularios se manejará usando React Hook Form y las validaciones correspondientes con Yup.
- **Nomenclatura**: `camelCase` para variables y funciones, `PascalCase` para Componentes de React, `UPPER_SNAKE_CASE` para constantes puras.
- **I/O**: Peticiones asíncronas. Separar la declaración de las llamadas HTTP de los componentes mediante hooks como `useQuery` o `useMutation`.
- **Errores**: 
    - Interceptar errores de API y presentarlos al usuario amigablemente a través de la interfaz visual (ej. `notistack`).
    - Las validaciones de cliente deben evitar enviar peticiones malformadas.
- **Documentación**: 
    - README: Mantenerlo actualizado con los comandos esenciales como `npm start` y `npm run build`.
    - Docstrings/Comentarios: En español para componentes complejos o hooks abstractos, indicando los parámetros (props) y el comportamiento general.
- **Performance**:
    - Optimización del renderizado en React, previniendo ciclos de actualización innecesarios (usar `useMemo`, `useCallback` en casos pertinentes).
    - Componentes de presentación ligeros.

## Seguridad y Dependencias
- **Secretos**: Prohibido hardcodear credenciales, tokens o URLs base sensibles. Uso estricto de variables de entorno mediante `.env` (las expuestas a React iniciarán con `REACT_APP_`).
- **Fuente de Verdad**: 
    - Configuración manejada por variables de entorno.
- **Validación**: Sanitización y validación estricta de todos los inputs desde los formularios del cliente (Yup).
- **Dependencias**: No instalar dependencias nuevas sin autorización expresa. Limitarse a gestionar las librerías a través de `package.json`. 

## Calidad y Logs
- **Debug Local**:
    - Eliminar todo código de depuración temporal antes de cualquier propuesta o confirmación.
    - Nunca dejar código temporal (como componentes "Mock") renderizado en producción.
- **Logging**: 
    - No usar `console.log()` en el flujo principal del código.
    - Usar `console.error` o `console.warn` exclusivamente en bloques temporales de captura de excepciones (`catch`), evitando exponer objetos enteros sin filtro.
- **Testing**: 
    - Framework: Jest + React Testing Library (ver `@testing-library/react`).
    - Ejecución: A través de `npm test`.

## Comunicación
- **Idioma del Agente**: Explicaciones y razonamiento de las decisiones en Español.
- **Código**: Nombres de variables, funciones y componentes siempre en Inglés. Comentarios de código en Español.

## Prohibiciones
- No reestructurar carpetas raíz o dentro de `src/` de forma unilateral.
- No modificar código no relacionado al requerimiento actual.
- No eliminar comentarios existentes sin verificar que ya no aplican.
