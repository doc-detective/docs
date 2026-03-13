---
title: "checkLink"
---

## Referenced In

- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
checkLink | one of:<br/>- string<br/>- object([Check link (detailed)](/reference/schemas/check-link-detailed)) | Required. No description provided. | 

## Examples

```json
{
  "checkLink": "https://www.google.com"
}
```

```json
{
  "checkLink": "/search"
}
```

```json
{
  "checkLink": {
    "url": "https://www.google.com",
    "statusCodes": 200
  }
}
```

```json
{
  "checkLink": {
    "url": "/search",
    "origin": "https://www.google.com",
    "statusCodes": [
      200
    ]
  }
}
```
