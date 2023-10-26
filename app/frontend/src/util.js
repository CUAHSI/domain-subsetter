/** Transforms the values in a dictionary into strings, and filters out falsey entries and array entries
 * Array values need to be stringified with `stringifyArrayParamValues`
 * @returns the resulting object after filter and transformation
 */
function _stringifyPrimitiveParamValues(params){
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key, value]) => !Array.isArray(value) && !!value)
      .map(([key, value]) => {
        return [key, String(value)];
      })
  );
}

/** Filters array items from a param object and returns a concatenation of query strings
 * i.e: `{ foo: ['bar', 'baz'] }` => `'&foo=bar&foo=baz'`
 * @returns a concatenation of array query strings
 */
function _stringifyArrayParamValues(params){
  return Object.entries(params)
    .filter(([key, value]) => Array.isArray(value) && value.length > 0)
    .map(([key, value]) => {
      return value.map((v) => `&${key}=${encodeURIComponent(v)}`).join("");
    })
    .join("");
}

export function getQueryString(params){
  const primitiveParams = _stringifyPrimitiveParamValues(params);
  const arrayParams = _stringifyArrayParamValues(params);
  return `${new URLSearchParams(primitiveParams)}${arrayParams}`;
}

export function formatDate(date){
  return new Date(date).toLocaleDateString("en-us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
