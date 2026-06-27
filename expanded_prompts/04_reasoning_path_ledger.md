# Reasoning Path Ledger

## Official name

Reasoning Path Ledger

## Status

Source-grounded KBC prompt asset. Browser-only. No-code. Platform portable.

## Core reasoning operation

Reasoning-path decomposition, premise inspection, and verdict protection.

## Purpose

Use the machine to generate or inspect reasoning paths while preserving the human verdict.

## Input definition slot

Provide: claim, argument, explanation, decision, or AI-generated reasoning path; intended use; known evidence; suspected weakness.

## Evidence rule

Reasoning paths are candidates, not verdicts. Every accepted path must expose premises, break conditions, and external verification needs.

## Ordered operations

1. Name the reasoning task: causal, formal, analogical, adversarial, experimental, or mixed.
2. Extract the proposed conclusion and supporting path.
3. Identify premises the path requires.
4. Ask what would break the path.
5. Identify what must be verified outside the exchange.
6. Offer alternative paths when useful.
7. Return a human-owned reasoning ledger, not a final verdict.

## Hard gate

Do not present the machine’s reasoning as settled. If the path depends on factual, technical, numerical, legal, medical, financial, regulatory, or current information, route those claims to Verification Receipt before use.

## Native artefacts

- Reasoning Task Label
- Path Options
- Premise Ledger
- Break Conditions
- External Verification List
- Concise Decision Rationale
- Human Verdict Placeholder

## Failure and abstention conditions

- The user asks for a verdict without premises or verification.
- The reasoning depends on unsupported facts.
- The machine’s chain is unfaithful, circular, or merely persuasive.
- The user requests hidden chain-of-thought.

## Unified Response Template reporting clause

Report using `URT_UNIFIED_RESPONSE_TEMPLATE.md` unless the user explicitly asks for another order. The URT controls presentation order only. Do not let the URT change this asset's purpose, evidence rule, hard gate, native artefacts, or decision logic.

## Canonical prompt text

```text
Build a Reasoning Path Ledger for this claim or argument: [CLAIM OR ARGUMENT]. Identify whether the needed path is causal, formal, analogical, adversarial, experimental, or mixed. Extract premises, what would break the path, what must be verified outside this exchange, and possible alternative paths. Give concise decision rationales only. Do not give or ask for hidden chain-of-thought. Do not let the machine own the verdict.
```

## Short stress-test checklist

- [ ] Does it classify the reasoning operation?
- [ ] Does it inspect premises?
- [ ] Does it ask what breaks the path?
- [ ] Does it list external verification needs?
- [ ] Does it keep the final verdict human?


## Reasoning-model safety clause

Do not ask for or expose private chain-of-thought. Produce only visible artefacts, concise decision rationales, assumptions, evidence status, source paths, boundaries, and decision-relevant findings. More model reasoning does not upgrade trust status. Trust is upgraded only by provenance, source support, calculation, contradiction search, boundary preservation, domain review, reality contact, or human judgment.
