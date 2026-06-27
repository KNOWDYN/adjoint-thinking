# Reasoning Model Compatibility

## Purpose

This note makes the pack compatible with modern foundation models that may use hidden internal reasoning, extended thinking, thinking budgets, or reasoning modes.

## Rules

1. Do not ask the model to reveal raw chain-of-thought.
2. Trigger deeper reasoning through visible artefacts, not private thought traces.
3. Ask for assumptions, claims, source paths, alternatives, contradictions, test gates, trust labels, and concise decision rationales.
4. If a platform offers a deeper reasoning, extended thinking, or thinking mode, use it for complex synthesis, verification, reasoning, coding, planning, and multi-constraint work.
5. More thinking is not verification.
6. Trust can only be upgraded by source support, calculation, contradiction search, boundary preservation, domain review, reality contact, or human judgment.
7. Do not claim that external sources, calculations, files, tools, or checks were used unless they were actually used or supplied.

## Safe phrasing

Use:

> Show the visible artefacts needed to support your answer: assumptions, claim list, source paths, contradiction search, trust label, and concise decision rationale.

Avoid:

> Show your chain-of-thought.

## Release rule

The package is designed to trigger useful reasoning through tasks and artefacts while preserving hidden reasoning privacy and source-grounded trust discipline.
