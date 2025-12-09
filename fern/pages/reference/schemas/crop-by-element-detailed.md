
# Crop by element (detailed)

Crop the screenshot to a specific element.

## Referenced In

- [Capture screenshot (detailed)](/docs/references/schemas/capture-screenshot-detailed)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
elementText | string | Optional. Display text of the element to screenshot. | 
selector | string | Optional. Selector of the element to screenshot. | 
padding | one of:<br/>- number<br/>- object([Padding (detailed)](/docs/references/schemas/padding-detailed)) | Optional. No description provided. | 

## Examples

```json
{
  "elementText": "example",
  "selector": "example",
  "padding": 42
}
```
