export const getUrlInCvr = (which: string) =>
  `${import.meta.env.VITE_BASE_URL}/${import.meta.env[which]}`;

export const getStripeUrl = (which: string) =>
  `${import.meta.env.VITE_STRIPE_BASE_URL}/${import.meta.env[which]}`;
