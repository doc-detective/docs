---
title: doc-detective-common
---

[`doc-detective-common`](https://github.com/doc-detective/doc-detective/tree/main/src/common) is an NPM package that contains shared schemas and logic used across Doc Detective repos, including the JSON schemas that define each test action. It's installable via NPM (`npm i doc-detective-common`).

The source code lives in the [`doc-detective`](https://github.com/doc-detective/doc-detective) monorepo under `src/common/`, but the package is still published independently to NPM.

This package doesn't depend on any other Doc Detective packages.

## Public exports

The package exports the following types and utilities:

### Types

- `Specification`: TypeScript type for test specifications
- `Test`: TypeScript type for test objects
- `Step`: TypeScript type for step objects
- `Context`: TypeScript type for context objects
- `Config`: TypeScript type for configuration objects
- `Report`: TypeScript type for report objects
- `FileType`: TypeScript type for file type definitions

### Utilities

- `schemas`: All JSON schemas for validation
- `validate()`: Validate objects against Doc Detective schemas
- `detectTests()`: Detect tests from documentation content
- `defaultFileTypes`: Default file type definitions for Markdown, HTML, AsciiDoc, and DITA

### Example usage

```javascript
import {
  detectTests,
  defaultFileTypes,
  validate
} from "doc-detective-common";

// Detect tests from Markdown content
const tests = await detectTests({
  content: "Click **Submit** to continue.",
  fileType: defaultFileTypes.markdown
});

// Validate a test specification
const result = validate({
  schemaKey: "spec_v3",
  object: mySpec
});
```
