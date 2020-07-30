import { Connection } from 'typeorm';

export abstract class Seeder {
  private connection: Connection;

  setConnection(c: Connection): void {
    this.connection = c;
  }

  private getConnection(): Connection {
    if (this.connection == null) {
      throw new Error('Please set the connection first.');
    }
    return this.connection;
  }

  async run(): Promise<void> {
    this._run(this.getConnection());
  }

  protected abstract async _run(c: Connection): Promise<void>;
}
