---
title: "click"
---

## Referenced In

- [Find element (detailed)](/reference/schemas/find-element-detailed)
- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
click | one of:<br/>- string<br/>- object([Click element (detailed)](/reference/schemas/click-element-detailed))<br/>- boolean | Required. Click or tap an element. | 

## Examples

```json
{
  "click": true
}
```

```json
{
  "click": "Submit"
}
```

```json
{
  "click": {
    "button": "left",
    "elementText": "Element text"
  }
}
```

```json
{
  "click": {
    "selector": "#elementToScreenshot",
    "elementText": "Element text",
    "button": "middle"
  }
}
```
