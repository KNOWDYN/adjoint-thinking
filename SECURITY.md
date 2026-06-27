# Security Policy

## Scope

This file covers security and safety issues for the Adjoint Thinking Environment Pack.

This package is a browser-only AI configuration package. It is not executable software, a server, a database, a secure document vault, or a protected data-processing system.

## Supported versions

Only the latest release package distributed by KNOWDYN LTD is supported for security review. Older, modified, redistributed, or repackaged versions may contain altered instructions and are not supported unless expressly confirmed by KNOWDYN LTD.

## Reportable issues

Please report issues in these categories:

- prompt-injection vulnerability in package instructions;
- instruction behavior that encourages unsafe release of unverified claims;
- instructions that appear to request hidden chain-of-thought;
- documentation that may cause users to upload sensitive or regulated data carelessly;
- misleading professional-safety, legal, medical, financial, engineering, or security claims;
- malicious modification or redistribution of the package;
- license misuse or commercial use without authorization;
- platform-specific deployment risk caused by outdated documentation.

## Reporting process

Report security or safety issues through the official KNOWDYN reporting channel designated for this package.

Include:

- package version or file date;
- affected file name;
- exact prompt or instruction that caused the issue;
- platform used, if relevant;
- expected safe behavior;
- observed unsafe behavior;
- reproduction steps using non-sensitive sample data.

Do not send passwords, API keys, credentials, private documents, client data, patient data, student data, regulated data, trade secrets, or confidential files in a report.

## Prompt injection risk

Uploaded files and pasted user content may contain malicious or conflicting instructions. The package instructs the AI environment to treat uploaded source material, user content, and package instructions with role separation, but no prompt pack can guarantee full protection against prompt injection.

Users should not upload unknown files, adversarial prompts, third-party documents, or client materials unless they understand the risk and platform controls.

## Sensitive data policy

Do not upload or paste:

- passwords;
- API keys;
- private tokens;
- SSH keys;
- financial account information;
- identity documents;
- medical records;
- patient data;
- student records;
- legal secrets;
- client confidential data;
- proprietary source code;
- unreleased IP;
- regulated data;
- private personal data;
- business-confidential documents;
- sensitive research data;
- export-controlled or security-sensitive material.

If you need to work with sensitive material, use your organization's approved tools, policies, and data controls. This package does not create those controls.

## No secrets rule

Never use this package to process secrets. If a secret is accidentally pasted into a chat or uploaded file, treat it as exposed according to your platform and organizational policies.

## Model output risk

AI-generated outputs can be false, stale, overgeneralized, incomplete, biased, unsafe, or unsupported by evidence. The package reduces risk by requiring visible artefacts, source paths, trust labels, boundaries, contradiction search, and human verdicts, but it does not eliminate the need for independent review.

High-consequence outputs require independent verification and appropriate domain review.

## High-consequence use

Do not rely on this package alone for legal, medical, financial, engineering, cybersecurity, clinical, regulatory, safety, crisis, employment, immigration, academic disciplinary, or other high-consequence decisions.

Use qualified professionals, official sources, calculations, standards, testing, and institutional review where appropriate.

## Platform account security

The package is installed into third-party AI platforms. Review each platform's current privacy, data controls, retention settings, sharing features, team settings, connector permissions, and file-upload policies before use.

Do not assume that a Project, Gem, or chat is private, compliant, or suitable for confidential data merely because it is convenient.

## Commercial deployment caution

Commercial deployment can create privacy, compliance, IP, confidentiality, client-reliance, and licensing obligations. A commercial license from KNOWDYN LTD is required for commercial use, but a license does not replace the deployer's security, legal, privacy, or compliance responsibilities.

## Known non-goals

This package does not provide:

- encryption;
- access control;
- authentication;
- audit logging;
- data retention control;
- compliance certification;
- legal privilege;
- HIPAA, GDPR, FERPA, SOC 2, ISO, or other compliance certification;
- malware scanning;
- secure file handling;
- guaranteed prompt-injection resistance;
- guaranteed model behavior.

## Safe testing

Use public, fictional, synthetic, or non-sensitive sample data when testing installation and validation prompts.
