import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const envFile = join(dirname(fileURLToPath(import.meta.url)), ".env.e2e.local");

// Gitignored and absent in CI, where env vars come from the runner instead — Node's
// loadEnvFile throws ENOENT if the file doesn't exist, so only load it when present.
if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}
