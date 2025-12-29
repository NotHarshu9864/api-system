import * as faceapi from "face-api.js";

export async function loadModels() {
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
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