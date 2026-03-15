import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sqlite3 from 'sqlite3';

export interface RunResult {
  changes: number;
  lastID: number;
}

export class SqliteDatabase {
  private readonly db: sqlite3.Database;

  private constructor(db: sqlite3.Database) {
    this.db = db;
  }

  static async open(dbFilePath = path.resolve(process.cwd(), 'database', 'properties.db')): Promise<SqliteDatabase> {
    await mkdir(path.dirname(dbFilePath), { recursive: true });

    return await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbFilePath, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(new SqliteDatabase(db));
      });
    });
  }

  async exec(sql: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.exec(sql, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  async run(sql: string, params: unknown[] = []): Promise<RunResult> {
    return await new Promise((resolve, reject) => {
      this.db.run(sql, params, function onRun(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          changes: this.changes,
          lastID: this.lastID
        });
      });
    });
  }

  async get<T>(sql: string, params: unknown[] = []): Promise<T | undefined> {
    return await new Promise((resolve, reject) => {
      this.db.get(sql, params, (error, row) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(row as T | undefined);
      });
    });
  }

  async all<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return await new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) {
          reject(error);
          return;
        }

        resolve((rows ?? []) as T[]);
      });
    });
  }

  async close(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.db.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}
