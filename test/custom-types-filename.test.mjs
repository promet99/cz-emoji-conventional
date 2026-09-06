import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function exampleCustomTypesFile() {
  const files = fs
    .readdirSync(repoRoot)
    .filter((name) => name.endsWith(".example.cjs"));
  assert.equal(
    files.length,
    1,
    `expected one *.example.cjs at repo root, found: ${files.join(", ") || "(none)"}`
  );
  return files[0];
}

function loaderCustomTypesBasename() {
  const src = fs.readFileSync(path.join(repoRoot, "src", "index.ts"), "utf8");
  const assignment = src.match(
    /customTypesPath\s*=\s*path\.(?:resolve|join)\(([\s\S]*?)\);/
  );
  assert.ok(
    assignment,
    "expected customTypesPath = path.resolve/join(...) in src/index.ts"
  );
  const cjsLiterals = [...assignment[1].matchAll(/["']([^"']+\.cjs)["']/g)].map(
    (match) => path.basename(match[1])
  );
  assert.equal(
    cjsLiterals.length,
    1,
    "expected one .cjs filename in the custom types loader path"
  );
  return cjsLiterals[0];
}

test("example filename (minus .example) matches the filename the adapter loads", () => {
  const exampleName = exampleCustomTypesFile();
  const documentedName = exampleName.replace(".example", "");
  const loadedName = loaderCustomTypesBasename();
  assert.equal(
    documentedName,
    loadedName,
    `copying ${exampleName} as ${documentedName} would not satisfy the loader looking for ${loadedName}`
  );
});

test("copying the example (dropping .example) is found from the installed adapter path", () => {
  const exampleName = exampleCustomTypesFile();
  const documentedName = exampleName.replace(".example", "");
  const loadedName = loaderCustomTypesBasename();

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "cz-emoji-conventional-"));
  try {
    const adapterBuildDir = path.join(
      tmp,
      "node_modules",
      "cz-emoji-conventional",
      "build"
    );
    fs.mkdirSync(adapterBuildDir, { recursive: true });
    fs.copyFileSync(
      path.join(repoRoot, exampleName),
      path.join(tmp, documentedName)
    );

    // Installed layout: <project>/node_modules/cz-emoji-conventional/build/index.js
    const loadedPath = path.resolve(
      adapterBuildDir,
      "..",
      "..",
      "..",
      loadedName
    );
    assert.equal(
      fs.existsSync(loadedPath),
      true,
      `expected ${documentedName} at project root to be found at ${loadedPath}`
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
