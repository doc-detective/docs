---
title: "Integrations options"
---

Options for connecting to external services.

## Referenced In

- [config](/reference/schemas/config)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
openApi | array of object([openApi](/reference/schemas/openapi)) | Optional. No description provided. | 
docDetectiveApi | object([Doc Detective Orchestration API](/reference/schemas/doc-detective-orchestration-api)) | Optional. Configuration for Doc Detective Orchestration API integration. | 
heretto | array of object(Heretto CMS integration) | Optional. Configuration for Heretto CMS integrations. Each entry specifies a Heretto instance and a scenario to build and test. | 

## Examples

```json
{
  "openApi": [],
  "docDetectiveApi": {},
  "heretto": []
}
```
