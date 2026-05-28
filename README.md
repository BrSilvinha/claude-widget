# Claude Code Usage Widget

Widget de escritorio flotante para Windows que muestra tu uso de **Claude Code** en tiempo real — tokens consumidos y porcentaje de límites de sesión y semanales, directamente en tu pantalla mientras trabajas.

## Características

- **Límite de sesión** — ventana de uso de 5 horas actual (%)
- **Límite semanal** — ventana de uso de 7 días (%)
- **Contador de tokens** — tokens consumidos hoy y este mes
- Tarjeta flotante transparente con efecto glassmorphism, siempre encima
- Vive en la bandeja del sistema (mostrar/ocultar con un clic)
- Se actualiza automáticamente cada 30 segundos
- Animación suave de entrada (slide-up)

## Requisitos

- **Windows 10/11**
- [Node.js](https://nodejs.org) v18 o superior
- [Claude Code CLI](https://claude.ai/code) instalado y con sesión activa
  - El widget lee `~/.claude/.credentials.json` y `~/.claude/projects/**/*.jsonl`

## Instalación

```bash
git clone https://github.com/BrSilvinha/claude-widget.git
cd claude-widget
npm install
npm start
```

El widget aparecerá en la esquina inferior derecha de tu pantalla principal. También se añadirá un ícono a la bandeja del sistema.

### Ejecutar sin ventana de consola (recomendado)

Haz doble clic en `launch.vbs` para iniciar el widget sin que aparezca una ventana de terminal.

## Cómo funciona

| Fuente | Datos |
|---|---|
| `~/.claude/projects/**/*.jsonl` | Conteo de tokens (hoy / mes) |
| `https://claude.ai/api/oauth/usage` | Porcentaje de límites de sesión y semanal |

- Los **tokens** se calculan localmente leyendo los logs de Claude Code — no requiere red.
- Los **límites** se obtienen de la API de Claude usando el token OAuth que guarda Claude Code en `~/.claude/.credentials.json`. Las credenciales nunca se almacenan ni transmiten a ningún otro lugar.

## Estructura del proyecto

```
claude-widget/
├── main.js          # Proceso principal de Electron — ventana y bandeja
├── preload.js       # Puente IPC seguro (contextBridge)
├── index.html       # UI del widget (HTML/CSS/JS vanilla)
├── usage.js         # Lee los .jsonl y acumula conteos de tokens
├── limits.js        # Obtiene los límites en vivo desde la API de Claude
├── fetch-icon.js    # Descarga el ícono de Claude para la bandeja al primer inicio
└── launch.vbs       # Lanzador sin ventana de consola para Windows
```

## Menú de la bandeja

Clic derecho en el ícono de la bandeja para:
- **Mostrar / Ocultar** el widget
- **Salir** de la app

## Notas

- El widget usa la sesión OAuth existente de Claude Code — no requiere API key propia.
- El conteo de tokens incluye `input_tokens`, `cache_creation_input_tokens` y `cache_read_input_tokens`.
- Si `~/.claude/.credentials.json` no existe, las barras de límite aparecerán vacías (el conteo de tokens sigue funcionando).

## Licencia

MIT
