---
title: "Source Location"
---

Source location metadata for [detected tests](/docs/tests/detected). This object identifies where a step was detected in a documentation source file.

## Referenced In

- [Common](/reference/schemas/common)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
line | integer | Required. 1-indexed line number in the source file where the step was detected. Minimum: 1 |
startIndex | integer | Required. 0-indexed character offset from the start of the source file where the step begins. Minimum: 0 |
endIndex | integer | Required. 0-indexed character offset from the start of the source file where the step ends (exclusive). Minimum: 0 |

## Examples

```json
{
  "line": 5,
  "startIndex": 42,
  "endIndex": 58
}
```

```json
{
  "line": 12,
  "startIndex": 156,
  "endIndex": 203
}
```
