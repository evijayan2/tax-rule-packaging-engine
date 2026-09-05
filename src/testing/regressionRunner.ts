import type { ITaxRulePackage, ITaxRuleTestCase, ITaxRuleVersion } from "../domain/types.js";
import { evaluateRuleVersion } from "./testEvaluator.js";

export interface ITestCaseResult {
  testId: string;
  description: string;
  passed: boolean;
  expected: Record<string, unknown>;
  actual: Record<string, unknown>;
  failureReason?: string;
}

export interface IRegressionRunReport {
  passed: boolean;
  totalTests: number;
  passCount: number;
  failCount: number;
  results: ITestCaseResult[];
  executedAt: string;
}

/**
 * Deeply compares actual calculated values against expected values.
 */
function matchOutputs(
  expected: Record<string, unknown>,
  actual: Record<string, unknown>
): { matched: boolean; reason?: string } {
  for (const key of Object.keys(expected)) {
    const expVal = expected[key];
    const actVal = actual[key];

    if (typeof expVal === "number" && typeof actVal === "number") {
      if (Math.abs(expVal - actVal) > 0.001) {
        return {
          matched: false,
          reason: `Mismatch for key '${key}': expected ${expVal}, got ${actVal}`
        };
      }
    } else if (expVal !== actVal) {
      return {
        matched: false,
        reason: `Mismatch for key '${key}': expected '${String(expVal)}', got '${String(actVal)}'`
      };
    }
  }
  return { matched: true };
}

/**
 * Executes all regression test cases for a single tax rule version.
 * @param version - The tax rule version to test.
 * @returns Regression report for this version.
 */
export function runVersionRegressionTests(version: ITaxRuleVersion): IRegressionRunReport {
  const results: ITestCaseResult[] = [];
  let passCount = 0;

  for (const tc of version.testCases) {
    try {
      const actual = evaluateRuleVersion(version, tc.inputPayload);
      const comparison = matchOutputs(tc.expectedOutput, actual);

      if (comparison.matched) {
        passCount++;
        results.push({ testId: tc.id, description: tc.description, passed: true, expected: tc.expectedOutput, actual });
      } else {
        results.push({ testId: tc.id, description: tc.description, passed: false, expected: tc.expectedOutput, actual, failureReason: comparison.reason });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      results.push({ testId: tc.id, description: tc.description, passed: false, expected: tc.expectedOutput, actual: {}, failureReason: `Exception: ${errorMsg}` });
    }
  }

  const total = version.testCases.length;
  return {
    passed: passCount === total && total > 0,
    totalTests: total,
    passCount,
    failCount: total - passCount,
    results,
    executedAt: new Date().toISOString()
  };
}

/**
 * Executes regression tests across all rules and versions in a tax rule package.
 * @param pkg - The tax rule package to test.
 * @returns Aggregated regression report across all package test suites.
 */
export function runPackageRegressionTests(pkg: ITaxRulePackage): IRegressionRunReport {
  const allResults: ITestCaseResult[] = [];
  let totalTests = 0;
  let totalPassed = 0;

  for (const rule of pkg.rules) {
    for (const version of rule.versions) {
      const rep = runVersionRegressionTests(version);
      totalTests += rep.totalTests;
      totalPassed += rep.passCount;
      allResults.push(...rep.results);
    }
  }

  return {
    passed: totalPassed === totalTests && totalTests > 0,
    totalTests,
    passCount: totalPassed,
    failCount: totalTests - totalPassed,
    results: allResults,
    executedAt: new Date().toISOString()
  };
}
