# Official Regulatory Sources Directory (Federal & 50 States)

This directory catalogues authoritative government repositories, clearinghouses, and retrieval procedures for Federal and all 50 U.S. states (+ DC) for tax years **2025**, **2026**, and **future tax years (2027+)**.

Governed by the core dogma: **"Tax law is data, not application code."**

---

## 1. Why Direct Government PDFs 404 or Return 403

When searching for or fetching official state/federal tax PDFs, you will frequently encounter broken links or access denied errors. Here is why this happens and how to overcome it:

1. **Anti-Bot & WAF Protection (HTTP 403 Forbidden)**:
   - Agencies like the Social Security Administration (`ssa.gov`), California EDD, and various state portals deploy Akamai, Cloudflare, or AWS WAF.
   - Automated scripts (`curl`, `Invoke-WebRequest`, headless browsers) are blocked.
   - **Remedy**: Open the portal in a standard desktop web browser to view or download the PDF, then use the local file workflow below.
2. **Deep-Link URL "Bit Rot" (HTTP 404 Not Found)**:
   - State Departments of Revenue frequently restructure their file storage, rename PDF files (e.g. appending version suffixes or revised dates), or migrate content management systems.
   - **Remedy**: Never bookmark or depend solely on direct `.pdf` URLs. Always use the **Canonical Landing Portal / Forms Hub** listed in Section 4.
3. **Publication Timing Lag**:
   - Visual employer withholding guides and tax tables for a new tax year are typically not finalized or uploaded as PDFs until **late December or early January** of the active tax year.
   - **Remedy**: Before final PDFs are published, statutory tax rates and wage bases are already enacted in state legislative statutes and national clearinghouse tables.

---

## 2. Authoritative National Clearinghouses (All 50 States)

Instead of manually navigating 50 individual state websites with differing file layouts, professional payroll compliance teams rely on two official national clearinghouses:

| Clearinghouse | Scope | Official Portal | What It Provides |
| :--- | :--- | :--- | :--- |
| **USDOL — Office of Unemployment Insurance (OUI)** | All 50 States + DC | [oui.doleta.gov/unemploy/statelaws.asp](https://oui.doleta.gov/unemploy/statelaws.asp) | Annual master comparison of state UI laws, SUTA taxable wage bases, and contribution rates. |
| **Federation of Tax Administrators (FTA)** | All 50 States + DC | [taxadmin.org](https://www.taxadmin.org) | Annual master matrix of individual state income tax rates, progressive brackets, and statutory citations. |
| **IRS Forms & Publications Hub** | Federal | [irs.gov/forms-pubs/about-publication-15-t](https://www.irs.gov/forms-pubs/about-publication-15-t) | Permanent canonical landing hub linking to current and all prior year Pub 15-T circulars. |

---

## 3. Federal Regulatory Authorities

| Component | Authority | 2025 Source | 2026 Source | Future Years Pattern |
| :--- | :--- | :--- | :--- | :--- |
| **FIT Withholding** | IRS | [Pub 15-T (2025)](https://www.irs.gov/pub/irs-prior/p15t--2025.pdf) | [Pub 15-T (Current)](https://www.irs.gov/pub/irs-pdf/p15t.pdf) | Archive: `irs.gov/pub/irs-prior/p15t--YYYY.pdf`<br>Hub: `irs.gov/forms-pubs/about-publication-15-t` |
| **Social Security (OASDI)** | SSA | [SSA 2025 ($176,100)](https://www.ssa.gov/oact/cola/cbb.html) | [SSA 2026 ($181,800)](https://www.ssa.gov/oact/cola/cbb.html) | Annual October COLA release: `ssa.gov/oact/cola/cbb.html` *(Open in browser if 403)* |
| **Medicare (HI)** | IRS | 26 U.S.C. § 3101(b) | 26 U.S.C. § 3101(b) | Statutory: 1.45% un-capped employee/employer + 0.9% over $200k |
| **Standard Mileage** | IRS | [Notice 2025-05 (70¢)](https://www.irs.gov/newsroom/irs-issues-standard-mileage-rates-for-2025) | [Notice 2026-XX](https://www.irs.gov/tax-professionals/standard-mileage-rates) | Annual mid-December news release: `irs.gov/tax-professionals/standard-mileage-rates` |
| **FUTA Unemployment** | USDOL / IRS | 26 U.S.C. § 3301 | 26 U.S.C. § 3301 | Statutory: 6.0% with max 5.4% credit $\to$ **0.60%** on first $7,000 |

---

## 4. State Authorities: Canonical Landing Portals (50 States + DC)

Use these stable landing portals to access current-year circulars and forms without 404 deep-link errors:

| St | Department of Revenue / Tax Agency (Withholding Portal) | Department of Labor / Workforce (SUTA Portal) | Tax Type |
| :--- | :--- | :--- | :--- |
| **AL** | [Alabama Dept. of Revenue Withholding](https://revenue.alabama.gov/individual-corporate/withholding-tax/) | [Alabama Dept. of Labor](https://labor.alabama.gov/uc/tax/) | Progressive (2% - 5%) |
| **AK** | [Alaska Dept. of Revenue](https://dor.alaska.gov/) | [Alaska Dept. of Labor & Workforce](https://labor.alaska.gov/estax/) | **No State Wage PIT** |
| **AZ** | [Arizona Dept. of Revenue](https://azdor.gov/withholding-tax) | [Arizona Dept. of Economic Security](https://des.az.gov/services/employment/unemployment-employer) | Flat Rate (2.50%) |
| **AR** | [Arkansas DFA Withholding Tax](https://www.dfa.arkansas.gov/excise-tax/income-tax/withholding-tax/) | [Arkansas Division of Workforce Services](https://dws.arkansas.gov/employers/) | Progressive (2% - 3.9%) |
| **CA** | [California EDD Payroll Taxes & Forms (DE 44)](https://edd.ca.gov/en/payroll_taxes/forms_and_publications/) | [California EDD Unemployment Insurance](https://edd.ca.gov/en/payroll_taxes/rates_and_withholding/) | Progressive (1% - 13.3%) |
| **CO** | [Colorado Dept. of Revenue](https://tax.colorado.gov/withholding-tax) | [Colorado Dept. of Labor & Employment](https://cdle.colorado.gov/employers/premiums) | Flat Rate (4.40%) |
| **CT** | [Connecticut DRS Withholding Information](https://portal.ct.gov/drs/withholding-taxes/withholding-tax-information) | [Connecticut Dept. of Labor UI](https://ctdol.state.ct.us/uitax/) | Progressive (2% - 6.99%) |
| **DE** | [Delaware Division of Revenue Withholding](https://revenue.delaware.gov/withholding-tax/) | [Delaware Dept. of Labor UI](https://labor.delaware.gov/divisions/unemployment-insurance/) | Progressive (0% - 6.6%) |
| **DC** | [DC Office of Tax and Revenue](https://otr.cfo.dc.gov/page/withholding-tax) | [DC Dept. of Employment Services](https://does.dc.gov/service/unemployment-compensation-employers) | Progressive (4% - 10.75%) |
| **FL** | [Florida Dept. of Revenue (Reemployment)](https://floridarevenue.com/taxes/taxesfees/Pages/reemployment.aspx) | [Florida Commerce Reemployment Tax](https://floridarevenue.com/taxes/taxesfees/Pages/reemployment.aspx) | **No State Wage PIT** |
| **GA** | [Georgia Dept. of Revenue Withholding](https://dor.georgia.gov/taxes/withholding-tax) | [Georgia Dept. of Labor](https://dol.georgia.gov/employers/unemployment-tax) | Flat Rate (5.39%) |
| **HI** | [Hawaii Dept. of Taxation](https://tax.hawaii.gov/forms/a1_b2_1withhold/) | [Hawaii DLIR Unemployment Division](https://labor.hawaii.gov/ui/) | Progressive (1.4% - 11%) |
| **ID** | [Idaho State Tax Commission](https://tax.idaho.gov/taxes/withholding/) | [Idaho Dept. of Labor](https://www.labor.idaho.gov/businesses/unemployment-tax/) | Flat Rate (5.695%) |
| **IL** | [Illinois Dept. of Revenue Withholding (IL-700-T)](https://tax.illinois.gov/research/taxrates/withholding.html) | [Illinois Dept. of Employment Security](https://ides.illinois.gov/employers.html) | Flat Rate (4.95%) |
| **IN** | [Indiana Dept. of Revenue Notice #1](https://www.in.gov/dor/business-tax/withholding-income-tax/) | [Indiana Dept. of Workforce Development](https://www.in.gov/dwd/indiana-unemployment/employers/) | Flat Rate (3.0% / 2.95%) |
| **IA** | [Iowa Dept. of Revenue Withholding](https://tax.iowa.gov/withholding-tax-information) | [Iowa Workforce Development UI](https://www.iowaworkforcedevelopment.gov/my-unemployment-insurance) | Flat Rate (3.80%) |
| **KS** | [Kansas Dept. of Revenue (KW-100)](https://www.ksrevenue.gov/eservwh.html) | [Kansas Dept. of Labor UI](https://www.kansasdol.gov/employers) | Progressive (3.1% - 5.7%) |
| **KY** | [Kentucky Dept. of Revenue Withholding](https://revenue.ky.gov/Business/Withholding-Tax/Pages/default.aspx) | [Kentucky Education & Labor Cabinet](https://kcc.ky.gov/career/Pages/Employer-Services.aspx) | Flat Rate (4.00%) |
| **LA** | [Louisiana Dept. of Revenue](https://revenue.louisiana.gov/WithholdingTax) | [Louisiana Workforce Commission](https://www.laworks.net/Unemployment/UI_Claimants.asp) | Progressive (1.85% - 4.25%) |
| **ME** | [Maine Revenue Services Withholding](https://www.maine.gov/revenue/taxes/withholding-pass-through-entity) | [Maine Dept. of Labor](https://www.maine.gov/labor/unemployment/) | Progressive (5.8% - 7.15%) |
| **MD** | [Comptroller of Maryland (MW506)](https://www.marylandtaxes.gov/business/withholding/index.php) | [Maryland Dept. of Labor](https://www.labor.maryland.gov/employment/uitaxtables.shtml) | Progressive (2% - 5.75%) |
| **MA** | [Massachusetts DOR Circular M](https://www.mass.gov/info-details/massachusetts-withholding-taxes) | [Massachusetts DUA](https://www.mass.gov/orgs/department-of-unemployment-assistance) | Flat Rate (5.00% + Surtax) |
| **MI** | [Michigan Dept. of Treasury Withholding](https://www.michigan.gov/taxes/business-taxes/withholding) | [Michigan Unemployment Insurance Agency](https://www.michigan.gov/leo/bureaus-agencies/uia) | Flat Rate (4.25%) |
| **MN** | [Minnesota Dept. of Revenue Withholding](https://www.revenue.state.mn.us/withholding-tax) | [Minnesota Unemployment Insurance](https://www.uimn.org/employers/) | Progressive (5.35% - 9.85%) |
| **MS** | [Mississippi Dept. of Revenue](https://www.dor.ms.gov/business/withholding-tax) | [Mississippi Dept. of Employment Security](https://mdes.ms.gov/employers/unemployment-tax/) | Flat Rate (4.7% / 4.0%) |
| **MO** | [Missouri Dept. of Revenue Withholding](https://dor.mo.gov/taxation/business/tax-types/withholding/) | [Missouri Division of Employment Security](https://labor.mo.gov/des/employers) | Progressive (2% - 4.8%) |
| **MT** | [Montana Dept. of Revenue Withholding](https://mtrevenue.gov/taxes/withholding-tax/) | [Montana Dept. of Labor & Industry](https://dli.mt.gov/employers) | Progressive (4.7% - 5.9%) |
| **NE** | [Nebraska Dept. of Revenue Circular EN](https://revenue.nebraska.gov/businesses/withholding-tax) | [Nebraska Dept. of Labor UI](https://dol.nebraska.gov/UIBenefits) | Progressive (2.46% - 5.84%) |
| **NV** | [Nevada Dept. of Taxation](https://tax.nv.gov/) | [Nevada DETR Unemployment](https://detr.nv.gov/Page/Unemployment_Insurance_for_Employers) | **No State Wage PIT** |
| **NH** | [New Hampshire Dept. of Revenue](https://www.revenue.nh.gov/) | [New Hampshire Employment Security](https://www.nhes.nh.gov/employers/index.htm) | **No State Wage PIT** |
| **NJ** | [New Jersey Division of Taxation (NJ-WT)](https://www.nj.gov/treasury/taxation/withholding/index.shtml) | [New Jersey Dept. of Labor](https://www.nj.gov/labor/ea/ea_index.html) | Progressive (1.4% - 10.75%) |
| **NM** | [New Mexico Taxation & Revenue](https://www.tax.newmexico.gov/businesses/wage-withholding-overview/) | [New Mexico Dept. of Workforce Solutions](https://www.dws.state.nm.us/en-us/Employers) | Progressive (1.5% - 5.9%) |
| **NY** | [New York Dept. of Taxation Forms Hub (NYS-50-T)](https://www.tax.ny.gov/forms/withholding_cur_forms.htm) | [New York Dept. of Labor UI](https://dol.ny.gov/unemployment-insurance-employers) | Progressive (4% - 10.9%) |
| **NC** | [North Carolina Dept. of Revenue (NC-30)](https://www.ncdor.gov/taxes/withholding-tax) | [North Carolina DES](https://des.nc.gov/employers) | Flat Rate (4.5% / 3.99%) |
| **ND** | [North Dakota State Tax Commissioner](https://www.tax.nd.gov/tax-types/withholding-tax) | [Job Service North Dakota](https://www.jobsnd.com/unemployment-employers) | Progressive (1.1% - 2.9%) |
| **OH** | [Ohio Dept. of Taxation Employer Withholding](https://tax.ohio.gov/) | [Ohio Dept. of Job & Family Services](https://jfs.ohio.gov/) | Progressive (2.75% - 3.5%) |
| **OK** | [Oklahoma Tax Commission Withholding](https://oklahoma.gov/tax/businesses/withholding-tax.html) | [Oklahoma Employment Security Commission](https://oklahoma.gov/oesc/employers.html) | Progressive (0.25% - 4.75%) |
| **OR** | [Oregon Dept. of Revenue Payroll Transit & PIT](https://www.oregon.gov/dor/programs/businesses/Pages/payroll.aspx) | [Oregon Employment Dept. Taxes](https://www.oregon.gov/employ/businesses/taxes/pages/default.aspx) | Progressive (4.75% - 9.9%) |
| **PA** | [Pennsylvania Dept. of Revenue REV-419](https://www.revenue.pa.gov/FormsandPublications/FormsforBusinesses/EmployerWithholding/Documents/rev-419.pdf) | [PA Dept. of Labor & Industry (UC-2)](https://www.uc.pa.gov/employers-uc-services-taxes/Pages/default.aspx) | Flat Rate (3.07%) |
| **RI** | [Rhode Island Division of Taxation Withholding](https://tax.ri.gov/tax-sections/withholding-tax) | [Rhode Island Dept. of Labor & Training](https://dlt.ri.gov/employers/unemployment-insurance) | Progressive (3.75% - 5.99%) |
| **SC** | [South Carolina Dept. of Revenue Withholding](https://dor.sc.gov/tax/withholding) | [South Carolina DEW](https://dew.sc.gov/employers/unemployment-insurance-taxes) | Progressive (0% - 6.2%) |
| **SD** | [South Dakota Dept. of Revenue](https://dor.sd.gov/) | [South Dakota Dept. of Labor & Regulation](https://dlr.sd.gov/ra/employers.aspx) | **No State Wage PIT** |
| **TN** | [Tennessee Dept. of Revenue](https://www.tn.gov/revenue.html) | [Tennessee Dept. of Labor & Workforce](https://www.tn.gov/workforce/employers.html) | **No State Wage PIT** |
| **TX** | [Texas Comptroller of Public Accounts](https://comptroller.texas.gov/) | [Texas Workforce Commission](https://www.twc.texas.gov/businesses/unemployment-tax) | **No State Wage PIT** |
| **UT** | [Utah State Tax Commission (Pub 14)](https://tax.utah.gov/withholding) | [Utah Dept. of Workforce Services](https://jobs.utah.gov/ui/employer/) | Flat Rate (4.55%) |
| **VT** | [Vermont Dept. of Taxes Withholding](https://tax.vermont.gov/business/withholding) | [Vermont Dept. of Labor UI](https://labor.vermont.gov/unemployment-insurance/employers) | Progressive (3.35% - 8.75%) |
| **VA** | [Virginia Dept. of Taxation Withholding](https://www.tax.virginia.gov/withholding-tax) | [Virginia Employment Commission](https://www.vec.virginia.gov/employers) | Progressive (2% - 5.75%) |
| **WA** | [Washington Dept. of Revenue](https://dor.wa.gov/) | [Washington Employment Security Dept.](https://esd.wa.gov/employer-taxes) | **No State Wage PIT** |
| **WV** | [West Virginia State Tax Dept.](https://tax.wv.gov/Business/WithholdingTax/Pages/WithholdingTax.aspx) | [WorkForce West Virginia](https://workforcewv.org/employers/) | Progressive (2.36% - 5.12%) |
| **WI** | [Wisconsin Dept. of Revenue (Pub W-166)](https://www.revenue.wi.gov/Pages/HTML/withholding.aspx) | [Wisconsin Dept. of Workforce Development](https://dwd.wisconsin.gov/uitax/) | Progressive (3.5% - 7.65%) |
| **WY** | [Wyoming Dept. of Revenue](https://revenue.wyo.gov/) | [Wyoming Dept. of Workforce Services](https://dws.wyo.gov/dws-division/unemployment-insurance/) | **No State Wage PIT** |

---

## 5. Local Browser Download & Ingestion Workflow

When a government site blocks script downloads (403 Forbidden) or uses dynamic search forms:

1. **Download via Web Browser**:
   Open the state's canonical forms portal in your normal web browser. Click and save the official guide/PDF into:
   ```text
   tax-rule-packaging-engine/sources/<STATE>/<filename>.pdf
   ```
2. **Compute the SHA-256 Hash Locally**:
   ```bash
   # Windows PowerShell
   Get-FileHash ./sources/PA/rev-419.pdf -Algorithm SHA256 | Select-Object -ExpandProperty Hash

   # Linux / macOS
   sha256sum ./sources/PA/rev-419.pdf | awk '{print "sha256:" $1}'
   ```
3. **Compile or Ingest**:
   Use the calculated checksum and the statutory citation in your adapter or run the CLI:
   ```bash
   pnpm cli ingest <STATE> 2026 ./packages/<STATE>-2026-draft.json
   ```
   *(Note: The reference packages `US-FED-2026`, `PA-STATE-2026`, `TX-STATE-2026`, and `DE-STATE-2026` already bundle verified statutory data and work 100% offline without live network dependencies).*
