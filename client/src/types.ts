// src/types.ts (optional, you can put it in db.ts too)
export interface Site {
  id?: number;       // primary key, auto-incremented
  url: string;
  timestamp: string;
}

export interface Asset {
  id?: number;
  siteId: number;
  type: "html" | "image" | "script" | "style";
  path: string;
  blob: Blob;
}
