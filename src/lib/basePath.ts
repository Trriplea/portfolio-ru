const baseUrl = import.meta.env.BASE_URL;
const externalPathPattern = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

export const withBasePath = (path: string) => {
  if (externalPathPattern.test(path) || path.startsWith('#')) {
    return path;
  }

  return `${baseUrl}${path.replace(/^\/+/, '')}`;
};

export const getRoutePath = (pathname: string) => {
  const basePath = baseUrl.replace(/\/$/, '');
  const pathWithoutBase =
    basePath &&
    (pathname === basePath || pathname.startsWith(`${basePath}/`))
      ? pathname.slice(basePath.length)
      : pathname;

  return pathWithoutBase.replace(/\/+$/, '') || '/';
};
