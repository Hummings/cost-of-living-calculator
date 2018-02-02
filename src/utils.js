export const dasherize = str => {
  return (str || '')
    .trim()
    .replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/[^-a-z]/g, '')
};

export const callBoth = (fn1, fn2) => {
  return (...args) => {
    fn1(...args);
    fn2(...args);
  };
};

