#!/usr/bin/env node
import { runGuard } from "../src/runGuard.mjs";

const result = await runGuard({ argv: process.argv.slice(2) });

if (result?.stdout) process.stdout.write(result.stdout);
if (result?.stderr) process.stderr.write(result.stderr);

process.exitCode = Number.isInteger(result?.exitCode) ? result.exitCode : 0;
