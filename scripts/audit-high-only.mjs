let rawAuditOutput = "";

for await (const chunk of process.stdin) {
  rawAuditOutput += String(chunk);
}

if (!rawAuditOutput.trim()) {
  console.error("No npm audit output was received.");
  process.exit(1);
}

const parsedAudit = JSON.parse(rawAuditOutput);
const vulnerabilitySummary = parsedAudit.metadata?.vulnerabilities ?? {};

const low = Number(vulnerabilitySummary.low ?? 0);
const moderate = Number(vulnerabilitySummary.moderate ?? 0);
const high = Number(vulnerabilitySummary.high ?? 0);
const critical = Number(vulnerabilitySummary.critical ?? 0);

console.log(
  `npm audit summary: critical=${critical}, high=${high}, moderate=${moderate}, low=${low}`,
);

if (critical > 0 || high > 0) {
  console.error("High or critical vulnerabilities detected.");
  process.exit(1);
}

console.log("No high or critical vulnerabilities detected.");
