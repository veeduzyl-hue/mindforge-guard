import * as permit from "../packages/guard/src/runtime/governance/permit/index.mjs";

permit.assertValidSecondConsumerFinalization();

const validation = permit.validateSecondConsumerFinalization();
if (!validation.ok) {
  throw new Error(`second consumer finalization validation failed: ${validation.errors.join("; ")}`);
}

for (const exportName of permit.SECOND_CONSUMER_CONTRACT_FINAL_EXPORT_SET) {
  if (!(exportName in permit)) {
    throw new Error(`second consumer final export missing: ${exportName}`);
  }
}

if (permit.SECOND_CONSUMER_CONTRACT_FINALIZATION_STAGE !== "standalone_runtime_final") {
  throw new Error("second consumer finalization stage drifted");
}
if (
  permit.SECOND_CONSUMER_CONTRACT_ACCEPTANCE_BOUNDARY !==
  "stable_non_audit_standalone_runtime"
) {
  throw new Error("second consumer finalization acceptance boundary drifted");
}
if (
  !permit.SECOND_CONSUMER_CONTRACT_COMPLETION_GATES.includes("summary_hash_not_identity")
) {
  throw new Error("second consumer finalization must preserve summary hash non-identity");
}
if (
  JSON.stringify(permit.SECOND_CONSUMER_CONTRACT_REQUIRED_INPUTS) !==
  JSON.stringify(permit.SECOND_CONSUMER_PILOT_REQUIRED_INPUTS)
) {
  throw new Error("second consumer finalization required inputs drifted from pilot");
}
if (
  JSON.stringify(permit.SECOND_CONSUMER_CONTRACT_OPTIONAL_INPUTS) !==
  JSON.stringify(permit.SECOND_CONSUMER_PILOT_OPTIONAL_INPUTS)
) {
  throw new Error("second consumer finalization optional inputs drifted from pilot");
}
if (
  JSON.stringify(permit.SECOND_CONSUMER_CONTRACT_EXCLUDED_INPUTS) !==
  JSON.stringify(permit.SECOND_CONSUMER_PILOT_AUDIT_BOUND_EXCLUSIONS)
) {
  throw new Error("second consumer finalization excluded inputs drifted from pilot");
}

process.stdout.write("second consumer finalization verified\n");
