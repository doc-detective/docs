---
title: docker-image (deprecated)
---

[`docker-image`](https://github.com/doc-detective/docker-image) is a Docker image that runs Doc Detective in a container. This repository is deprecated and archived—Docker image development is now in the main [`doc-detective`](doc-detective) repository under `src/container/`.

The Docker image simplifies installation and running Doc Detective on machines without Node.js or with heightened security requirements.

## What's included

The Docker image includes:

- **Node.js and Doc Detective**: The core testing framework
- **Python 3**: Python interpreter (3.11.2 on Linux, 3.13.1 on Windows) with pip and venv for running Python scripts via the `runCode` action
- **Browsers**: Google Chrome and Firefox for browser-based tests
- **DITA-OT**: DITA Open Toolkit for DITA content transformation
- **Java Runtime**: Required for DITA-OT operations

To contribute to Docker image development, see the [`doc-detective`](doc-detective) repository.
