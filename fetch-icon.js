// Corre desde el main process de Electron para descargar el icono real de Claude
const { net } = require('electron');
const fs = require('fs');
const path = require('path');

const ICON_PATH = path.join(__dirname, 'claude-icon.png');

const URLS = [
  'https://claude.ai/apple-touch-icon.png',
  'https://claude.ai/favicon.ico',
  'https://claude.ai/favicon.png',
];

function fetchBinary(url) {
  return new Promise((resolve, reject) => {
    const req = net.request({ method: 'GET', url });
    const chunks = [];
    req.on('response', (res) => {
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function downloadIcon() {
  if (fs.existsSync(ICON_PATH)) return ICON_PATH;

  for (const url of URLS) {
    try {
      const res = await fetchBinary(url);
      if (res.status === 200 && res.buffer.length > 100) {
        fs.writeFileSync(ICON_PATH, res.buffer);
        console.log(`Icon saved from ${url}`);
        return ICON_PATH;
      }
    } catch (_) {}
  }
  return null;
}

module.exports = { downloadIcon, ICON_PATH };
