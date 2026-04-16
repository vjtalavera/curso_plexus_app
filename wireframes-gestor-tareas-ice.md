# Wireframes – Gestor de Tareas ICE

## 1. Pantalla Principal (Home)

```
+------------------------------------------------------+
| Navbar: "Gestor de Tareas ICE"                       |
+------------------------------------------------------+
| [Botón: Nueva tarea]                                 |
|                                                      |
| ---------------------------------------------------  |
| | TaskList                                         | |
| |--------------------------------------------------| |
| | TaskCard                                         | |
| |  +-------------------------------+               | |
| |  | Nombre de la tarea            | [Editar]       | |
| |  | Descripción (máx 200 palabras)|               | |
| |  |                               |               | |
| |  | Impacto: [ 7 ] [input]        |               | |
| |  | Confianza: [ 8 ] [input]      |               | |
| |  | Facilidad: [ 6 ] [input]      |               | |
| |  | ICE: 7.0                      |               | |
| |  | [Calcular ICE con IA]         |               | |
| |  +-------------------------------+               | |
| ---------------------------------------------------  |
|                                                      |
+------------------------------------------------------+
```

---

## 2. Modal Nueva Tarea

```
+-------------------------------+
| Nueva Tarea                   |
+-------------------------------+
| Nombre: [___________]         |
| Descripción:                  |
| [___________________________] |
| (máx 200 palabras)            |
|                               |
| [Cancelar]   [Guardar]        |
+-------------------------------+
```

---

## 3. PriorityModal (al calcular ICE con IA)

```
+---------------------------------------------+
| Sugerencia de valores ICE (IA)              |
+---------------------------------------------+
| Impacto sugerido:    [ 8 ]                  |
| Confianza sugerida:  [ 7 ]                  |
| Facilidad sugerida:  [ 6 ]                  |
| ICE total:           7.0                    |
|                                             |
| [Aceptar valores]   [Editar manualmente]    |
+---------------------------------------------+
```

---

## 4. Jerarquía visual de componentes

```
App
 ├─ Navbar (AppBar)
 ├─ [Botón Nueva Tarea]
 ├─ TaskList
 │    ├─ TaskCard
 │    │    └─ [Botón Calcular ICE con IA]
 │    │    └─ [Botón Editar]
 │    │    └─ Campos ICE (inputs)
 │    └─ ...
 └─ PriorityModal (Dialog)
 └─ NuevaTareaModal (Dialog)
```

---

**Notas de UX:**
- Todo el diseño usa Material UI: AppBar, Card, Dialog, Button, TextField, Stack/List.
- El flujo es lineal y simple, sin menús complejos.
- El usuario siempre ve la lista de tareas y puede crear, editar o calcular ICE fácilmente.
- Los modales se usan para no perder el contexto de la pantalla principal.
