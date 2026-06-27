# Cognitive Jurisdiction Map

## Official name

Cognitive Jurisdiction Map

## Status

Source-grounded KBC prompt asset. Browser-only. No-code. Platform portable.

## Core reasoning operation

Jurisdiction allocation and offload boundary-setting.

## Purpose

Separate what must remain human, what can be shared with the machine, and what is dangerous to offload without special verification.

## Input definition slot

Provide: project; intended output; where AI might help; stakes; who will rely on the work; known sources; publication or decision context.

## Evidence rule

Treat user responsibility, final judgment, taste, ethical commitment, and release decisions as non-delegable. Any consequential factual or technical content belongs in dangerous until verified.

## Ordered operations

1. State the project and intended consequence.
2. Identify non-delegable human responsibilities.
3. List shareable burdens that may be offloaded without surrendering judgment.
4. List dangerous burdens requiring verification, expertise, or external checks.
5. Create permission rules for machine roles and outputs.
6. Create a safe next-action plan.
7. Mark unresolved assumptions.

## Hard gate

Do not authorize the machine to make final judgments, public claims, professional conclusions, or safety-relevant decisions. If the intended use is high-consequence, route to Verification Receipt or domain expert review before release.

## Native artefacts

- Mine / Shareable / Dangerous Map
- Machine Permission Rules
- Unsafe Offload List
- Assumption List
- Safe Next-Action Plan

## Failure and abstention conditions

- The user asks AI to own responsibility, taste, ethics, signature, or final decision.
- The task involves high-consequence facts without verification.
- The project has no stated intended use or consequence.
- The user requests hidden or unverifiable authority from the machine.

## Unified Response Template reporting clause

Report using `URT_UNIFIED_RESPONSE_TEMPLATE.md` unless the user explicitly asks for another order. The URT controls presentation order only. Do not let the URT change this asset's purpose, evidence rule, hard gate, native artefacts, or decision logic.

## Canonical prompt text

```text
Create a Cognitive Jurisdiction Map for this project: [PROJECT]. Intended output: [OUTPUT]. Possible AI help: [AI HELP]. Stakes and audience: [STAKES]. Separate the work into Mine, Shareable, and Dangerous. For each item, give a concise rationale, permission rule, and safe next action. Do not let the machine own the final verdict.
```

## Short stress-test checklist

- [ ] Are non-delegable human responsibilities explicit?
- [ ] Are shareable tasks truly offloadable?
- [ ] Are dangerous tasks marked before use?
- [ ] Does it include permission rules?
- [ ] Does it avoid generic AI safety advice?


## Reasoning-model safety clause

Do not ask for or expose private chain-of-thought. Produce only visible artefacts, concise decision rationales, assumptions, evidence status, source paths, boundaries, and decision-relevant findings. More model reasoning does not upgrade trust status. Trust is upgraded only by provenance, source support, calculation, contradiction search, boundary preservation, domain review, reality contact, or human judgment.
