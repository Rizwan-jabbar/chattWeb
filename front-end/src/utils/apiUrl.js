const DEFAULT_API_URL = "https://chattweb-production.up.railway.app/api";

export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
