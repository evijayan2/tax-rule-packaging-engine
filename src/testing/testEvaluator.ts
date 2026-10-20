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
  const rawBrackets = version.ruleData.brackets;
  const bracketList: any[] = Array.isArray(rawBrackets)
    ? rawBrackets.filter((b: any) => !b.filingStatus || b.filingStatus === filingStatus)
    : rawBrackets && typeof rawBrackets === "object"
    ? (rawBrackets[filingStatus] as any[]) ?? (rawBrackets["SINGLE"] as any[]) ?? []
    : [];

  let taxAmount = 0;
  for (const b of bracketList) {
    const low = b.incomeFrom ?? b.over ?? 0;
    const high = b.incomeTo ?? b.max ?? null;
    const base = b.baseTax ?? 0;
    const rate = b.marginalRate ?? b.rate ?? 0;

    if (grossWages > low) {
      const taxableInBracket = high !== null && high !== undefined
        ? Math.min(grossWages - low, high - low)
        : grossWages - low;
      taxAmount = roundToCents(base + taxableInBracket * rate);
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
 * Evaluates statutory compliance thresholds (e.g. Form 1099-NEC $600 threshold).
 */
function evaluateThreshold(
  version: ITaxRuleVersion,
  input: Record<string, unknown>
): Record<string, unknown> {
  const amount = Number(input.amount ?? input.grossWages ?? input.ytdAmount ?? 0);
  const threshold = Number(version.ruleData.threshold ?? version.ruleData.rate ?? 0);
  const thresholdMet = amount >= threshold;
  return { thresholdMet, amount, threshold };
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
    case "THRESHOLD":
      return evaluateThreshold(version, input);
    default:
      return evaluateFlatRate(version, input);
  }
}

