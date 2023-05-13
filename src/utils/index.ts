// eslint-disable-next-line import/prefer-default-export
export function generatePin(): string {
  const min = 1; // Minimum value for a 6-digit pin
  const max = 999999; // Maximum value for a 6-digit pin
  const pin = Math.floor(Math.random() * (max - min + 1)) + min;
  const paddedPin = pin.toString().padStart(6, '0'); // Pads the pin with leading zeros if necessary
  return paddedPin;
}
