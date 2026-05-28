const fs = require('fs');
const path = require('path');
const os = require('os');

const CLAUDE_DIR = path.join(os.homedir(), '.claude', 'projects');

function parseJsonlFile(filePath, todayStart, monthStart, stats) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(Boolean);

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        if (entry.type !== 'assistant' || !entry.message?.usage || !entry.timestamp) continue;

        const ts = new Date(entry.timestamp);
        const usage = entry.message.usage;
        const input = (usage.input_tokens || 0);
        const output = (usage.output_tokens || 0);
        const cacheCreate = (usage.cache_creation_input_tokens || 0);
        const cacheRead = (usage.cache_read_input_tokens || 0);
        const totalIn = input + cacheCreate + cacheRead;

        stats.allTime.input += totalIn;
        stats.allTime.output += output;

        if (ts >= monthStart) {
          stats.month.input += totalIn;
          stats.month.output += output;
        }

        if (ts >= todayStart) {
          stats.today.input += totalIn;
          stats.today.output += output;
        }
      } catch (_) {}
    }
  } catch (_) {}
}

function walkDir(dir, callback) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath, callback);
      } else if (entry.name.endsWith('.jsonl')) {
        callback(fullPath);
      }
    }
  } catch (_) {}
}

function getUsageStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    today: { input: 0, output: 0 },
    month: { input: 0, output: 0 },
    allTime: { input: 0, output: 0 },
  };

  walkDir(CLAUDE_DIR, (filePath) => {
    parseJsonlFile(filePath, todayStart, monthStart, stats);
  });

  return {
    today: stats.today.input + stats.today.output,
    todayInput: stats.today.input,
    todayOutput: stats.today.output,
    month: stats.month.input + stats.month.output,
    monthInput: stats.month.input,
    monthOutput: stats.month.output,
    allTime: stats.allTime.input + stats.allTime.output,
    updatedAt: now.toISOString(),
  };
}

module.exports = { getUsageStats };
