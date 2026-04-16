# Alcance funcional MVP: Gestor de Tareas Inteligente (Modelo ICE)

## Objetivo
Crear una aplicación web simple para gestionar tareas, que calcule la puntuación ICE de cada tarea usando la API de Gemini (IA gratuita de Google). El proyecto está orientado a un curso corto, debe ser muy sencillo y no requiere backend ni persistencia.


## Características principales

1. **Gestión de tareas**
   - Crear tareas con nombre y descripción (máximo 200 palabras).
   - Listar todas las tareas creadas en la sesión actual.
   - Las tareas se ordenan automáticamente por puntuación ICE (mayor a menor).

2. **Cálculo y edición de ICE**
   - Cada tarea tiene los tres campos ICE: Impacto, Confianza y Facilidad, editables manualmente (escala de 1 a 10).
   - Cada tarea tiene un botón para calcular automáticamente los valores ICE usando la API de Gemini, a partir de la descripción.
   - Al recibir la respuesta de la API, los tres campos se rellenan y se actualiza la puntuación total.
   - Mostrar el resultado ICE junto a la tarea.

3. **Restricciones técnicas**
   - Aplicación basada en React.
   - Sin backend ni base de datos (solo estado en memoria).
   - Interfaz muy simple y amigable.


## Flujo básico de usuario

1. El usuario ingresa el nombre y la descripción de una tarea (máx. 200 palabras).
2. La tarea aparece en una lista ordenada por puntuación ICE.
3. El usuario puede editar manualmente los valores de Impacto, Confianza y Facilidad (1-10).
4. El usuario puede pulsar un botón para calcular automáticamente los valores ICE usando la API de Gemini.
5. El resultado ICE (los tres campos y la puntuación total) se muestra y actualiza junto a la tarea.

## Notas
- No se requiere autenticación ni registro de usuarios.
- No se guarda información entre recargas de página.
- El foco está en la simplicidad y la experiencia de usuario.
- Se debe documentar en el código cómo cambiar la API de Gemini si fuera necesario.
- La escala de los campos ICE es de 1 a 10.
- La descripción de la tarea no puede superar las 200 palabras.

---

## Propuesta de estructura para implementación React + TypeScript

### Estructura de carpetas sugerida

```
/src
  /components
    Navbar/
    TaskList/
    TaskCard/
    PriorityModal/
    TaskForm/
  /types
    task.ts
  /utils
    ice.ts
    geminiApi.ts
  /hooks
    useTasks.ts
  App.tsx
  main.tsx
  index.css
```

### División en componentes principales

- **Navbar**: Barra superior con el título de la app.
- **TaskList**: Lista de tareas ordenadas por ICE.
- **TaskCard**: Tarjeta individual de tarea, muestra nombre, descripción, campos ICE, botones de acción.
- **PriorityModal**: Modal para mostrar y confirmar valores ICE sugeridos por IA.
- **TaskForm**: Formulario para crear o editar tareas.

### Gestión del estado (sin librerías externas)

- El estado global de las tareas se gestiona en el componente `App` usando React.useState.
- Se pasa el estado y los setters como props a los componentes hijos (`TaskList`, `TaskForm`, etc).
- Para lógica reutilizable (ordenar tareas, calcular ICE, validaciones), se recomienda usar hooks personalizados en `/hooks` y utilidades en `/utils`.
- No se utiliza Redux, Zustand ni ningún gestor externo; todo el estado vive en memoria y se pierde al recargar.

### Notas
- Todos los componentes usan Material UI para React.
- Los tipos de datos (Task, ICEValues) se definen en `/types/task.ts`.
- La integración con la API de Gemini se encapsula en `/utils/geminiApi.ts`.
- El código es modular, fácil de mantener y escalar.
