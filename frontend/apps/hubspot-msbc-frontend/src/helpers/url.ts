export const getUrl = (which: string) =>
  `${import.meta.env.VITE_BASE_URL}/${import.meta.env[which]}`;
