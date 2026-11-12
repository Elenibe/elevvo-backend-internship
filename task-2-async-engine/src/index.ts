import { cpus } from "node:os";
import { runEngine, heavyProcessing } from "./engine";

async function main(): Promise<void> {
  console.log("Starting data engine...\n");

  const start = performance.now();
  const result = await runEngine();
  const fetchMs = performance.now() - start;

  console.log(`\n--- Summary (fetched in ${fetchMs.toFixed(0)} ms) ---`);
  console.log(`Users: ${result.users.length}`);
  console.log(`Posts: ${result.posts.length}`);
  console.log(`Todos: ${result.todos.length}`);
  console.log(`Failed sources: ${result.failures.length}`);
  for (const failure of result.failures) {
    console.log(`  - ${failure.source}: ${failure.reason}`);
  }
  console.log("\nSample user:", result.users[0]);

  const pool = process.env.UV_THREADPOOL_SIZE ?? "not set (default 4)";
  console.log(`\n--- Heavy processing (UV_THREADPOOL_SIZE: ${pool}, CPU cores: ${cpus().length}) ---`);
  const heavyMs = await heavyProcessing(16);
  console.log(`16 PBKDF2 jobs finished in ${heavyMs.toFixed(0)} ms`);
}

main().catch((error: unknown) => {
  console.error("Fatal error:", error);
  process.exit(1);
});