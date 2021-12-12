/*
Returns object parsed into key=value pairs, supports nested objects
 */
export const v = obj =>
  Object.keys(obj ? obj : {})
    .map(m =>
      typeof obj[m] === 'object' ? m + `=(${v(obj[m])})` : m + '=' + obj[m],
    )
    .join(', ') || '';

/* Wrapper on JSON.stringify */
export const j = (o: any) => JSON.stringify(o);
