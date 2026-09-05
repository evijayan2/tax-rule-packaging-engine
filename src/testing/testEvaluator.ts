import type { ITaxBracket, ITaxRuleVersion } from "../domain/types.js";

/**
 * Rounds a monetary figure to 2 decimal places using deterministic half-up arithmetic.
 */
export function roundToCents(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Evaluates flat rate tax with optional wage base cap and prior cumulative wages.
 */
function evaluateFlatRate(
  version: ITaxRuleVersion,
  input: Record<string, unknown>
): Record<string, unknown> {
  const grossWages = Number(input.grossWages ?? 0);
  const priorCumulativeWages = Number(input.priorCumulativeWages ?? 0);
  const rate = Number(version.ruleData.rate ?? 0);
  const wageCap = version.ruleData.wageCap ? Number(version.ruleData.wageCap) : undefined;

  let taxableWages = grossWages;
  if (wageCap !== undefined) {
    const remainingCap = Math.max(0, wageCap - priorCumulativeWages);
    taxableWages = Math.min(grossWages, remainingCap);
  }

  const taxAmount = roundToCents(taxableWages * rate);
  return { taxAmount, taxableWages, effectiveRate: rate };
}

/**
 * Evaluates progressive tax bracket withholding.
 */
function evaluateBrackets(
  version: ITaxRuleVersion,
  input: Record<string, unknown>
): Record<string, unknown> {
  const grossWages = Number(input.grossWages ?? 0);
  const filingStatus = String(input.filingStatus ?? "SINGLE");
  const brackets: ITaxBracket[] = (version.ruleData.brackets as ITaxBracket[]) ?? [];

  const matched = brackets
    .filter((b) => b.filingStatus === filingStatus)
    .sort((a, b) => a.bracketSequence - b.bracketSequence);

  let taxAmount = 0;
  for (const b of matched) {
    if (grossWages > b.incomeFrom) {
      const taxableInBracket = b.incomeTo !== null && b.incomeTo !== undefined
        ? Math.min(grossWages - b.incomeFrom, b.incomeTo - b.incomeFrom)
        : grossWages - b.incomeFrom;
      taxAmount = roundToCents(b.baseTax + taxableInBracket * b.marginalRate);
    }
  }

  return { taxAmount, taxableWages: grossWages };
}

/**
 * Evaluates standard business mileage deduction/reimbursement.
 */
function evaluateMileage(
  version: ITaxRuleVersion,
  input: Record<string, unknown>
): Record<string, unknown> {
  const miles = Number(input.miles ?? 0);
  const rate = Number(version.ruleData.rate ?? 0);
  const reimbursementAmount = roundToCents(miles * rate);
  return { reimbursementAmount, miles, ratePerMile: rate };
}

/**
 * Dispatches test evaluation according to rule type.
 * @param version - The tax rule version containing formula/parameter configuration.
 * @param input - The test case input payload.
 * @returns Deterministic calculated output dictionary.
 */
export function evaluateRuleVersion(
  version: ITaxRuleVersion,
  input: Record<string, unknown>
): Record<string, unknown> {
  switch (version.ruleType) {
    case "FLAT_RATE":
      return evaluateFlatRate(version, input);
    case "BRACKET_PERCENTAGE":
      return evaluateBrackets(version, input);
    case "PER_MILE_RATE":
      return evaluateMileage(version, input);
    default:
      return evaluateFlatRate(version, input);
  }
}
