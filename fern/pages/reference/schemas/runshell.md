---
title: "runShell"
---

## Referenced In

- [File type (executable)](/reference/schemas/file-type-executable)
- [Markup definition](/reference/schemas/markup-definition)
- [Resolved context](/reference/schemas/resolved-context)
- [test](/reference/schemas/test)

## Fields

Field | Type | Description | Default
:-- | :-- | :-- | :--
runShell | one of:<br/>- string<br/>- object([Run shell command (detailed)](/reference/schemas/run-shell-command-detailed)) | Required. Perform a native shell command. | 

## Examples

```json
{
  "runShell": "docker run hello-world"
}
```

```json
{
  "runShell": {
    "command": "echo",
    "args": [
      "$USER"
    ]
  }
}
```

```json
{
  "runShell": {
    "command": "echo",
    "args": [
      "hello-world"
    ]
  }
}
```

```json
{
  "runShell": {
    "command": "docker run hello-world",
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
  "runShell": {
    "command": "false",
    "exitCodes": [
      1
    ]
  }
}
```

```json
{
  "runShell": {
    "command": "echo",
    "args": [
      "setup"
    ],
    "exitCodes": [
      0
    ],
    "stdio": "/.*?/"
  }
}
```

```json
{
  "runShell": {
    "command": "docker run hello-world",
    "workingDirectory": ".",
    "exitCodes": [
      0
    ],
    "stdio": "Hello from Docker!",
    "path": "docker-output.txt",
    "directory": "output",
    "maxVariation": 0.1,
    "overwrite": "aboveVariation"
  }
}
```
