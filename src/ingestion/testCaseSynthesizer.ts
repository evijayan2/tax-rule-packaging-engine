import type { ITaxRuleTestCase } from "../domain/types.js";
import { roundToCents } from "../testing/testEvaluator.js";
import type { IExtractedTaxRule } from "./types.js";

/**
 * Synthesizes test cases for flat rate rules with annual wage caps.
 */
function synthesizeWageCapTestCases(rule: IExtractedTaxRule): ITaxRuleTestCase[] {
  const rate = rule.rate ?? 0;
  const wageCap = rule.wageCap ?? 100000;

  return [
    {
      id: `tc-${rule.ruleCode.toLowerCase()}-01`,
      description: "Standard monthly wage below wage cap",
      inputPayload: { grossWages: 5000, priorCumulativeWages: 0 },
      expectedOutput: { taxAmount: roundToCents(5000 * rate), taxableWages: 5000, effectiveRate: rate }
    },
    {
      id: `tc-${rule.ruleCode.toLowerCase()}-02`,
      description: "Partial wage cap threshold reach",
      inputPayload: { grossWages: 10000, priorCumulativeWages: wageCap - 6100 },
      expectedOutput: { taxAmount: roundToCents(6100 * rate), taxableWages: 6100, effectiveRate: rate }
    },
    {
      id: `tc-${rule.ruleCode.toLowerCase()}-03`,
      description: "Prior cumulative wages exceeding wage cap",
      inputPayload: { grossWages: 5000, priorCumulativeWages: wageCap + 1000 },
      expectedOutput: { taxAmount: 0.0, taxableWages: 0, effectiveRate: rate }
    }
  ];
}

/**
 * Synthesizes test cases for simple flat rate rules.
 */
function synthesizeSimpleFlatRateTestCases(rule: IExtractedTaxRule): ITaxRuleTestCase[] {
  const rate = rule.rate ?? 0;
  return [
    {
      id: `tc-${rule.ruleCode.toLowerCase()}-01`,
      description: "Standard $1,000 bi-weekly wage withholding",
      inputPayload: { grossWages: 1000 },
      expectedOutput: { taxAmount: roundToCents(1000 * rate), taxableWages: 1000, effectiveRate: rate }
    },
    {
      id: `tc-${rule.ruleCode.toLowerCase()}-02`,
      description: "Standard $5,000 monthly wage withholding",
      inputPayload: { grossWages: 5000 },
      expectedOutput: { taxAmount: roundToCents(5000 * rate), taxableWages: 5000, effectiveRate: rate }
    }
  ];
}

/**
 * Synthesizes test cases for standard mileage deduction.
 */
function synthesizeMileageTestCases(rule: IExtractedTaxRule): ITaxRuleTestCase[] {
  const rate = rule.rate ?? 0;
  return [
    {
      id: `tc-${rule.ruleCode.toLowerCase()}-01`,
      description: "Standard 100 business miles reimbursement",
      inputPayload: { miles: 100 },
      expectedOutput: { reimbursementAmount: roundToCents(100 * rate), miles: 100, ratePerMile: rate }
    }
  ];
}

/**
 * Synthesizes automated golden regression test cases for an extracted tax rule.
 * @param rule - The extracted rule definition.
 * @returns Array of valid regression test cases.
 */
export function synthesizeTestCases(rule: IExtractedTaxRule): ITaxRuleTestCase[] {
  if (rule.ruleType === "PER_MILE_RATE") {
    return synthesizeMileageTestCases(rule);
  }

  if (rule.wageCap !== undefined && rule.wageCap > 0) {
    return synthesizeWageCapTestCases(rule);
  }

  return synthesizeSimpleFlatRateTestCases(rule);
}
