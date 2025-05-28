// lib/db.ts
import Dexie, { Table } from "dexie";

export interface Note {
  id?: number;
  title: string;
  content: string;
  createdAt: Date;
}

export class MyAppDatabase extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super("myAppDatabase");
    this.version(1).stores({
      notes: "++id, title, createdAt", // Indexed fields
    });
  }
}

export const db = new MyAppDatabase();
