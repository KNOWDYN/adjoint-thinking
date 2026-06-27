# Living Dossier Provenance Audit

## Official name

Living Dossier Provenance Audit

## Status

Source-grounded KBC prompt asset. Browser-only. No-code. Platform portable.

## Core reasoning operation

Provenance tracking, memory repair, and source lineage preservation.

## Purpose

Build or repair a project archive so claims, sources, boundaries, disagreements, machine contributions, and current judgment remain distinguishable.

## Input definition slot

Provide: notes, excerpts, AI summaries, source list, draft fragments, unresolved claims, or archive description.

## Evidence rule

Every serious note must carry provenance status: source, paraphrase, inference, machine synthesis, or personal judgment. Machine synthesis is never evidence by itself.

## Ordered operations

1. Inventory the archive fragments.
2. Assign provenance marks: source, paraphrase, inference, machine synthesis, personal judgment, or unknown.
3. Extract claims that can be true or false.
4. Attach or request source paths for claims.
5. Add boundaries and disagreements as separate chambers.
6. Separate machine contributions from evidence.
7. Create a living dossier structure and repair plan.

## Hard gate

If a claim lacks provenance, do not treat it as known. If a machine-generated synthesis lacks source support, label it as synthesis and keep it out of evidence-bearing sections.

## Native artefacts

- Archive Inventory
- Provenance Marks
- Claims Chamber
- Sources Chamber
- Boundaries Chamber
- Disagreements Chamber
- Machine Contributions Chamber
- Current Judgment Chamber
- Archive Repair Plan

## Failure and abstention conditions

- The user asks to treat untraceable material as fact.
- Sources are unavailable and claims are consequential.
- The archive mixes machine synthesis and evidence without labels.
- The user asks to erase uncertainty or disagreement for smoothness.

## Unified Response Template reporting clause

Report using `URT_UNIFIED_RESPONSE_TEMPLATE.md` unless the user explicitly asks for another order. The URT controls presentation order only. Do not let the URT change this asset's purpose, evidence rule, hard gate, native artefacts, or decision logic.

## Canonical prompt text

```text
Audit this project archive: [ARCHIVE OR NOTES]. Build a Living Dossier. Mark each fragment as source, paraphrase, inference, machine synthesis, personal judgment, or unknown. Extract true-or-false claims, attach source paths where available, identify missing provenance, record boundaries and disagreements, and produce an archive repair plan. Do not treat machine synthesis as evidence.
```

## Short stress-test checklist

- [ ] Does every serious fragment get a provenance mark?
- [ ] Are machine contributions separated from evidence?
- [ ] Are disagreements preserved?
- [ ] Are boundaries recorded?
- [ ] Does it produce a repair plan rather than smooth prose?


## Reasoning-model safety clause

Do not ask for or expose private chain-of-thought. Produce only visible artefacts, concise decision rationales, assumptions, evidence status, source paths, boundaries, and decision-relevant findings. More model reasoning does not upgrade trust status. Trust is upgraded only by provenance, source support, calculation, contradiction search, boundary preservation, domain review, reality contact, or human judgment.
