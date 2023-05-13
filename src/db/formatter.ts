import { format as formatter } from 'sql-formatter';

function paramsParser(array: readonly unknown[]) {
  return array.reduce((acc: Record<number, string>, curr, idx) => {
    acc[idx + 1] = typeof curr === 'string' ? `'${curr}'` : `${curr}`;
    return acc;
  }, {}) as Record<number, string>;
}

export default function format(sql: string, params: readonly unknown[]) {
  return formatter(sql, { params: paramsParser(params), keywordCase: 'upper', language: 'postgresql' });
}
