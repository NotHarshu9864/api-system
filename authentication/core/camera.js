export async function startCamera(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" }
  });
  videoEl.srcObject = stream;
  await videoEl.play();
}

export function stopCamera(videoEl) {
  const tracks = videoEl.srcObject?.getTracks();
  tracks?.forEach(t => t.stop());
}