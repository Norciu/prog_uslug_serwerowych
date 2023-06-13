import _ from 'lodash';

export function generatePin(length = 6): string {
  const min = 1;
  const max = Number('9'.padStart(length, '9'));
  const pin = Math.floor(Math.random() * (max - min + 1)) + min;
  return pin.toString().padStart(length, '0');
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
