import { getFaceEmbedding } from "./faceEngine.js";
import { saveEmbedding, loadEmbedding } from "./storage.js";
import { CONFIG } from "./config.js";

export async function register(videoEl) {
  const embedding = await getFaceEmbedding(videoEl);
  await saveEmbedding(embedding);
  return true;
}

export async function authenticate(videoEl) {
  const saved = await loadEmbedding();
  if (!saved) throw new Error("No face registered");

  const current = await getFaceEmbedding(videoEl);
  const distance = faceapi.euclideanDistance(saved, current);

  return distance < CONFIG.FACE_DISTANCE_THRESHOLD;
}