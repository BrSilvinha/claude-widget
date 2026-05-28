<div align="center">

# Claude Code Usage Widget

### El widget que te dice cuánto Claude te queda antes de que se acabe la fiesta.

<br>

[![Platform](https://img.shields.io/badge/Windows%2010%2F11-0078D4?style=for-the-badge&logo=windows11&logoColor=white)](https://github.com/BrSilvinha/claude-widget)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Node](https://img.shields.io/badge/Node.js%20%3E%3D18-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/MIT-green?style=for-the-badge)](./LICENSE)

</div>

---

¿Estás en medio de una sesión épica de Claude Code y de repente... **límite alcanzado**?
Este widget flota discretamente en tu pantalla y te muestra en tiempo real cuánto le queda a tu sesión, a la semana, y cuántos tokens has quemado hoy. Nunca más te agarrará desprevenido.

---

## Características

| Métrica | Descripción |
|---|---|
| <img src="https://img.shields.io/badge/Sesión-5h-4ade80?style=flat-square" /> | Porcentaje de tu ventana de 5 horas actual |
| <img src="https://img.shields.io/badge/Semanal-7d-60a5fa?style=flat-square" /> | Tu consumo en los últimos 7 días |
| <img src="https://img.shields.io/badge/Hoy-tokens-facc15?style=flat-square" /> | Tokens consumidos en el día |
| <img src="https://img.shields.io/badge/Mes-tokens-a78bfa?style=flat-square" /> | Acumulado del mes en curso |

- Tarjeta flotante con efecto **glassmorphism** — se ve elegante sobre cualquier fondo
- **Siempre encima** de todas las ventanas, sin molestar
- Vive en la **bandeja del sistema** — un clic para mostrar u ocultar
- Se **actualiza sola** cada 30 segundos
- Barra de color que cambia según el riesgo: verde → amarillo → rojo

---

## Requisitos

<img src="https://img.shields.io/badge/Windows-10%2F11-0078D4?style=flat-square&logo=windows11" />
<img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=nodedotjs" />
<img src="https://img.shields.io/badge/Claude%20Code-CLI-CC785C?style=flat-square" />

> El widget lee directamente los archivos que genera Claude Code en tu máquina. Sin cuentas extra, sin API keys propias.

---

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/BrSilvinha/claude-widget.git

# 2. Entra al directorio
cd claude-widget

# 3. Instala las dependencias
npm install

# 4. Lánzalo
npm start
```

El widget aparecerá en la **esquina inferior derecha** de tu pantalla.

### Iniciar sin ventana de consola (recomendado)

Haz **doble clic en `launch.vbs`** para que no aparezca ninguna ventana negra de terminal.
Puedes crear un acceso directo a ese archivo y colocarlo en el escritorio o en el inicio de Windows.

---

## Cómo funciona

El widget obtiene los datos desde dos fuentes en tu propia máquina:

```
~/.claude/projects/**/*.jsonl   →  Logs de Claude Code (tokens consumidos)
~/.claude/.credentials.json     →  Token OAuth de tu sesión activa
```

- Los **tokens** se calculan 100% localmente — sin red, sin demora.
- Los **límites** se consultan a `claude.ai/api/oauth/usage` usando tu token de sesión existente, igual que lo haría la propia app de Claude Code.
- **Nada sale de tu máquina** salvo esa única llamada autenticada a Claude.

---

## Estructura del proyecto

```
claude-widget/
├── main.js          ← Proceso principal: ventana, bandeja, IPC
├── preload.js       ← Puente seguro entre main y renderer
├── index.html       ← Toda la UI (HTML + CSS + JS vanilla)
├── usage.js         ← Parsea los .jsonl y suma tokens
├── limits.js        ← Consulta los límites a la API de Claude
├── fetch-icon.js    ← Descarga el ícono de Claude para la bandeja
├── launch.vbs       ← Lanzador sin consola para Windows
└── package.json
```

---

## Personalización

**Cambiar el intervalo de actualización** — abre `main.js`:

```js
statsInterval = setInterval(pushData, 30_000); // 30 000 ms = 30 segundos
```

**Cambiar la posición del widget** — abre `main.js`:

```js
x: width - W - 12,   // distancia desde el borde derecho
y: height - H - 12,  // distancia desde el borde inferior
```

---

## Preguntas frecuentes

**¿Necesito una API key de Anthropic?**
No. El widget usa la sesión que ya tiene abierta Claude Code en tu máquina.

**¿Las barras de límite aparecen vacías?**
Asegúrate de que Claude Code esté instalado y hayas iniciado sesión al menos una vez. El archivo `~/.claude/.credentials.json` debe existir.

**¿Funciona en Mac o Linux?**
Técnicamente Electron es multiplataforma, pero el widget está pensado y probado para Windows. Pull requests bienvenidos.

**¿Consume muchos recursos?**
Prácticamente nada. Electron base + un fetch cada 30 segundos.

---

## Contribuir

Las contribuciones son bienvenidas. Si tienes una idea, abre un issue primero para discutirla.

```bash
# Fork → rama → cambios → PR
git checkout -b feature/mi-mejora
```

---

## Licencia

MIT — úsalo, modifícalo, compártelo. Solo no digas que lo hiciste tú.

---

<div align="center">

*Porque la mejor forma de usar Claude al máximo*
*es saber exactamente cuánto te queda.*

</div>
