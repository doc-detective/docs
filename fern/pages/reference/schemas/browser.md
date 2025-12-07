
# Browser

Browser configuration.

## Referenced In

- [context](/docs/references/schemas/context)
- [Resolved context](/docs/references/schemas/resolved-context)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
name | string | Required. Name of the browser.<br/><br/>Accepted values: `chrome`, `firefox`, `safari`, `webkit` | 
headless | boolean | Optional. If `true`, runs the browser in headless mode. | `true`
window | object([Browser Window](/docs/references/schemas/browser-window)) | Optional. Browser dimensions. | 
viewport | object([Browser Viewport](/docs/references/schemas/browser-viewport)) | Optional. Viewport dimensions. | 

## Examples

```json
{
  "name": "chrome",
  "headless": true,
  "window": {
    "width": 42,
    "height": 42
  },
  "viewport": {
    "width": 42,
    "height": 42
  }
}
```
