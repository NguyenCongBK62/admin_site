import _ from "lodash";

export function injectError(errors, errorsObject) {
  const result = { ...errorsObject };
  _.forIn(errors, (value, key) => {
    if (!_.has(errorsObject, key)) {
      result[key] = value;
    }
  });
  return result;
}
