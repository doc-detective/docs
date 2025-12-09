
# Request



## Referenced In

- [HTTP request (detailed)](/docs/references/schemas/http-request-detailed)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
headers | one of:<br/>- object([Request headers (object)](/docs/references/schemas/request-headers-object))<br/>- string | Optional. Headers to include in the HTTP request. | ``{}``
parameters | object([Request parameters](/docs/references/schemas/request-parameters)) | Optional. URL parameters to include in the HTTP request, in key/value format. | ``{}``
body | one of:<br/>- object([Request body (object)](/docs/references/schemas/request-body-object))<br/>- array of unknown<br/>- string | Optional. The body of the HTTP request. | ``{}``

## Examples

```json
{
  "headers": {},
  "parameters": {},
  "body": {}
}
```
