export const defaultNameCheck = (t, is_default, path, name) =>
  Number(is_default) ? t(`${path}${name}`) : name
