---
title: "screenshot"
---

## Referenced In

- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
screenshot | one of:<br/>- string<br/>- object([Capture screenshot (detailed)](/reference/schemas/capture-screenshot-detailed))<br/>- boolean | Required. Takes a screenshot in PNG format. | 

## Examples

```json
{
  "screenshot": true
}
```

```json
{
  "screenshot": "image.png"
}
```

```json
{
  "screenshot": "static/images/image.png"
}
```

```json
{
  "screenshot": "/User/manny/projects/doc-detective/static/images/image.png"
}
```

```json
{
  "screenshot": {
    "path": "image.png",
    "directory": "static/images",
    "maxVariation": 0.1,
    "overwrite": "aboveVariation",
    "crop": "#elementToScreenshot"
  }
}
```

```json
{
  "screenshot": {
    "path": "image.png",
    "directory": "static/images",
    "maxVariation": 0.1,
    "overwrite": "aboveVariation"
  }
}
```

```json
{
  "screenshot": {
    "path": "image.png",
    "directory": "static/images",
    "maxVariation": 0.1,
    "overwrite": "aboveVariation",
    "crop": {
      "selector": "#elementToScreenshot",
      "elementText": "Element text",
      "padding": {
        "top": 0,
        "right": 0,
        "bottom": 0,
        "left": 0
      }
    }
  }
}
```
