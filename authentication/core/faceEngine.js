import * as faceapi from "face-api.js";

export async function loadModels() {
  const MODEL_URL = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights";

  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
  ]);
}

export async function getFaceEmbedding(videoEl) {
  const detection = await faceapi
    .detectSingleFace(videoEl)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) throw new Error("Face not detected");
  return Array.from(detection.descriptor);
}