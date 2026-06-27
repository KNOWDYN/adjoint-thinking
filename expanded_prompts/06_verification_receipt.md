# Verification Receipt

## Official name

Verification Receipt

## Status

Source-grounded KBC prompt asset. Browser-only. No-code. Platform portable.

## Core reasoning operation

Validation, falsification, risk triage, source support, and trust labeling.

## Purpose

Inspect AI-assisted output before it carries a human name, public trust, professional consequence, or decision weight.

## Input definition slot

Provide: AI output; intended use; source references if any; consequence level; publication or decision context.

## Evidence rule

A machine answer becomes useful only after it has an earned trust label. Claims beyond the uploaded source or current facts require external verification before factual use.

## Ordered operations

1. State intended use and consequence level.
2. Extract claims that would need to be true for the output to stand.
3. Classify claim types: factual, numerical, causal, citation, boundary, technical, recent/current, recommendation, or interpretive.
4. Demand a source path for each load-bearing claim.
5. Check source gates: existence, type, support, and boundary.
6. Search for contradiction: source, case, condition, standard, exception, or measurement that would embarrass the output.
7. Add boundaries and caveats.
8. Assign trust label: orientation only, working material, verified for current use, rejected, or deeper review required.
9. Record the human decision.

## Hard gate

Do not label high-consequence output as ready without appropriate source, calculation, domain review, or external verification. If verification cannot be performed, mark the output orientation only, working material, or rejected.

## Native artefacts

- Intended Use Statement
- Claim Extraction Sheet
- Claim Type Map
- Source Support Check
- Boundary Audit
- Contradiction Search
- Consequence Note
- Trust Label
- Verification Receipt
- Human Decision

## Failure and abstention conditions

- The user provides no output or claim to inspect.
- Sources are missing for public or consequential claims.
- The claim depends on recent or external facts and no verification is available.
- The output is legal, medical, financial, engineering, safety, regulatory, clinical, or other high-consequence advice without domain verification.

## Unified Response Template reporting clause

Report using `URT_UNIFIED_RESPONSE_TEMPLATE.md` unless the user explicitly asks for another order. The URT controls presentation order only. Do not let the URT change this asset's purpose, evidence rule, hard gate, native artefacts, or decision logic.

## Canonical prompt text

```text
Create a Verification Receipt for this AI-assisted output: [OUTPUT]. Intended use: [USE]. Extract claims, classify claim types, identify source paths, check existence/type/support/boundary where possible, search for contradiction, add boundaries, assess consequence if wrong, assign an earned trust label, and record the human decision. If external verification is required, say so clearly.
```

## Short stress-test checklist

- [ ] Does it extract claims instead of judging prose globally?
- [ ] Does it distinguish source existence from source support?
- [ ] Does it add boundaries?
- [ ] Does it search contradiction?
- [ ] Does it assign a trust label and safe next action?


## Reasoning-model safety clause

Do not ask for or expose private chain-of-thought. Produce only visible artefacts, concise decision rationales, assumptions, evidence status, source paths, boundaries, and decision-relevant findings. More model reasoning does not upgrade trust status. Trust is upgraded only by provenance, source support, calculation, contradiction search, boundary preservation, domain review, reality contact, or human judgment.
