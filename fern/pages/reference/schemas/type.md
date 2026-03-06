---
title: "type"
---

## Referenced In

- [Find element (detailed)](/reference/schemas/find-element-detailed)
- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
type | one of:<br/>- one of:<br/>- string<br/>- array of string<br/>- object([Type keys (detailed)](/reference/schemas/type-keys-detailed)) | Required. Type keys. To type special keys, begin and end the string with `$` and use the special key's keyword. For example, to type the Escape key, enter `$ESCAPE$`. | 

## Examples

```json
{
  "type": "kittens"
}
```

```json
{
  "type": [
    "$ENTER$"
  ]
}
```

```json
{
  "type": [
    "kittens",
    "$ENTER$"
  ]
}
```

```json
{
  "type": {
    "keys": "kittens"
  }
}
```

```json
{
  "type": {
    "keys": [
      "$ENTER$"
    ]
  }
}
```

```json
{
  "type": {
    "keys": [
      "kittens",
      "$ENTER$"
    ],
    "inputDelay": 500
  }
}
```
