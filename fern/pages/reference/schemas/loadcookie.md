---
title: "loadCookie"
---

## Referenced In

- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
loadCookie | one of:<br/>- string<br/>- object([Load cookie (detailed)](/reference/schemas/load-cookie-detailed)) | Required. Load a specific cookie from a file or environment variable into the browser. | 

## Examples

```json
{
  "loadCookie": "session_token"
}
```

```json
{
  "loadCookie": "./test-data/auth-session.txt"
}
```

```json
{
  "loadCookie": "test_env_cookie"
}
```

```json
{
  "loadCookie": {
    "name": "auth_cookie",
    "variable": "AUTH_COOKIE"
  }
}
```

```json
{
  "loadCookie": {
    "name": "test_cookie",
    "path": "test-cookie.txt"
  }
}
```

```json
{
  "loadCookie": {
    "name": "session_token",
    "path": "session-token.txt",
    "directory": "./test-data"
  }
}
```

```json
{
  "loadCookie": {
    "name": "user_session",
    "path": "saved-cookies.txt",
    "domain": "app.example.com"
  }
}
```
