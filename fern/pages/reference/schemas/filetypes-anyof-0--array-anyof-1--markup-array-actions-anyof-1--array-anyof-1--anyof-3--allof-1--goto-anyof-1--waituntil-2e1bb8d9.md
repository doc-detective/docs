
# fileTypes-anyOf[0]-array-anyOf[1]-markup-array-actions-anyOf[1]-array-anyOf[1]-anyOf[3]-allOf[1]-goTo-anyOf[1]-waitUntil-2e1bb8d9

Configuration for waiting conditions after navigation.

## Referenced In

- [Go to URL (detailed)](/docs/references/schemas/go-to-url-detailed)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
networkIdleTime | one of:<br/>- integer<br/>- null | Optional. Wait for network activity to be idle (no new requests) for this duration in milliseconds. Set to `null` to skip this check. | `500`
domIdleTime | one of:<br/>- integer<br/>- null | Optional. Wait for DOM mutations to stop for this duration in milliseconds. Set to `null` to skip this check. | `1000`
find | object | Optional. Wait for a specific element to be present in the DOM. At least one of selector or elementText must be specified. | 

## Examples

```json
{
  "networkIdleTime": 500,
  "domIdleTime": 1000,
  "find": {
    "selector": "example",
    "elementText": "example"
  }
}
```
