import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const executableName = process.platform === "win32" ? "cargo.exe" : "cargo";
const cargoHome = process.env.CARGO_HOME;
const userHome = process.env.USERPROFILE ?? process.env.HOME;
const candidates = [
  cargoHome && join(cargoHome, "bin", executableName),
  userHome && join(userHome, ".cargo", "bin", executableName),
  executableName,
].filter(Boolean);

const executable =
  candidates.find((candidate) => candidate === executableName || existsSync(candidate)) ??
  executableName;

const result = spawnSync(executable, process.argv.slice(2), {
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  console.error(`Не удалось запустить Cargo: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
