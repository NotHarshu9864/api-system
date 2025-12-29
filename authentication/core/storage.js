import { openDB } from "https://unpkg.com/idb?module";

const DB_NAME = "FaceAuthDB";
const STORE_NAME = "credentials";

export async function saveEmbedding(embedding) {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    }
  });

  await db.put(STORE_NAME, embedding, "face");
}

export async function loadEmbedding() {
  const db = await openDB(DB_NAME, 1);
  return await db.get(STORE_NAME, "face");
}