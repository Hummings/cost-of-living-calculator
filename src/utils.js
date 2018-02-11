export const dasherize = str => {
  return (str || '')
    .trim()
    .replace(/([A-Z])/g, '-$1')
    .replace(/[-_\s]+/g, '-')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/[^-a-z0-9]/g, '')
};


export const combine = (...fns) => (...args) => (
  fns.forEach(fn => fn(...args))
);

export default {
  dasherize: dasherize,
  combine: combine,
  NO_OP: () => {},
};
