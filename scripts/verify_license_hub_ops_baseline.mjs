import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function expect(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

const sqlPath = "apps/license-hub/sql/license-hub-ops-baseline.sql";
const docPath = "docs/commercial/license-hub-ops-baseline.md";
const readmePath = "apps/license-hub/README.md";

for (const relPath of [sqlPath, docPath, readmePath]) {
  expect(fs.existsSync(path.join(root, relPath)), `missing required ops baseline file: ${relPath}`);
}

const sql = read(sqlPath).toLowerCase();
for (const viewName of [
  "ops_recent_paid_orders",
  "ops_issued_licenses",
  "ops_webhook_failures",
  "ops_magic_link_activity",
  "ops_customer_journey",
]) {
  expect(sql.includes(`create or replace view ${viewName}`), `sql baseline missing view: ${viewName}`);
}

expect(sql.includes("create table if not exists ops_notes"), "sql baseline should include optional ops_notes table");
expect(!sql.includes("alter table orders"), "ops baseline must not alter orders");
expect(!sql.includes("alter table licenses"), "ops baseline must not alter licenses");
expect(!sql.includes("alter table webhook_events"), "ops baseline must not alter webhook_events");
expect(!sql.includes("insert into orders"), "ops baseline must not write into core runtime tables");
expect(!sql.includes("update orders"), "ops baseline must not update core runtime tables");
expect(!sql.includes("delete from orders"), "ops baseline must not delete core runtime tables");

const doc = read(docPath);
for (const token of [
  "no checkout changes",
  "no billing webhook behavior changes",
  "no license issuance semantic changes",
  "no pricing changes",
  "no admin panel is introduced",
  "no large schema refactor",
]) {
  expect(doc.includes(token), `ops baseline doc missing boundary statement: ${token}`);
}

const readme = read(readmePath);
expect(readme.includes("license-hub-ops-baseline.sql"), "README should reference the ops baseline SQL script");
expect(readme.includes("license-hub-ops-baseline.md"), "README should reference the ops baseline document");

const packageJson = read("package.json");
expect(
  packageJson.includes("\"verify:license-hub-ops-baseline\""),
  "package.json should include verify:license-hub-ops-baseline"
);

process.stdout.write("license hub ops baseline verified\n");
