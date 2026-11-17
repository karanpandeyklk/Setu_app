const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
}

test("app config has an Expo name, slug and version", () => {
  const app = readJson("app.json");
  assert.equal(typeof app.expo?.name, "string");
  assert.equal(typeof app.expo?.slug, "string");
  assert.equal(typeof app.expo?.version, "string");
});

test("package entry point exists", () => {
  const pkg = readJson("package.json");
  assert.equal(pkg.main, "index.ts");
  assert.ok(fs.existsSync(path.join(root, pkg.main)));
});
