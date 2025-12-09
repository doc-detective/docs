
# Response



## Referenced In

- [HTTP request (detailed)](/docs/references/schemas/http-request-detailed)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
headers | object([Response headers](/docs/references/schemas/response-headers)) | Optional. Headers expected in the response, in key/value format. If one or more `responseHeaders` entries aren't present in the response, the step fails. | ``{}``
body | one of:<br/>- object([Response body object](/docs/references/schemas/response-body-object))<br/>- array of unknown<br/>- string | Optional. JSON object expected in the response. If one or more key/value pairs aren't present in the response, the step fails. | ``{}``

## Examples

```json
{
  "headers": {},
  "body": {}
}
```
