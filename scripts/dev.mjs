import { spawn, spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const containerName = "piloproject-postgres";
const postgresPort = process.env.PILOPROJECT_POSTGRES_PORT ?? "5435";
const executableName = process.platform === "win32" ? "cargo.exe" : "cargo";
const cargoHome = process.env.CARGO_HOME;
const userHome = process.env.USERPROFILE ?? process.env.HOME;
const cargoCandidates = [
  cargoHome && join(cargoHome, "bin", executableName),
  userHome && join(userHome, ".cargo", "bin", executableName),
  executableName,
].filter(Boolean);
const cargo =
  cargoCandidates.find(
    (candidate) => candidate === executableName || existsSync(candidate),
  ) ?? executableName;
const npmCli = process.env.npm_execpath;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    ...options,
  });

  if (result.error) {
    throw new Error(`Не удалось запустить ${command}: ${result.error.message}`);
  }

  return result;
}

function ensurePostgres() {
  const inspect = run("docker", ["inspect", containerName]);

  if (inspect.status !== 0) {
    const schemaPath = join(rootDir, "backend", "schema.sql");
    console.log(`Создаю PostgreSQL-контейнер ${containerName}...`);
    const create = run(
      "docker",
      [
        "run",
        "-d",
        "--name",
        containerName,
        "--label",
        "com.openai.codex.project=piloproject",
        "-e",
        "POSTGRES_DB=piloproject",
        "-e",
        "POSTGRES_USER=postgres",
        "-e",
        "POSTGRES_PASSWORD=postgres",
        "-p",
        `${postgresPort}:5432`,
        "-v",
        `${schemaPath}:/docker-entrypoint-initdb.d/001-schema.sql:ro`,
        "--health-cmd",
        "pg_isready -U postgres -d piloproject",
        "--health-interval",
        "2s",
        "--health-timeout",
        "5s",
        "--health-retries",
        "15",
        "postgres:17",
      ],
      { stdio: "inherit" },
    );

    if (create.status !== 0) {
      throw new Error("Не удалось создать PostgreSQL-контейнер");
    }
  } else {
    const start = run("docker", ["start", containerName], { stdio: "inherit" });
    if (start.status !== 0) {
      throw new Error("Не удалось запустить PostgreSQL-контейнер");
    }
  }
}

async function waitForPostgres() {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const inspect = run("docker", [
      "inspect",
      "--format",
      "{{.State.Health.Status}}",
      containerName,
    ]);

    if (inspect.status === 0 && inspect.stdout.trim() === "healthy") {
      console.log(`PostgreSQL готов на localhost:${postgresPort}`);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error("PostgreSQL не стал доступен за 60 секунд");
}

function cleanNuxtDevCache() {
  const generatedDirectories = [
    join(rootDir, "frontend", ".nuxt"),
    join(rootDir, "frontend", "node_modules", ".cache", "vite"),
  ];

  console.log("Очищаю генерируемый Nuxt dev-кэш...");
  for (const directory of generatedDirectories) {
    rmSync(directory, { force: true, recursive: true });
  }
}

function stopProcessTree(child) {
  if (!child?.pid || child.exitCode !== null) {
    return;
  }

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
    });
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  }
}

ensurePostgres();
await waitForPostgres();
cleanNuxtDevCache();

const sharedEnvironment = {
  ...process.env,
  DATABASE_URL:
    process.env.DATABASE_URL ??
    `postgres://postgres:postgres@127.0.0.1:${postgresPort}/piloproject`,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "change-me",
  ALLOWED_ORIGINS:
    process.env.ALLOWED_ORIGINS ??
    "http://localhost:3000,http://127.0.0.1:3000",
  NUXT_PUBLIC_API_BASE:
    process.env.NUXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8080",
};

console.log("Запускаю backend на http://127.0.0.1:8080");
const backend = spawn(
  cargo,
  ["run", "--manifest-path", "backend/Cargo.toml", "--locked"],
  {
    cwd: rootDir,
    detached: process.platform !== "win32",
    env: sharedEnvironment,
    stdio: "inherit",
  },
);

if (!npmCli) {
  stopProcessTree(backend);
  throw new Error("npm не передал путь к своему CLI");
}

console.log("Запускаю frontend на http://localhost:3000");
const frontend = spawn(
  process.execPath,
  [
    npmCli,
    "--prefix",
    "frontend",
    "run",
    "dev",
    "--",
    "--host",
    "127.0.0.1",
    "--port",
    "3000",
  ],
  {
    cwd: rootDir,
    detached: process.platform !== "win32",
    env: sharedEnvironment,
    stdio: "inherit",
  },
);

let stopping = false;

function stop(exitCode = 0) {
  if (stopping) {
    return;
  }

  stopping = true;
  stopProcessTree(frontend);
  stopProcessTree(backend);
  process.exit(exitCode);
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

backend.on("error", (error) => {
  console.error(`Не удалось запустить backend: ${error.message}`);
  stop(1);
});
frontend.on("error", (error) => {
  console.error(`Не удалось запустить frontend: ${error.message}`);
  stop(1);
});
backend.on("exit", (code) => {
  if (!stopping) {
    console.error(`Backend остановился с кодом ${code ?? 1}`);
    stop(code ?? 1);
  }
});
frontend.on("exit", (code) => {
  if (!stopping) {
    console.error(`Frontend остановился с кодом ${code ?? 1}`);
    stop(code ?? 1);
  }
});
