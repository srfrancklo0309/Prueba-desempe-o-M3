# Guía para Eventos CRUD

## Descripción

Esta es una prueba de desempeño enfocada en Javascript Vanilla, sin embargo hace uso de tecnologías como HTML5 y CSS, también frameworks de css (Bootstrap) y una dependencia (JSON-SERVER), esta dependencia hace las de base de datos como una API REST en un entorno simulado. Esta prueba es acerca de una página con registro e inicio de sesión, además de tener 2 tipos de roles, según sea el rol tiene o no funcionalidades o permisos (creación, eliminación y edición de elementos por parte del admin, inscripción por parte del usuario).

---

## Funcionalidades principales

### 1. Autenticación y roles
- **Login y registro**: Formulario de acceso y creación de cuenta.
- **Roles:**
  - **Administrador**: Puede crear, editar y eliminar eventos, y ver inscritos.
  - **Visitante**: Puede ver eventos, inscribirse/desinscribirse y ver sus inscripciones.
- **Gestión de sesión**: Se usa `sessionStorage` y `localStorage` para mantener la sesión activa.

### 2. Gestión de eventos
- **CRUD de eventos**: Crear, editar y eliminar eventos (solo admin).
- **Validaciones:**
  - El cupo debe ser mayor a 0.
  - La fecha no puede ser anterior a hoy.
  - La imagen puede ser subida mediante una URL.
- **Listado de eventos**: Cajas visuales con información y acciones según el rol.

### 3. Inscripciones
- **Visitante**: Puede inscribirse o cancelar su inscripción en eventos.

### 4. SPA y enrutamiento
- **Navegación sin recarga**: Uso de hash routing (`#login`, `#events`, `#enrollments`, `#welcome`) para cambiar de vista sin recargar la página.
- **Historial**: Soporte para navegación adelante/atrás del navegador.
- **Rutas protegidas**: Solo usuarios registrados o que iniciaron sesión pueden acceder a ciertas vistas.

### 5. Diseño y estructura
- **Bootstrap**: Para un diseño moderno y responsivo.
- **Sidebar**: Navegación clara y diferenciada por rol.
- **Estructura modular**: Código dividido en módulos para facilidad de legibilidad y aplicación.

---

## Estructura del proyecto

```
node_modules/
  (dependencia de JSON Server)
public/
  index.html
src/
  main.js
  auth.js
  events.js
  enrollments.js
  layout.js
  routes.js
  views.js
  api.js
  images/
    avatar.svg
db.json (para JSON Server)
styles.css (para estilos adicionales del bootstrap)
package-lock.json
package.json
README.md
```

---

## Uso de JSON Server

- **JSON Server** simula una API REST para almacenar usuarios, eventos e inscripciones.
- **Endpoints principales:**
  - `/users`
  - `/events`
  - `/enrollments`
- **Cómo iniciar JSON Server:**
  1. Instala JSON Server:  
     ```bash
     npm install -g json-server
     ```
  2. Inicia el servidor:  
     ```bash
     json-server --watch db.json --port 3000
     ```
  3. La SPA hará peticiones HTTP a esta API para todas las operaciones CRUD.

---

## Cómo ejecutar el proyecto

*(Debe tener instalado node en el dispositivo, si no lo tiene instalado seguir el siguiente tutorial: https://kinsta.com/es/blog/como-instalar-node-js/)*

1. **Clona el repositorio y entra a la carpeta:**
   ```bash
   git clone https://github.com/srfrancklo0309/Prueba-desempe-o-M3.git
   cd <carpeta-del-proyecto>
   ```

2. **Instala y ejecuta JSON Server:**
   ```bash
   npm install -g json-server
   json-server --watch db.json --port 3000
   ```

3. **Abre el archivo `public/index.html` en tu navegador**  

---

## Desarrollador

- **Nombre:** ***Emmanuel Pérez Martínez***
- **Clan:** ***Ritchie***
- **Correo:** ***emmanuelperezm123@gmail.com***
- **D.I.:** ***1033490277***  

## Link para la colección de POSTMAN

https://srfrancklo0309.postman.co/workspace/Srfrancklo0309's-Workspace~8d310b45-6c26-489f-8634-6983f52ccaa9/collection/46756324-e6df98c4-98f9-4980-a4c1-ec221abcb2b9?action=share&creator=46756324


## Link del repositorio en Github

https://github.com/srfrancklo0309/Prueba-desempe-o-M3.git