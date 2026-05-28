<![CDATA[<div align="center">

# 🤖 Claude Code Usage Widget

### El widget que te dice cuánto Claude te queda antes de que se acabe la fiesta.

[![Platform](https://img.shields.io/badge/platform-Windows-blue?style=flat-square&logo=windows)](https://github.com/BrSilvinha/claude-widget)
[![Electron](https://img.shields.io/badge/built%20with-Electron-47848F?style=flat-square&logo=electron)](https://www.electronjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square&logo=nodedotjs)](https://nodejs.org)

</div>

---

¿Estás en medio de una sesión épica de Claude Code y de repente... **límite alcanzado**?  
Este widget flota discretamente en tu pantalla y te muestra en tiempo real cuánto le queda a tu sesión, a la semana, y cuántos tokens has quemado hoy. Nunca más te agarrará desprevenido.

---

## ✨ ¿Qué hace?

| Métrica | Descripción |
|---|---|
| 🟢 **Límite de sesión** | Qué tan llena está tu ventana de 5 horas (%) |
| 🔵 **Límite semanal** | Tu consumo en los últimos 7 días (%) |
| ⚡ **Tokens de hoy** | Todos los tokens que has consumido hoy |
| 📅 **Tokens del mes** | Acumulado del mes en curso |

Más detalles:

- Tarjeta flotante con efecto **glassmorphism** — se ve elegante sobre cualquier fondo
- **Siempre encima** de todas las ventanas, sin molestar
- Vive en la **bandeja del sistema** — un clic para mostrar u ocultar
- Se **actualiza sola** cada 30 segundos
- Colores que cambian según el riesgo: 🟢 tranquilo → 🟡 cuidado → 🔴 pánico

---

## 📋 Requisitos

- **Windows 10 / 11**
- [Node.js](https://nodejs.org) v18 o superior
- [Claude Code CLI](https://claude.ai/code) instalado y con sesión activa

> El widget lee directamente los archivos que genera Claude Code en tu máquina. Sin cuentas extra, sin APIs keys propias.

---

## 🚀 Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/BrSilvinha/claude-widget.git

# 2. Entra al directorio
cd claude-widget

# 3. Instala las dependencias
npm install

# 4. ¡Lánzalo!
npm start
```

El widget aparecerá en la **esquina inferior derecha** de tu pantalla. Ya está.

### 💡 Iniciar sin ventana de consola (recomendado)

Para que no aparezca ninguna ventana negra al abrir, haz **doble clic en `launch.vbs`**.  
Puedes crear un acceso directo a ese archivo y ponerlo en el escritorio o en el inicio de Windows.

---

## 🔍 ¿Cómo funciona por dentro?

El widget obtiene los datos desde dos fuentes locales:

```
~/.claude/projects/**/*.jsonl   →  Logs de Claude Code (tokens consumidos)
~/.claude/.credentials.json     →  Token OAuth de tu sesión activa
```

- Los **tokens** se calculan 100% localmente, leyendo los logs que ya genera Claude Code. Sin red, sin demora.
- Los **límites de sesión y semanal** se consultan a `claude.ai/api/oauth/usage` usando tu token de sesión ya existente. Igual que lo haría la propia app de Claude Code.
- **Nada sale de tu máquina** salvo esa única llamada autenticada a Claude.

---

## 🗂️ Estructura del proyecto

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

## 🛠️ Personalización

¿Quieres cambiar el intervalo de actualización? Abre `main.js` y modifica esta línea:

```js
statsInterval = setInterval(pushData, 30_000); // ms → 30 segundos por defecto
```

¿Quieres moverlo de esquina? Cambia las coordenadas en `main.js`:

```js
x: width - W - 12,   // distancia desde el borde derecho
y: height - H - 12,  // distancia desde el borde inferior
```

---

## ❓ Preguntas frecuentes

**¿Necesito una API key de Anthropic?**  
No. El widget usa la sesión que ya tiene abierta Claude Code en tu máquina.

**¿Las barras de límite no cargan?**  
Asegúrate de que Claude Code esté instalado y hayas iniciado sesión al menos una vez. El archivo `~/.claude/.credentials.json` tiene que existir.

**¿Funciona en Mac o Linux?**  
Técnicamente Electron es multiplataforma, pero el widget está pensado y probado para Windows. Pull requests bienvenidos 👀

**¿Consume muchos recursos?**  
Prácticamente nada. Electron base + un fetch cada 30 segundos.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Si tienes una idea, abre un issue primero para discutirla.

```bash
# Fork → rama → cambios → PR
git checkout -b feature/mi-mejora
```

---

## 📄 Licencia

MIT — úsalo, modifícalo, compártelo. Solo no digas que lo hiciste tú 😄

---

<div align="center">

*Porque la mejor forma de usar Claude al máximo es saber exactamente cuánto te queda.*

</div>
]]>