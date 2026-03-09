---
title: doc-detective-common
---

[`doc-detective-common`](https://github.com/doc-detective/doc-detective/tree/main/src/common) is an NPM package that contains shared schemas and logic used across Doc Detective repos, including the JSON schemas that define each test action. It's installable via NPM (`npm i doc-detective-common`).

The source code lives in the [`doc-detective`](https://github.com/doc-detective/doc-detective) monorepo under `src/common/`, but the package is still published independently to NPM.

This package doesn't depend on any other Doc Detective packages.

## Public API

The package exports these modules:

### Functions and utilities

- `schemas`: JSON schema definitions for test actions and configuration
- `validate`: Schema validation logic
- `detectTests`: Logic to detect tests in documentation files

### TypeScript types

The package exports types for Doc Detective's core data structures:

```typescript
import type { Specification, Test, Step, Context, Config, Report } from 'doc-detective-common';
```

- `Specification`: A test specification containing tests and configuration
- `Test`: An individual test with steps
- `Step`: A single action within a test
- `Context`: Browser/platform context for running tests
- `Config`: Configuration options
- `Report`: Test result report

Using these types keeps your code in sync with schema changes.
