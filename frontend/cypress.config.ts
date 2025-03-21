import { defineConfig } from "cypress";
import { startServer } from "./server";
const treeKill = require('tree-kill');
let procesos = { front: null, back: null };
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
       on("before:run", async (details) => {
        procesos = await startServer();
        await delay(10000);
      });
      on("after:run", async (details) => {
        await killProcess(procesos.front.pid);
        await killProcess(procesos.back.pid);
      });
    },
  },
});

function killProcess(pid) {
  return new Promise((resolve, reject) => {
      treeKill(pid, 'SIGTERM', (err) => {
          if (err) {
              reject(err);
          } else {
              resolve(null);
          }
      });
  });
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
