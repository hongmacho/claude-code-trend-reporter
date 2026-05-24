import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

interface ClaudeSettings {
  enabledPlugins?: Record<string, boolean>;
  mcpServers?: Record<string, unknown>;
}

export function getInstalledSlugs(): Set<string> {
  const slugs = new Set<string>();
  const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');

  try {
    const raw = fs.readFileSync(settingsPath, 'utf-8');
    const settings: ClaudeSettings = JSON.parse(raw);

    for (const key of Object.keys(settings.enabledPlugins ?? {})) {
      slugs.add(key.split('@')[0].toLowerCase());
    }

    for (const key of Object.keys(settings.mcpServers ?? {})) {
      slugs.add(key.toLowerCase());
    }
  } catch {
    // settings.json이 없거나 파싱 실패 시 필터링 없이 진행
  }

  return slugs;
}
