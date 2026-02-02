import { cp, rm, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const standaloneRoot = path.join(projectRoot, ".next", "standalone", "client");
const publicSrc = path.join(projectRoot, "public");
const publicDest = path.join(standaloneRoot, "public");
const staticSrc = path.join(projectRoot, ".next", "static");
const staticDest = path.join(standaloneRoot, ".next", "static");

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  await rm(dest, { recursive: true, force: true });
  await mkdir(path.dirname(dest), { recursive: true });
  await cp(src, dest, { recursive: true });
}

(async () => {
  if (!(await exists(standaloneRoot))) {
    console.warn("Standalone output not found. Did you run next build with output: 'standalone'?");
    return;
  }

  if (await exists(publicSrc)) {
    await copyDir(publicSrc, publicDest);
  } else {
    console.warn("Public folder not found, skipping.");
  }

  if (await exists(staticSrc)) {
    await copyDir(staticSrc, staticDest);
  } else {
    console.warn(".next/static not found, skipping.");
  }

  console.log("Standalone assets copied.");
})();
