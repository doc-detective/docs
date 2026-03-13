---
title: "wait"
---

## Referenced In

- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
wait | one of:<br/>- number<br/>- string<br/>- boolean | Required. Pause (in milliseconds) before performing the next action. | `5000`

## Examples

```json
{
  "wait": 5000
}
```

```json
{
  "wait": "$WAIT_DURATION"
}
```

```json
{
  "wait": true
}
```
