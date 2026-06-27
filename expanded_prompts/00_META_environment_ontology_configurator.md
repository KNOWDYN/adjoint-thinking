# Environment Ontology Configurator

## Official name

Environment Ontology Configurator

## Status

Source-grounded KBC prompt asset. Browser-only. No-code. Platform portable.

## Core reasoning operation

Ontology construction, audience framing, and source-bounded routing.

## Purpose

Configure a reusable Adjoint-Thinking environment for a specific user category so the environment has a conceptual ontology and can route work through the correct prompt assets.

## Input definition slot

Provide: user category; work domain; recurring work types; risk level; uploaded source list; preferred output types; forbidden uses; platform target if known.

## Evidence rule

Use the uploaded source and user-provided category as controlling material. If the category requires factual claims about laws, markets, products, institutions, professions, or current platform features, mark those claims as requiring external verification before use.

## Ordered operations

1. Name the user category and the work it repeatedly performs.
2. Extract the category-specific cognitive burdens: attention, memory, reasoning, divergence, verification, synthesis, invention, or sovereignty.
3. Build a conceptual ontology of objects, claims, decisions, evidence types, outputs, risks, and human verdicts used by that category.
4. Map each burden to the correct KBC prompt asset.
5. Define evidence boundaries and abstention rules for the environment.
6. Create concise global instructions that can be pasted into ChatGPT Projects, Claude Projects, or Gemini Gems.
7. Generate starter prompts and validation prompts for the environment.

## Hard gate

Do not produce a ready-to-deploy environment if the user category, source corpus, or intended outputs are too vague to define jurisdiction and evidence boundaries. Produce a minimum provisional charter instead.

## Native artefacts

- User-Category Ontology
- Environment Charter
- Routing Table
- Evidence Boundaries
- Platform-neutral Master Instruction Block
- Starter Prompt Set
- Validation Prompt Set

## Failure and abstention conditions

- The source does not support the claimed environment purpose.
- The requested category depends on current facts that are not supplied or verified.
- The user asks for platform automation, API use, or code that browser-only users cannot apply.
- The environment would invite unverified professional, legal, medical, financial, engineering, safety, or regulatory conclusions.

## Unified Response Template reporting clause

Report using `URT_UNIFIED_RESPONSE_TEMPLATE.md` unless the user explicitly asks for another order. The URT controls presentation order only. Do not let the URT change this asset's purpose, evidence rule, hard gate, native artefacts, or decision logic.

## Canonical prompt text

```text
Use the uploaded source as controlling material. Build a browser-only Adjoint-Thinking environment for the following user category: [USER CATEGORY]. The environment must use the category as the conceptual ontology and Adjoint Thinking as the operational maestro. Produce a user-category ontology, environment charter, routing table, evidence boundaries, platform-neutral master instruction block, starter prompts, validation prompts, and any abstention rules. Do not invent external facts. Mark anything beyond the uploaded source as requiring external verification. Use the URT order only for reporting.
```

## Short stress-test checklist

- [ ] Does it define a real user category rather than a market slogan?
- [ ] Does it create routing logic instead of generic advice?
- [ ] Does it avoid unsupported platform or domain claims?
- [ ] Can a browser-only user install it by copy-paste and uploads?
- [ ] Does it preserve provenance, verification status, and human judgment?


## Reasoning-model safety clause

Do not ask for or expose private chain-of-thought. Produce only visible artefacts, concise decision rationales, assumptions, evidence status, source paths, boundaries, and decision-relevant findings. More model reasoning does not upgrade trust status. Trust is upgraded only by provenance, source support, calculation, contradiction search, boundary preservation, domain review, reality contact, or human judgment.
