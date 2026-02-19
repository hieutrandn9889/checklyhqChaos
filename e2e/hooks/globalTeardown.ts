import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(config: FullConfig) {
  // Clean up any remaining authentication state
  const storageStatePath = path.join(__dirname, '..', '..', '.auth', 'storageState.json');
  if (fs.existsSync(storageStatePath)) {
    try {
      await fs.promises.unlink(storageStatePath);
      console.log('Cleaned up storage state file');
    } catch (error) {
      console.warn('Could not remove storage state file:', error);
    }
  }
}

export default globalTeardown;
