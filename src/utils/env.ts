export function getRequiredPublicEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPublicEnv(name: keyof ImportMetaEnv, fallback = ''): string {
  return import.meta.env[name] || fallback;
}
