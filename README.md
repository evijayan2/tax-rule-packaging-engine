# Tax Rule Packaging Engine (`@taxshield/tax-rule-packaging-engine`)

Module 1 of the TaxShield Ledger Versioned Tax Rules Architecture.

Governed by the core dogma: **"Tax law is data, not application code."**

This standalone engine provides production-grade tools to author, validate, test, diff, and cryptographically seal tax rules into immutable data packages. These packages are consumed downstream by **Module 2: The Calculation Engine** in `shared-core` (and by extension both OSS and SaaS distributions).

---

## Capabilities

1. **Multi-Tier Validation Pipeline**:
   - Structural schema validation via Zod.
   - Database-grade effective date overlap prevention.
   - Mathematical boundary and bracket monotonicity verification.
   - Mandatory government source citations (Tier 1/2/3).

2. **Automated Regression Test Harness**:
   - Simulates payroll tax withholdings, progressive brackets, and mileage calculations.
   - Evaluates bundled golden test cases.
   - Requires 100% test pass rate to pass the publication gate.

3. **Governance & Visual Diffing**:
   - Detects field-by-field differences between active and draft versions.
   - Enforces separation of duties (`approvedBy !== createdBy`).

4. **Deterministic Cryptographic Sealing**:
   - Canonical JSON stringification with sorted keys.
   - SHA-256 digest generation for versions and manifest.
   - Seals packages into immutable `.taxpack.json` bundles.

---

## Installation & Scripts

```bash
# Install dependencies
pnpm install

# Run unit and integration tests
pnpm test

# Build TypeScript to dist/
pnpm build

# Generate sealed reference seed packages
pnpm package:seed
```

---

## CLI Usage

```bash
# Validate a draft package
pnpm cli validate ./my-package.json

# Run regression tests on a package
pnpm cli test ./my-package.json

# Visual diff two packages
pnpm cli diff ./active.json ./draft.json

# Build and seal a package to .taxpack.json
pnpm cli build ./draft.json ./sealed.taxpack.json
```

---

## License

Apache-2.0
