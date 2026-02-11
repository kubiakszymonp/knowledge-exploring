import path from "path";

/**
 * Resolves the data root directory for pilot model (entities, media, routes).
 * Used only in API routes (server). DATA_ROOT env can be absolute or relative to cwd.
 * Default: project root / data (one level up from frontend when running from frontend).
 */
export function getDataRoot(): string {
  const env = process.env.DATA_ROOT;
  if (env) {
    return path.isAbsolute(env) ? env : path.join(process.cwd(), env);
  }
  return path.join(process.cwd(), "..", "data");
}
