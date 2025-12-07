
# Integrations options

Options for connecting to external services.

## Referenced In

- [config](/docs/references/schemas/config)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
openApi | array of unknown | Optional. No description provided. | 
docDetectiveApi | object([Doc Detective Orchestration API](/docs/references/schemas/doc-detective-orchestration-api)) | Optional. Configuration for Doc Detective Orchestration API integration. | 

## Examples

```json
{
  "openApi": [],
  "docDetectiveApi": {
    "apiKey": "example"
  }
}
```
