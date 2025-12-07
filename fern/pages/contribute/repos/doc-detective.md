---
sidebar_position: 1
---

# `doc-detective`

The most common entrypoint for most users, [`doc-detective`](https://github.com/doc-detective/doc-detective) is an NPM-based CLI tool that performs tests. It's installable via NPM (`npm i -g doc-detective`) and directly runnable without installation via NPX (`npx doc-detective`).

This repo depends on
- [`doc-detective-core`](doc-detective-core) for the primary testing logic.
- [`doc-detective-common`](doc-detective-common) for JSON schema definitions, schema validation logic, and path resolution logic.