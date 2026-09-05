import type { ITaxRuleVersion } from "../domain/types.js";

export type DiffChangeType = "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED";

export interface IFieldDelta {
  field: string;
  changeType: DiffChangeType;
  oldValue: unknown;
  newValue: unknown;
  explanation: string;
}

export interface IVersionDiffResult {
  sourceVersionCode: string;
  targetVersionCode: string;
  hasDifferences: boolean;
  deltas: IFieldDelta[];
  comparedAt: string;
}

/**
 * Compares scalar properties between two versions.
 */
function compareScalarField(
  field: string,
  oldVal: unknown,
  newVal: unknown,
  deltas: IFieldDelta[]
): void {
  if (oldVal !== newVal) {
    deltas.push({
      field,
      changeType: oldVal === undefined ? "ADDED" : newVal === undefined ? "REMOVED" : "MODIFIED",
      oldValue: oldVal,
      newValue: newVal,
      explanation: `${field} altered from ${String(oldVal)} to ${String(newVal)}`
    });
  }
}

/**
 * Compares ruleData parameters (rates, caps, allowances).
 */
function compareRuleData(
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>,
  deltas: IFieldDelta[]
): void {
  const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]));

  for (const key of allKeys) {
    if (key === "brackets" || key === "parameters") continue;
    compareScalarField(`ruleData.${key}`, oldData[key], newData[key], deltas);
  }
}

/**
 * Computes granular parameter and effective date deltas between an active baseline version and a draft version.
 * @param sourceVersion - Baseline (typically current active version).
 * @param targetVersion - Target version (typically proposed new version).
 * @returns Detailed field deltas and summary.
 */
export function diffRuleVersions(
  sourceVersion: ITaxRuleVersion,
  targetVersion: ITaxRuleVersion
): IVersionDiffResult {
  const deltas: IFieldDelta[] = [];

  compareScalarField("ruleType", sourceVersion.ruleType, targetVersion.ruleType, deltas);
  compareScalarField("effectiveFrom", sourceVersion.effectiveFrom, targetVersion.effectiveFrom, deltas);
  compareScalarField("effectiveTo", sourceVersion.effectiveTo, targetVersion.effectiveTo, deltas);

  compareRuleData(sourceVersion.ruleData, targetVersion.ruleData, deltas);

  return {
    sourceVersionCode: sourceVersion.versionCode,
    targetVersionCode: targetVersion.versionCode,
    hasDifferences: deltas.length > 0,
    deltas,
    comparedAt: new Date().toISOString()
  };
}
