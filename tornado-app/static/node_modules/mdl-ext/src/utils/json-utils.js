'use strict';

/**
 * Converts a JSON string to object
 * @param jsonString
 * @param source
 */
const jsonStringToObject = (jsonString, source = {} ) => {
  const s = jsonString.replace(/'/g, '"');
  try {
    return Object.assign(source, JSON.parse(s));
  }
  catch (e) {
    throw new Error(`Failed to parse json string: ${s}. Error: ${e.message}`);
  }
};

export { jsonStringToObject };
