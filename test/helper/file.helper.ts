import { promises as fs, Stats } from 'fs';
import * as path from 'path';
import env from 'ts-get-env';

export class FileHelper {
  constructor() {
    if (env.get('string', 'NODE_ENV', 'development') === 'production') {
      throw new Error("CAN'T USE FILE HELPER IN PRODUCTION MODE");
    }
  }

  async emptyFolder(folderDir: string, except?: string[]): Promise<void> {
    const files = await fs.readdir(folderDir);
    const deletePromise: Promise<void>[] = [];
    for (const file of files) {
      if (except.includes(file)) continue;
      deletePromise.push(fs.unlink(path.join(folderDir, file)));
    }

    await Promise.all(deletePromise);
  }

  async stat(path: string): Promise<Stats> {
    const stats = await fs.stat(path);
    return stats;
  }

  async create(filepath: string): Promise<string> {
    await fs.writeFile(filepath, 'test');
    return filepath;
  }
}
