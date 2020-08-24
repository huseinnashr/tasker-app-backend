import { promises as fs, Stats } from 'fs';
import * as path from 'path';
import env from 'ts-get-env';

export class FileHelper {
  DEFAULT_PP = ['pp1.jpg', 'pp2.jpg', 'pp3.jpg'];
  GIT_IGNORE = ['.gitignore'];

  constructor() {
    if (env.get('string', 'NODE_ENV', 'development') === 'production') {
      throw new Error("CAN'T USE FILE HELPER IN PRODUCTION MODE");
    }
  }

  async emptyFolder(folderDir: string, except?: string[]): Promise<void> {
    const dirents = await fs.readdir(folderDir, { withFileTypes: true });
    const files = dirents.filter(d => d.isFile()).map(d => d.name);
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
