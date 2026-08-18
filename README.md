# Xolitas F.C.

Sitio público y panel interno estático para la gestión deportiva de Xolitas F.C.

## Publicación en GitHub Pages

Es un sitio estático puro: HTML, CSS, JavaScript vanilla e imágenes. No necesita Node, npm, Vite, compilación ni un servidor propio.

1. Suba el contenido a la rama `main` del repositorio `Xolitas`.
2. En GitHub abra **Settings → Pages**.
3. En **Build and deployment**, seleccione **Deploy from a branch**.
4. Seleccione `main`, carpeta `/ (root)`, y guarde.

La página pública quedará en:

`https://gloriadzulvillegas06.github.io/Xolitas/`

El panel quedará en:

`https://gloriadzulvillegas06.github.io/Xolitas/admin/login.html`

Para probar antes de publicar puede utilizar la extensión **Live Server**. Los módulos ES6 del panel necesitan una dirección `http://` o `https://`; el sitio publicado en GitHub Pages los sirve correctamente.

## Panel de demostración

Abra `admin/login.html`. Usuarios disponibles:

- `admin`: gestión completa.
- `captura`: acceso al modo partido.
- `consulta`: vistas de consulta.

En esta fase cualquier contraseña no vacía permite entrar. No hay contraseñas reales almacenadas.

## Datos y futura API

Los datos mock se guardan en `localStorage`. La configuración está en `assets/js/config.js`. Cuando exista el endpoint de Google Apps Script, establezca `API_URL` y cambie `USE_MOCK_DATA` a `false`; no se incluye todavía ningún Apps Script.
