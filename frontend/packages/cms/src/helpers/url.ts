export const getCmsUrl = (which: string) =>
  `${import.meta.env.VITE_CMS_BASE_URL}/${import.meta.env[which]}`;
