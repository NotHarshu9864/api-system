export function detectBlink(landmarks) {
  const leftEye = landmarks.getLeftEye();
  const eyeHeight = Math.abs(leftEye[1].y - leftEye[5].y);
  return eyeHeight < 4; // blink threshold
}