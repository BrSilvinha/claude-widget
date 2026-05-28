const { net } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

function readCredentials() {
  const credsPath = path.join(os.homedir(), '.claude', '.credentials.json');
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  return {
    token: creds.claudeAiOauth.accessToken,
    orgId: creds.organizationUuid,
  };
}

function fetchWithElectronNet(url, headers) {
  return new Promise((resolve, reject) => {
    const req = net.request({ method: 'GET', url });
    for (const [k, v] of Object.entries(headers)) req.setHeader(k, v);

    let body = '';
    req.on('response', (res) => {
      res.on('data', (chunk) => { body += chunk.toString(); });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

function formatTimeUntil(isoDate) {
  const diff = new Date(isoDate) - Date.now();
  if (diff <= 0) return 'pronto';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatResetDay(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString('es-PE', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
}

async function getLimits() {
  const { token } = readCredentials();

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'anthropic-client-platform': 'cli',
    'anthropic-version': '2023-06-01',
  };

  const res = await fetchWithElectronNet('https://claude.ai/api/oauth/usage', headers);
  if (res.status !== 200) return null;

  const data = JSON.parse(res.body);

  const session = data.five_hour;
  const weekly = data.seven_day;

  return {
    session: session ? {
      pct: Math.round(session.utilization),
      resetsIn: formatTimeUntil(session.resets_at),
      resetsAt: session.resets_at,
    } : null,
    weekly: weekly ? {
      pct: Math.round(weekly.utilization),
      resetsAt: formatResetDay(weekly.resets_at),
    } : null,
    extra: data.extra_usage ?? null,
  };
}

module.exports = { getLimits };
