---
title: "find"
---

## Referenced In

- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
find | one of:<br/>- string<br/>- object([Find element (detailed)](/reference/schemas/find-element-detailed)) | Required. Find an element based on display text or a selector, then optionally interact with it. | 

## Examples

```json
{
  "find": "Find me!"
}
```

```json
{
  "find": {
    "selector": "[title=Search]"
  }
}
```

```json
{
  "find": {
    "selector": "[title=Search]",
    "timeout": 10000,
    "elementText": "Search",
    "moveTo": true,
    "click": true,
    "type": "shorthair cat"
  }
}
```

```json
{
  "find": {
    "selector": "[title=Search]",
    "click": {
      "button": "right"
    }
  }
}
```

```json
{
  "find": {
    "selector": "[title=Search]",
    "timeout": 10000,
    "elementText": "Search",
    "moveTo": true,
    "click": true,
    "type": {
      "keys": [
        "shorthair cat"
      ],
      "inputDelay": 100
    }
  }
}
```

```json
{
  "find": {
    "elementId": "/^user-[0-9]+$/",
    "elementClass": [
      "admin",
      "/^level-[1-5]$/"
    ],
    "elementAttribute": {
      "data-active": true,
      "data-score": "/^[0-9]+$/"
    },
    "timeout": 8000,
    "moveTo": false
  }
}
```
