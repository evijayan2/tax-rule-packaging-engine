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
# Ingest official notices into a draft package (IRS, PA, TX, DE)
pnpm cli ingest <IRS|PA|TX|DE> [taxYear] [outFile.json]

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

## Documentation & Guides

- [Step-by-Step Authoring & Rollover Guide](./HOW_TO_ADD_TAX_RULES.md): Detailed walkthrough for adding new state tax rules (flat rates, progressive brackets, no-tax states, SUTA) and rolling over to new tax years.
- [Official Regulatory Sources Directory (Federal & 50 States)](./OFFICIAL_SOURCES_DIRECTORY.md): Authoritative repository directory, publication links, and URL locator patterns for 2025, 2026, and future years (IRS, SSA, and all 50 states + DC).

---

## License

Apache-2.0


