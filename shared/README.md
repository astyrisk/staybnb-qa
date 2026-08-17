# shared/

Cross-framework test data and reference material used by **both** frameworks.
No runtime code lives here — only binary/text assets and documentation that
both the Java/Selenium and TS/Playwright frameworks consume.

The two frameworks have incompatible module systems (JVM vs ESM) and must
remain independently runnable. This directory is the **only** shared surface
between them. Reference files here by relative path from each framework:
- from `frameworks/java-selenium/`: `../../shared/<file>`
- from `frameworks/ts-playwright/`: `../../shared/<file>`

## Contents

| Path | What it is |
|------|-----------|
| `api.yaml` | OpenAPI 3.0 spec for the StayBnB backend API. Both frameworks test the same backend; this is the canonical contract for every endpoint under test. |
| `test-data/media/apts/` | Apartment photos used as test fixtures for property-creation/image-upload tests. Both frameworks reference them by relative path (`../../shared/test-data/media/apts/<file>`). |
