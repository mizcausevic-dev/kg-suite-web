/* The eleven verticals, visualized. Same radial hub/leaf engine as the
   homepage's suite-constellation.js and /specs/'s specs-constellation.js
   (same polar math, same arc/spoke/branch/dossier mechanics), adapted for
   this page's real structure: 11 vertical hubs, each fanning out to
   EXACTLY 6 leaves, one per canonical artifact shape. Every hub is drawn
   the same size on purpose (real: every vertical really does ship exactly
   6 sibling repos, no more, no less), and every hub's 6 leaves sit in the
   same fixed shape order, so the diagram itself shows the page's thesis
   ("same 6 shapes, 11 verticals") instead of just asserting it in prose.

   Every hub label/tagline/buyer and every leaf shape/repo-name/blurb below
   is copied verbatim from this file's own /verticals/_verticals-data.json
   (the same source /verticals/_generate.mjs used to build every one of the
   11 already-published /verticals/<code>/ pages this page links to), with
   five blurb strings corrected for a "§" -> "Â§" mojibake bug present only
   in that JSON source file (confirmed against the clean text already live
   on /verticals/edtech/, /insurtech/, /hrtech/, /govtech/ — nothing here
   was invented). Repo URLs follow the exact
   https://github.com/mizcausevic-dev/<repo-name> pattern _generate.mjs
   itself uses.

   ADDITIVE: sits above the existing flat 11-card grid + 6-shape list below,
   which stay the default, untouched, zero-click reference surface. This is
   a second, exploratory way to reach the same real data, not a replacement.

   Accessibility (this engine, unlike its two siblings, adds real keyboard
   support): every SVG hub/leaf node gets tabindex="0", role="button", a
   descriptive aria-label, and a keydown handler so Enter/Space match click.
   The pill-bar legend uses real <button> elements instead of <span>, so it
   gets native keyboard/focus support for free. Every focusable node gets a
   visible :focus-visible treatment (see the page's inline <style>). The
   only animation (a decorative conic sweep) is disabled under
   prefers-reduced-motion in that same stylesheet. */
(function () {
  "use strict";

  var VERTICALS = [
    { code: 'healthtech', label: 'HEALTHTECH', full: 'HealthTech / Clinical AI',
      href: '/verticals/healthtech/', tagline: 'FDA SaMD + HIPAA + Section 1557 + IMDRF.', buyer: 'St Mary Hospital',
      items: [
        { shape: 'Operator audit-stream', name: 'fhir-resource-access-audit', blurb: 'Per-AI-tool FHIR resource access events hash-chained for HIPAA + Section 1557 evidence', u: 'https://github.com/mizcausevic-dev/fhir-resource-access-audit' },
        { shape: 'Operator regulatory-lifecycle', name: 'fda-samd-classification-board', blurb: 'FDA SaMD classification lifecycle (510(k) / De Novo / PMA + PCCP per Dec 2024 final)', u: 'https://github.com/mizcausevic-dev/fda-samd-classification-board' },
        { shape: 'Evidence Bundle (compliance)', name: 'hipaa-readiness-evidence-bundle', blurb: '18 HIPAA Security Rule standards across Admin / Physical / Technical safeguards', u: 'https://github.com/mizcausevic-dev/hipaa-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'clinical-bias-cohort-coverage-lab', blurb: 'OMB SPD 15 + Section 1557 + Fitzpatrick skin-type-classifier + equity metrics', u: 'https://github.com/mizcausevic-dev/clinical-bias-cohort-coverage-lab' },
        { shape: 'Incident Card', name: 'medical-adverse-event-incident-card', blurb: 'FDA MedWatch + EU MDR vigilance + IMDRF AE Terminology + CTCAE severity scale', u: 'https://github.com/mizcausevic-dev/medical-adverse-event-incident-card' },
        { shape: 'Decision Card vault contract', name: 'phi-vault-contract-profile', blurb: 'AI Procurement Decision Card v0.3 vault contract profile naming HIPAA\'s 18 Safe Harbor identifier categories', u: 'https://github.com/mizcausevic-dev/phi-vault-contract-profile' },
      ] },
    { code: 'edtech', label: 'EDTECH', full: 'EdTech / Student AI',
      href: '/verticals/edtech/', tagline: 'FERPA + COPPA + IDEA / Section 504 + ESSA + 50 state student-data-privacy regimes.', buyer: 'Lincoln Unified School District',
      items: [
        { shape: 'Operator audit-stream', name: 'student-data-access-audit-stream', blurb: 'CEDS + Ed-Fi-bridged audit events for every AI access of a student education record', u: 'https://github.com/mizcausevic-dev/student-data-access-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-ai-disclosure-state-tracker', blurb: '50-state student-data-privacy + state-AI-policy lifecycle ledger', u: 'https://github.com/mizcausevic-dev/state-ai-disclosure-state-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'ferpa-readiness-evidence-bundle', blurb: '8 FERPA obligation families (annual notification, school-official exception, directory info, consent, RoD, amendment, breach response, vendor procurement)', u: 'https://github.com/mizcausevic-dev/ferpa-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'student-cohort-bias-coverage-lab', blurb: 'ESSA accountability subgroups + WIDA EL proficiency + IDEA / Section 504 + foster / homeless / primary-home-language', u: 'https://github.com/mizcausevic-dev/student-cohort-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'ai-student-record-incident-card-profile', blurb: 'FERPA + COPPA + IDEA + Section 504 + Title VI/IX/504 + CTCAE-analog instructional-impact severity', u: 'https://github.com/mizcausevic-dev/ai-student-record-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'pii-student-vault-contract-profile', blurb: 'FERPA 7 §99.3 PII categories + COPPA 10 §312.2 PI categories (2025 refresh) + 4-doctrine consent_basis', u: 'https://github.com/mizcausevic-dev/pii-student-vault-contract-profile' },
      ] },
    { code: 'proptech', label: 'PROPTECH', full: 'PropTech / Real Estate AI',
      href: '/verticals/proptech/', tagline: 'RESPA + ECOA Reg B + Fair Housing Act + HMDA + GLBA + CFPB UDAAP + state real-estate AI laws.', buyer: 'Pacific Coast Mortgage Holdings',
      items: [
        { shape: 'Operator audit-stream', name: 'mortgage-decision-record-audit-stream', blurb: 'MISMO + URLA-bridged audit events; human_underwriter_required invariant', u: 'https://github.com/mizcausevic-dev/mortgage-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-real-estate-ai-disclosure-tracker', blurb: '50-state real-estate / mortgage / appraisal / tenant-screening AI law lifecycle', u: 'https://github.com/mizcausevic-dev/state-real-estate-ai-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'respa-readiness-evidence-bundle', blurb: '10 obligation families (RESPA, ECOA Reg B, TRID, FHA, HMDA, GLBA, CFPB UDAAP, ALTA, NAR 2024, state laws)', u: 'https://github.com/mizcausevic-dev/respa-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'mortgage-applicant-bias-coverage-lab', blurb: 'ECOA Reg B 9 classes + Fair Housing Act 7 classes + LTV/DTI/MSA dimensions; EEOC four-fifths-rule canonical', u: 'https://github.com/mizcausevic-dev/mortgage-applicant-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'title-chain-evidence-incident-card-profile', blurb: 'CFPB UDAAP + ECOA + Fair Housing + RESPA Section 8 + title-chain integrity event taxonomies', u: 'https://github.com/mizcausevic-dev/title-chain-evidence-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'mls-data-access-vault-contract-profile', blurb: 'RESPA + ECOA + Fair Housing + MLS + GLBA data categories + 7-doctrine consent_basis', u: 'https://github.com/mizcausevic-dev/mls-data-access-vault-contract-profile' },
      ] },
    { code: 'insurtech', label: 'INSURTECH', full: 'Insurance / InsurTech AI',
      href: '/verticals/insurtech/', tagline: 'NAIC AI Model Bulletin (Nov 2023) + state DOI adoptions + NY DFS CL 7 + CO SB 21-169.', buyer: 'Coastguard Insurance',
      items: [
        { shape: 'Operator audit-stream', name: 'insurance-decision-record-audit-stream', blurb: 'ACORD-bridged audit events; scoped human-in-loop invariant; 20-LOB taxonomy', u: 'https://github.com/mizcausevic-dev/insurance-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-insurance-ai-disclosure-tracker', blurb: 'Per-state DOI bulletins + NAIC adoptions (CT, NY DFS CL 7, CO 3 CCR 702-10, CA Bulletin 2022-5, WA TAA 2024-04)', u: 'https://github.com/mizcausevic-dev/state-insurance-ai-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'naic-ai-bulletin-readiness-evidence-bundle', blurb: '6 obligation families: governance (NAIC §2) + risk-management (§3) + third-party-AI (§4) + testing-validation + consumer-protection + state-DOI examination', u: 'https://github.com/mizcausevic-dev/naic-ai-bulletin-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'insurance-applicant-bias-coverage-lab', blurb: 'actuarial-soundness-defended coverage status; CO SB 21-169 + NAIC §3 + EEOC four-fifths-rule', u: 'https://github.com/mizcausevic-dev/insurance-applicant-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'unfair-discrimination-incident-card-profile', blurb: '10 event types + 4-tier severity + 6 regulator-referral pathways with evaluation-state tracking', u: 'https://github.com/mizcausevic-dev/unfair-discrimination-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'policyholder-data-vault-contract-profile', blurb: '15 insurance-data categories incl. telematics + smart-home sensor + medical-record summary; protected-class default NOT a model input', u: 'https://github.com/mizcausevic-dev/policyholder-data-vault-contract-profile' },
      ] },
    { code: 'hrtech', label: 'HRTECH', full: 'HR Tech / Employment AI',
      href: '/verticals/hrtech/', tagline: 'EEOC AI Guidance (May 2023) + Title VII + ADA + ADEA + GINA + OFCCP + NYC LL 144 + IL 820 ILCS 42 + MD HB 1202.', buyer: 'MomentumHR Inc.',
      items: [
        { shape: 'Operator audit-stream', name: 'employment-decision-record-audit-stream', blurb: 'Workday / UKG / Greenhouse-bridged; two orthogonal invariants (human-hiring-decision + NYC LL 144 candidate-notice)', u: 'https://github.com/mizcausevic-dev/employment-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-employment-ai-disclosure-tracker', blurb: 'First Suite tracker supporting sub-state jurisdictions; seed: NYC LL 144, IL 820 ILCS 42, MD HB 1202, CA AB 331, CO SB 24-205', u: 'https://github.com/mizcausevic-dev/state-employment-ai-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'eeoc-readiness-evidence-bundle', blurb: '6 obligation families: Title VII disparate-impact (UGESP) + ADA accommodation + ADEA + GINA + EEOC recordkeeping + OFCCP (conditional)', u: 'https://github.com/mizcausevic-dev/eeoc-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'employment-candidate-bias-coverage-lab', blurb: 'NYC LL 144 annual bias audit + UGESP four-fifths + UGESP §1607.5(D) 2-SD test + accommodation-pathway-impairment + two-sd-violation', u: 'https://github.com/mizcausevic-dev/employment-candidate-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'employment-ai-incident-card-profile', blurb: '13 event types incl. ai-nyc-ll-144-audit-failure + ai-il-820-ilcs-42-violation + ai-md-hb-1202-facial-recognition-violation + ai-ofccp-finding + ai-class-action-plaintiff-filing', u: 'https://github.com/mizcausevic-dev/employment-ai-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'candidate-data-vault-contract-profile', blurb: 'Strictest default-deny: 6/19 categories default NOT a model input (biometric, credit, social, protected-class self-ID, accommodation request, ADA medical); ADA pathway 5-flag block', u: 'https://github.com/mizcausevic-dev/candidate-data-vault-contract-profile' },
      ] },
    { code: 'fintech', label: 'FINTECH', full: 'FinTech / Consumer + Small Business Credit AI',
      href: '/verticals/fintech/', tagline: 'CFPB AI bulletin (2023) + Section 1071 + Section 1033 + UDAAP + OCC / FRB / FDIC joint AI + ECOA + FCRA + GLBA + BSA/AML.', buyer: 'Meridian Financial',
      items: [
        { shape: 'Operator audit-stream', name: 'financial-decision-record-audit-stream', blurb: '15-kind event taxonomy across 19 product lines; TWO orthogonal invariants (human-credit-officer + FCRA permissible-purpose)', u: 'https://github.com/mizcausevic-dev/financial-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-financial-ai-disclosure-tracker', blurb: 'First Suite tracker supporting multi-regulation per state (CA CCFPL + DFPI 10 CCR as parallel streams); seed: NY Part 500, CA CCFPL+DFPI, CO SB 24-205, IL HB 3773, TX HB 1709', u: 'https://github.com/mizcausevic-dev/state-financial-ai-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'cfpb-readiness-evidence-bundle', blurb: '8 obligation families: MRM (OCC 2011-12 + FRB SR 11-7) + ECOA Reg B + FCRA Reg V + GLBA + BSA/AML + Section 1071 + Section 1033 + CFPB UDAAP', u: 'https://github.com/mizcausevic-dev/cfpb-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'financial-applicant-bias-coverage-lab', blurb: 'business-necessity-defended + redlining-pattern-flagged statuses; Section 1071 minority/women/LGBTQI-owned business dimensions', u: 'https://github.com/mizcausevic-dev/financial-applicant-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'financial-ai-incident-card-profile', blurb: 'primary-federal-supervisor-notification routing (OCC/FRB/FDIC/NCUA per institution type); fincen-sar-narrative-update; cfpb-fair-lending-referral', u: 'https://github.com/mizcausevic-dev/financial-ai-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'financial-customer-data-vault-contract-profile', blurb: '17 categories incl. alternative-data feeds (Plaid, MX, Yodlee, Klarna, Afterpay, Affirm, UltraFICO) under Section 1033; data-portability window in retention envelope', u: 'https://github.com/mizcausevic-dev/financial-customer-data-vault-contract-profile' },
      ] },
    { code: 'govtech', label: 'GOVTECH', full: 'GovTech / Public Sector AI',
      href: '/verticals/govtech/', tagline: 'OMB M-24-10 + AI Bill of Rights + Section 508 + Privacy Act + FOIA + NIST AI RMF + EO 14110 (rescinded) / EO 14179 + FedRAMP + state government AI laws.', buyer: 'Pacific Region Federal Services Agency (PRFSA)',
      items: [
        { shape: 'Operator audit-stream', name: 'government-decision-record-audit-stream', blurb: '16-kind event taxonomy + classification_level + FedRAMP authorization; THREE orthogonal invariants (human-agency-officer + Federal AI Use Case Inventory + classification-clearance)', u: 'https://github.com/mizcausevic-dev/government-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-government-ai-disclosure-tracker', blurb: 'Per-jurisdiction lifecycle ledger of federal EOs + OMB memos + state government AI laws + local AI ordinances; includes \'rescinded\' lifecycle state for executive orders', u: 'https://github.com/mizcausevic-dev/state-government-ai-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'omb-m24-10-readiness-evidence-bundle', blurb: '8 obligation families: ai-governance + Federal AI Use Case Inventory + rights/safety-impacting minimum practices + OMB M-24-18 procurement + Section 508 + Privacy Act/FOIA + NIST AI RMF', u: 'https://github.com/mizcausevic-dev/omb-m24-10-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'government-applicant-bias-coverage-lab', blurb: 'OMB M-24-10 §5(d) + Title VI + ADA Title II + Section 1557 + OFCCP-equivalent + GovTech-unique Title VI LEP dimension + accessibility-pathway-impairment + agency-civil-rights-finding-pending coverage statuses', u: 'https://github.com/mizcausevic-dev/government-applicant-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'government-ai-incident-card-profile', blurb: '18 event types (most extensive) + 10 regulator-referral pathways including the GovTech-unique federal-ai-use-case-inventory-correction; covers OMB + agency civil rights + GAO + OIG + Section 508 + ADA Title II + classified leak + FedRAMP + congressional', u: 'https://github.com/mizcausevic-dev/government-ai-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'citizen-data-vault-contract-profile', blurb: '15 categories + REQUIRED ai_use_case_inventory_block + clearance-gated protection level + FOIA exemption tagging + Title VI LEP routing. Privacy Act SORN + NARA records-management retention envelope', u: 'https://github.com/mizcausevic-dev/citizen-data-vault-contract-profile' },
      ] },
    { code: 'legaltech', label: 'LEGALTECH', full: 'LegalTech / AI in the Practice of Law',
      href: '/verticals/legaltech/', tagline: 'ABA Model Rules 1.1c8 + 1.6 + 3.3 + 5.3 + attorney-client privilege + work-product + state bar opinions + Mata v. Avianca-era court orders.', buyer: 'Anchor & Reef LLP',
      items: [
        { shape: 'Operator audit-stream', name: 'matter-decision-record-audit-stream', blurb: '14-kind event taxonomy + REQUIRED resource.privilege_tier on every event (LegalTech-unique 8-value taxonomy). Three invariants: privilege-tier consistency + engagement-letter binding (ABA 1.7/1.9) + citation-validation-before-production-ready (anti-Mata-v-Avianca)', u: 'https://github.com/mizcausevic-dev/matter-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-bar-ai-disclosure-tracker', blurb: '9 jurisdictions seeded — ABA + 7 state bars (CA, NY-COSAC, FL, DC, PA, TX, IL) + SDNY (Mata v. Avianca sanction order as historical anchor). 16-state lifecycle covers opinion drafting → mandatory disclosure → enforcement action', u: 'https://github.com/mizcausevic-dev/state-bar-ai-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'aba-rule-1-6-readiness-evidence-bundle', blurb: '8 obligation families × 35 required evidence kinds. Treats attorney-client privilege preservation + work-product doctrine preservation as TWO separate families (waiver mechanics differ from confidentiality)', u: 'https://github.com/mizcausevic-dev/aba-rule-1-6-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'legal-applicant-bias-coverage-lab', blurb: 'Anchored to Title VI + Sixth Amendment + Batson v. Kentucky. Three LegalTech-unique subgroups: indigent_defendant_status + immigration_status_disclosed + criminal_history_band. Two unique coverage statuses: compas-cautionary-pattern-detected + batson-pattern-detected. Supervising-attorney review REQUIRED on four trigger categories', u: 'https://github.com/mizcausevic-dev/legal-applicant-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'legal-ai-incident-card-profile', blurb: '18 event types incl Mata-v-Avianca court-sanctioned-hallucination class. 6-code privilege_waiver_risk_taxonomy. ed25519 signature REQUIRED. 10 referral pathways incl outside ethics counsel + state bar disciplinary counsel + court disclosure + criminal-defense Sixth-Amendment effective-assistance', u: 'https://github.com/mizcausevic-dev/legal-ai-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'attorney-client-data-vault-contract-profile', blurb: 'Design centerpiece. 18 data categories × 8 privilege tiers (same enum as audit-stream — typed cross-repo binding). 4 LegalTech-unique runtime invariants. Two unique protection levels: tokenized-and-not-as-model-input-by-default-cross-matter + privilege-marker-required-on-every-disclosure', u: 'https://github.com/mizcausevic-dev/attorney-client-data-vault-contract-profile' },
      ] },
    { code: 'energytech', label: 'ENERGYTECH', full: 'EnergyTech / Grid + Pipeline Operations',
      href: '/verticals/energytech/', tagline: 'NERC CIP-002 through CIP-014 + TSA Security Directives + FERC Orders + DOE EO 14028 + state PUC orders + ISO/RTO Business Practice Manuals.', buyer: 'Continental Grid Operator (CGO) — regional transmission organization in the MISO/PJM/ERCOT shape',
      items: [
        { shape: 'Operator audit-stream', name: 'grid-decision-record-audit-stream', blurb: '17-kind event taxonomy + REQUIRED resource.bes_cyber_system_categorization + REQUIRED resource.ot_it_boundary. Three invariants: human-operator-in-loop on HIGH-IMPACT+OT + TSA pipeline disclosure + CIP-008 1-hour wall-clock (first Suite invariant enforcing regulatory time-arithmetic numerically).', u: 'https://github.com/mizcausevic-dev/grid-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-puc-ai-disclosure-tracker', blurb: '10 jurisdictions seeded: 6 state PUCs (CA / NY / TX / MA / IL / WA) + FERC + NERC + TSA + CAISO. Mixed-authority shape reflects the energy sector\'s actual multi-layered regulatory geography. Per-(jurisdiction, docket) lifecycle threading.', u: 'https://github.com/mizcausevic-dev/state-puc-ai-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'nerc-cip-readiness-evidence-bundle', blurb: '12 obligation families × 53 required evidence kinds — LARGEST evidence bundle in the Suite. Two parallel regulatory clocks (CIP-008 1-hour + TSA 12-hour) as separately-named drill records. AI model version change explicitly treated as CIP-010 configuration change.', u: 'https://github.com/mizcausevic-dev/nerc-cip-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'grid-operator-bias-coverage-lab', blurb: 'Population-level equity framing (not individual decisioning). EPA EJSCREEN + Justice40 + state DAC designations + DOE LEAD energy-burden bands. 3 EnergyTech-unique pattern detectors: load-shed-disparity-pattern-detected, restoration-priority-disparity-pattern-detected, critical-medical-equipment-response-time-violation. 7-day freshness window (shortest in Suite).', u: 'https://github.com/mizcausevic-dev/grid-operator-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'grid-operations-incident-card-profile', blurb: '20 event types — most extensive Incident Card in the Suite. Includes regulatory-clock meta-violations as first-class event types. 12 referral pathways (NERC E-ISAC + CISA + TSA + DOE CESER + FERC + ISO/RTO Market Monitor + state PUC + EPA EJ + DOJ Civil Rights + FBI Cyber Division). ed25519 REQUIRED.', u: 'https://github.com/mizcausevic-dev/grid-operations-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'grid-asset-data-vault-contract-profile', blurb: 'Design centerpiece. 20 data categories × 5 BES tiers × 3 OT/IT codes × 12 protection levels (7 EnergyTech-unique). medical-baseline-tokenized-with-flag protection level — only place in Suite where a per-record flag remains accessible alongside opaque identity. 5 unique runtime invariants including asymmetric OT→IT data-diode enforcement.', u: 'https://github.com/mizcausevic-dev/grid-asset-data-vault-contract-profile' },
      ] },
    { code: 'defensetech', label: 'DEFENSETECH', full: 'DefenseTech / DIB AI Tooling',
      href: '/verticals/defensetech/', tagline: 'DFARS 252.204-7012/7019/7020/7021 + CMMC 2.0 L2/L3 + NIST SP 800-171 r2 + 800-172 + ITAR (22 CFR 120-130) + EAR (15 CFR 730-774) + EO 13526 + ICD 705 + DoDI 5230.24 + NISPOM 32 CFR 117 + FAR 52.204-21 + False Claims Act 31 USC 3729.', buyer: 'Stratos Aerospace — DIB Tier 2 defense contractor (CAGE-coded prime sub, representative of an Aerospace + Defense supplier)',
      items: [
        { shape: 'Operator audit-stream', name: 'defense-decision-record-audit-stream', blurb: '18-kind event taxonomy + THREE first-class required fields on resource: cui_categorization + export_control_status + foreign_person_access_restriction. Three invariants: CUI distribution-statement on CUI-Specified+ (DoDI 5230.24); export-control gating (ITAR requires us_person_status verification + DDTC license number on AUTHORIZED-FOREIGN-PERSON); DFARS 252.204-7012(c)(1)(ii) 72-hour wall-clock — second Suite verifier enforcing regulatory time-arithmetic numerically.', u: 'https://github.com/mizcausevic-dev/defense-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'dod-cmmc-disclosure-tracker', blurb: '10 federal authorities seeded: DoD CIO + Cyber AB + DIBCAC + DDTC + BIS + NIST + GSA + DCMA + DCSA + NARA-ISOO. 8 distinct enforcement modes — most diverse enforcement-mode diversity of any state-tracker in the Suite. Reflects that no two federal-defense authorities work the same way (contract-clause-flowdown vs license-pre-authorization vs facility-personnel-clearance vs registry-curation are structurally different).', u: 'https://github.com/mizcausevic-dev/dod-cmmc-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'cmmc-l2-l3-readiness-evidence-bundle', blurb: '18 control families × 48 evidence kinds. 14 NIST 800-171 families + 4 CMMC-program-specific families (Program Mgmt, POA&M, SPRS Scoring, C3PAO Assessment Artifacts). Three invariants: L3+DIBCAC requires dibcac confidence score; DFARS 7019/7020 in scope requires cmmc-sprs-scoring evidence; every not-satisfied outcome must carry a poam_ref (orphan failures break POA&M traceability).', u: 'https://github.com/mizcausevic-dev/cmmc-l2-l3-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'defense-contractor-bias-coverage-lab', blurb: '15 dimensions × 8 metric kinds × 14 regulatory bases × 8 decision domains. Population-level only (per OFCCP guidance — counts below 20 reported as insufficient-data to avoid de-anonymization). DefenseTech-unique dimensions: protected-veteran-status-vevraa-4212, security-clearance-tier-distribution, clearance-denial-rate, polygraph-success-rate, subcontractor-sb-sdb-vosb-classification, insider-threat-flag-rate.', u: 'https://github.com/mizcausevic-dev/defense-contractor-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'defense-ai-incident-card-profile', blurb: '22 event types — LARGEST Incident Card profile in the Suite. Spans DFARS cyber incidents, CUI handling (spillage / marking / mishandling), ITAR + EAR violations, foreign-person access (unauthorized + blocked), classified-environment misuse + SCIF violations + AI-generated classified-marking errors, NISPOM insider-threat flags, CMMC POA&M failures + SPRS discrepancies, AI-tool supply-chain compromise. DFARS 72-hour clock enforced at the published-Card level (mirrors audit-stream invariant).', u: 'https://github.com/mizcausevic-dev/defense-ai-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'cui-data-vault-contract-profile', blurb: 'DESIGN CENTERPIECE. FIRST Suite vault contract with 3 orthogonal typed policy axes (cui_handling_policy 9 tiers × export_control_handling_policy 4 tiers × foreign_person_handling_policy 5 tiers). resolvePolicy() intersects all 3 axes at runtime — most-restrictive axis wins. cross_binding_refs as REQUIRED schema fields publish sibling repos. 4 runtime invariants: distribution_statement on CUI-Specified+; us-person-verified min on ITAR; audit_stream_event + fso_cosign on CLASSIFIED-*; audit_stream_event on AUTHORIZED-FOREIGN-PERSON (per-event DDTC review).', u: 'https://github.com/mizcausevic-dev/cui-data-vault-contract-profile' },
      ] },
    { code: 'retailtech', label: 'RETAILTECH', full: 'RetailTech / Consumer AI',
      href: '/verticals/retailtech/', tagline: 'FTC Section 5 + EU Omnibus 2019/2161 Art 6a + NY ATBP + CA SB-892 + CCPA / CPRA + BIPA + PCI DSS.', buyer: 'Parkway Marketplace, Inc.',
      items: [
        { shape: 'Operator audit-stream', name: 'retail-decision-record-audit-stream', blurb: '16-kind event taxonomy across 12 commerce surfaces; TWO retail-specific invariants (personalized-pricing-transparency + biometric-consent)', u: 'https://github.com/mizcausevic-dev/retail-decision-record-audit-stream' },
        { shape: 'Operator regulatory-lifecycle', name: 'state-retail-ai-disclosure-tracker', blurb: 'Per-state retail AI lifecycle ledger; seed: IL BIPA + 2024 amendment, CA CCPA → CPRA → CPPA ADMT, NY S365A ATBP + NYC §22-1201 biometric', u: 'https://github.com/mizcausevic-dev/state-retail-ai-disclosure-tracker' },
        { shape: 'Evidence Bundle (compliance)', name: 'ftc-algorithmic-pricing-readiness-evidence-bundle', blurb: '12-section bundle covering AI inventory + disclosure artifacts + annual bias audits + vendor due-diligence + ADM opt-out + biometric consent + dark-patterns review', u: 'https://github.com/mizcausevic-dev/ftc-algorithmic-pricing-readiness-evidence-bundle' },
        { shape: 'Evidence Bundle (bias)', name: 'consumer-pricing-bias-coverage-lab', blurb: '6 cohort dimensions (income-proxy / language-locale / device-class / time-of-day / geographic / loyalty-tenure); 4-band verdict (within-tolerance / watchlist / investigate / remediate)', u: 'https://github.com/mizcausevic-dev/consumer-pricing-bias-coverage-lab' },
        { shape: 'Incident Card', name: 'retail-ai-incident-card-profile', blurb: '12 RetailTech event types (pricing discrim, biometric misidentification, fraud false positive, dark-patterns enforcement, minor-targeting, data-broker exposure); 8 reason codes', u: 'https://github.com/mizcausevic-dev/retail-ai-incident-card-profile' },
        { shape: 'Decision Card vault contract', name: 'shopper-pii-vault-contract-profile', blurb: '7 data classes (identity, payment, biometric, purchase history, browsing history, loyalty, location) × 4 tokenization methods × 6 retention envelopes (biometric-special = 365-day hard-delete)', u: 'https://github.com/mizcausevic-dev/shopper-pii-vault-contract-profile' },
      ] },
  ];

  var svg = document.getElementById("vconst-graph");
  if (!svg) return;

  var N = VERTICALS.length;
  var TOTAL_REPOS = VERTICALS.reduce(function (a, v) { return a + v.items.length; }, 0);
  var CX = 500, CY = 500;
  var HUB_R = 228, LEAF_R = 392, ARC_R = 465, CENTER_R = 46, HUB_NODE_R = 18;

  function hue(i) { return Math.round((360 / N) * i); }
  function colorFor(i) { return "hsl(" + hue(i) + ",72%,62%)"; }
  function colorFaint(i) { return "hsl(" + hue(i) + ",55%,42%)"; }
  function polar(cx, cy, r, deg) {
    var rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function anchorFor(px) {
    var dx = px - CX;
    if (Math.abs(dx) < 9) return "middle";
    return dx > 0 ? "start" : "end";
  }
  var svgns = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    var e = document.createElementNS(svgns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function isActivateKey(e) {
    return e.key === "Enter" || e.key === " " || e.key === "Spacebar";
  }

  var activeCode = null;
  var hubEls = {}, leafEls = [];

  VERTICALS.forEach(function (v, i) {
    var angle = (360 / N) * i;
    var hubPos = polar(CX, CY, HUB_R, angle);
    var col = colorFor(i);

    var arcSpan = (360 / N) * 0.72;
    var a0 = angle - arcSpan / 2, a1 = angle + arcSpan / 2;
    var p0 = polar(CX, CY, ARC_R, a0), p1 = polar(CX, CY, ARC_R, a1);
    var largeArc = arcSpan > 180 ? 1 : 0;
    var arcPath = "M " + p0.x.toFixed(1) + " " + p0.y.toFixed(1) +
      " A " + ARC_R + " " + ARC_R + " 0 " + largeArc + " 1 " + p1.x.toFixed(1) + " " + p1.y.toFixed(1);
    svg.appendChild(el("path", { class: "arc", d: arcPath, stroke: col, "data-pod": v.code }));

    var spokeStart = polar(CX, CY, CENTER_R, angle);
    var spoke = el("line", { class: "spoke", x1: spokeStart.x, y1: spokeStart.y, x2: hubPos.x, y2: hubPos.y, stroke: col, "data-pod": v.code });
    svg.appendChild(spoke);

    var hubAriaLabel = v.full + " vertical. " + v.tagline + " " + v.items.length + " sibling repos, canonical buyer " + v.buyer + ". Activate to filter and open its dossier.";
    var hubGroup = el("g", {
      class: "node-hub hoverable", "data-pod": v.code, "data-kind": "hub",
      tabindex: "0", role: "button", "aria-label": hubAriaLabel,
    });
    hubGroup.appendChild(el("circle", { class: "ring", cx: hubPos.x, cy: hubPos.y, r: HUB_NODE_R + 6, stroke: colorFaint(i) }));
    hubGroup.appendChild(el("circle", { class: "core", cx: hubPos.x, cy: hubPos.y, r: HUB_NODE_R, fill: "var(--bg)", stroke: col }));
    hubGroup.appendChild(el("circle", { cx: hubPos.x, cy: hubPos.y, r: 3.2, fill: col }));
    var lblPos = polar(CX, CY, HUB_R + HUB_NODE_R + 22, angle);
    var hubLbl = el("text", { class: "lbl-hub", x: lblPos.x, y: lblPos.y, "font-size": 10.5, fill: col, "text-anchor": anchorFor(lblPos.x) });
    hubLbl.textContent = v.label;
    svg.appendChild(hubGroup);
    svg.appendChild(hubLbl);
    hubEls[v.code] = [hubGroup, hubLbl, spoke];

    var fan = Math.min(30, (360 / N) * 0.82);
    v.items.forEach(function (item, j) {
      var leafAngle = angle - fan / 2 + (fan / (v.items.length - 1)) * j;
      var leafPos = polar(CX, CY, LEAF_R, leafAngle);
      var branch = el("path", {
        class: "branch", "data-pod": v.code, stroke: colorFaint(i),
        d: "M " + hubPos.x.toFixed(1) + " " + hubPos.y.toFixed(1) + " L " + leafPos.x.toFixed(1) + " " + leafPos.y.toFixed(1),
      });
      svg.appendChild(branch);

      var leafLabelText = item.shape.length > 22 ? item.shape.slice(0, 20) + "…" : item.shape;
      var leafAriaLabel = v.label + " — " + item.shape + ": " + item.name + ". " + item.blurb;
      var leafGroup = el("g", {
        class: "node-leaf hoverable", "data-pod": v.code, "data-kind": "leaf", "data-idx": j,
        tabindex: "0", role: "button", "aria-label": leafAriaLabel,
      });
      leafGroup.appendChild(el("circle", { cx: leafPos.x, cy: leafPos.y, r: 6, fill: "var(--bg)", stroke: col }));
      leafGroup.appendChild(el("circle", { class: "beacon", cx: leafPos.x, cy: leafPos.y, r: 2, fill: col }));
      svg.appendChild(leafGroup);

      var lp = polar(CX, CY, LEAF_R + 14, leafAngle);
      var leafLbl = el("text", { class: "lbl-leaf", x: lp.x, y: lp.y, "font-size": 7.6, fill: "var(--muted-2)", "text-anchor": anchorFor(lp.x) });
      leafLbl.textContent = leafLabelText;
      svg.appendChild(leafLbl);

      leafEls.push({ pod: v.code, group: leafGroup, item: item, vertical: v });
    });
  });

  svg.appendChild(el("circle", { class: "center-ring", cx: CX, cy: CY, r: 64 }));
  svg.appendChild(el("circle", { class: "center-core", cx: CX, cy: CY, r: CENTER_R }));
  var centerLbl = el("text", { class: "center-lbl", x: CX, y: CY - 2, "text-anchor": "middle", "font-size": 13 });
  centerLbl.textContent = N + "×6";
  svg.appendChild(centerLbl);
  var centerSub = el("text", { class: "center-sub", x: CX, y: CY + 14, "text-anchor": "middle", "font-size": 8 });
  centerSub.textContent = TOTAL_REPOS + " REPOS";
  svg.appendChild(centerSub);

  var dossier = document.getElementById("vconst-dossier");
  var dKind = document.getElementById("vconst-dKind"), dTitle = document.getElementById("vconst-dTitle"),
    dDesc = document.getElementById("vconst-dDesc"), dMeta = document.getElementById("vconst-dMeta"), dLink = document.getElementById("vconst-dLink");

  function showDossierForHub(v) {
    dKind.textContent = "Vertical · " + v.items.length + " sibling repos";
    dTitle.textContent = v.full;
    dDesc.textContent = v.tagline;
    dMeta.innerHTML = "";
    var b1 = document.createElement("span"); b1.textContent = "Buyer: " + v.buyer; dMeta.appendChild(b1);
    dLink.textContent = "Open " + v.href + " →";
    dLink.href = v.href;
    dLink.target = "";
    dossier.classList.add("show");
  }
  function showDossierForItem(item, v) {
    dKind.textContent = "In " + v.label;
    dTitle.textContent = item.shape;
    dDesc.textContent = item.blurb;
    dMeta.innerHTML = "";
    var m1 = document.createElement("span"); m1.textContent = item.name; dMeta.appendChild(m1);
    dLink.textContent = "Open repo →";
    dLink.href = item.u;
    dLink.target = "_blank";
    dossier.classList.add("show");
  }
  document.getElementById("vconst-dossierClose").addEventListener("click", function () { dossier.classList.remove("show"); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && dossier.classList.contains("show")) dossier.classList.remove("show");
  });

  function applyFilter(code) {
    activeCode = code;
    svg.querySelectorAll("[data-pod]").forEach(function (node) {
      if (!code || node.getAttribute("data-pod") === code) node.classList.remove("dim");
      else node.classList.add("dim");
    });
    document.querySelectorAll(".vconst-pill[data-pod]").forEach(function (pill) {
      var isActive = pill.getAttribute("data-pod") === code;
      pill.classList.toggle("active", isActive);
      pill.setAttribute("aria-pressed", isActive ? "true" : "false");
      if (isActive) { pill.style.background = colorFor(VERTICALS.findIndex(function (v) { return v.code === code; })); pill.style.color = "var(--bg)"; }
      else { pill.style.background = ""; pill.style.color = ""; }
    });
    var resetPill = document.querySelector(".vconst-pill.reset");
    if (resetPill) { resetPill.classList.toggle("active", !code); resetPill.setAttribute("aria-pressed", !code ? "true" : "false"); }
  }

  function activateHub(v) {
    applyFilter(activeCode === v.code ? null : v.code);
    showDossierForHub(v);
  }
  function activateLeaf(item, v) {
    showDossierForItem(item, v);
  }

  VERTICALS.forEach(function (v) {
    var g = hubEls[v.code][0];
    g.addEventListener("mouseenter", function () { if (!activeCode) applyFilter(v.code); showDossierForHub(v); });
    g.addEventListener("mouseleave", function () { if (!activeCode) applyFilter(null); });
    g.addEventListener("focus", function () { showDossierForHub(v); });
    g.addEventListener("click", function () { activateHub(v); });
    g.addEventListener("keydown", function (e) {
      if (isActivateKey(e)) { e.preventDefault(); activateHub(v); }
    });
  });
  leafEls.forEach(function (leaf) {
    leaf.group.addEventListener("mouseenter", function () { showDossierForItem(leaf.item, leaf.vertical); });
    leaf.group.addEventListener("focus", function () { showDossierForItem(leaf.item, leaf.vertical); });
    leaf.group.addEventListener("click", function (e) { e.stopPropagation(); activateLeaf(leaf.item, leaf.vertical); });
    leaf.group.addEventListener("keydown", function (e) {
      if (isActivateKey(e)) { e.preventDefault(); e.stopPropagation(); activateLeaf(leaf.item, leaf.vertical); }
    });
  });
  svg.addEventListener("click", function (e) { if (e.target === svg) applyFilter(null); });

  var pillbar = document.getElementById("vconst-pillbar");
  var resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "vconst-pill reset active";
  resetBtn.setAttribute("aria-pressed", "true");
  resetBtn.textContent = "ALL " + N + " · " + TOTAL_REPOS;
  resetBtn.addEventListener("click", function () { applyFilter(null); dossier.classList.remove("show"); });
  pillbar.appendChild(resetBtn);

  VERTICALS.forEach(function (v, i) {
    var pill = document.createElement("button");
    pill.type = "button";
    pill.className = "vconst-pill";
    pill.setAttribute("data-pod", v.code);
    pill.setAttribute("aria-pressed", "false");
    pill.style.borderColor = colorFaint(i);
    pill.textContent = v.label + " · " + v.items.length;
    pill.addEventListener("mouseenter", function () { if (activeCode !== v.code) { pill.style.background = colorFor(i); pill.style.color = "var(--bg)"; } });
    pill.addEventListener("mouseleave", function () { if (activeCode !== v.code) { pill.style.background = ""; pill.style.color = ""; } });
    pill.addEventListener("click", function () { activateHub(v); });
    pillbar.appendChild(pill);
  });

  var statsEl = document.getElementById("vconst-stats");
  [
    [N, "regulated verticals"],
    [TOTAL_REPOS, "sibling repos"],
    [6, "canonical shapes, every vertical"],
  ].forEach(function (pair) {
    var s = document.createElement("div");
    s.className = "s";
    var b = document.createElement("b"); b.textContent = pair[0];
    var span = document.createElement("span"); span.textContent = pair[1];
    s.appendChild(b); s.appendChild(span);
    statsEl.appendChild(s);
  });
})();
