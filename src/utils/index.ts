import _ from 'lodash';

export function generatePin(): string {
  const min = 1; // Minimum value for a 6-digit pin
  const max = 999999; // Maximum value for a 6-digit pin
  const pin = Math.floor(Math.random() * (max - min + 1)) + min;
  return pin.toString().padStart(6, '0'); // Pads the pin with leading zeros if necessary
}

export function Transform(obj: Record<string, unknown>) {
  return {
    toCamelCase() {
      return _.mapKeys(obj, (v, k) => _.camelCase(k));
    },
    toSnakeCase() {
      return _.mapKeys(obj, (v, k) => _.snakeCase(k));
    },
  };
}
