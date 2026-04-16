# Plan de implementación – Gestor ICE React + TypeScript

## 1. Inicialización del proyecto y configuración base
- Crear proyecto React + TypeScript (`create-react-app` o Vite).
- Instalar Material UI (`@mui/material`, `@emotion/react`, `@emotion/styled`).
- Configurar estilos globales y estructura inicial.

## 2. Definición de tipos y utilidades
- Crear `/types/task.ts` con los tipos `Task` e `ICEValues`.
- Implementar utilidades en `/utils/ice.ts` para cálculo ICE y validaciones.

## 3. Estructura de carpetas y componentes base
- Crear carpetas `/components`, `/hooks`, `/utils`, `/types`.
- Crear archivos base vacíos para cada componente principal.

## 4. Implementación de Navbar y layout principal
- Desarrollar el componente `Navbar` (AppBar de Material UI).
- Estructurar el layout principal en `App.tsx`.

## 5. TaskList y TaskCard
- Implementar `TaskList` para mostrar tareas ordenadas.
- Implementar `TaskCard` para mostrar datos y acciones de cada tarea.

## 6. TaskForm y gestión de creación/edición
- Desarrollar `TaskForm` para crear y editar tareas.
- Añadir validaciones de nombre y descripción.

## 7. PriorityModal e integración con IA
- Implementar `PriorityModal` para mostrar valores ICE sugeridos.
- Integrar llamada a la API de Gemini (mock si es necesario).

## 8. Gestión de estado y lógica de ordenación
- Unir todos los componentes en `App`.
- Gestionar el estado global de tareas con `useState`.
- Implementar lógica de ordenación y actualización de tareas.

---

Este plan permite avanzar de forma incremental, validando cada parte antes de pasar a la siguiente. ¿Listo para comenzar la implementación?