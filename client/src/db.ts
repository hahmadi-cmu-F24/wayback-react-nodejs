// src/db.ts
import Dexie from "dexie";
import type { Table } from "dexie";  // <-- type-only import
import type { Site, Asset } from "./types";

export class WebArchiveDB extends Dexie {
  sites!: Table<Site, number>;
  assets!: Table<Asset, number>;

  constructor() {
    super("WebArchiveDB");
    this.version(1).stores({
      sites: "++id,url,timestamp",
      assets: "++id,[siteId+type],path,blob"
    });
  }
}

export const db = new WebArchiveDB();
