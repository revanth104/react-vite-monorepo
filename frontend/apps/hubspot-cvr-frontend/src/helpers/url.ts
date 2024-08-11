export const getUrl = (which: string) => {
  return `${import.meta.env.VITE_BASE_URL}/${import.meta.env[which]}`;
};

export const getStripeUrl = (which: string) => {
  return `${import.meta.env.VITE_STRIPE_BASE_URL}/${process.env[which]}`;
};

export const getCmsUrl = (which: string) =>
  `${import.meta.env.VITE_CMS_BASE_URL}/${process.env[which]}`;
