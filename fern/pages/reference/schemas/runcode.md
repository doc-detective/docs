---
title: "runCode"
---

## Referenced In

- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
runCode | object([Run code (detailed)](/reference/schemas/run-code-detailed)) | Required. Assemble and run code. | 

## Examples

```json
{
  "runCode": {
    "language": "javascript",
    "code": "console.log('Hello, ${process.env.USER}!');"
  }
}
```

```json
{
  "runCode": {
    "language": "bash",
    "code": "docker run hello-world",
    "timeout": 20000,
    "exitCodes": [
      0
    ],
    "stdio": "Hello from Docker!"
  }
}
```

```json
{
  "runCode": {
    "language": "javascript",
    "code": "process.exit(1)",
    "exitCodes": [
      1
    ]
  }
}
```

```json
{
  "runCode": {
    "language": "python",
    "code": "print('Hello from Python')",
    "workingDirectory": ".",
    "exitCodes": [
      0
    ],
    "stdio": "Hello from Python!",
    "path": "python-output.txt",
    "directory": "output",
    "maxVariation": 0.1,
    "overwrite": "aboveVariation"
  }
}
```
