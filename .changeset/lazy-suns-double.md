---
"astro-integration-kit": minor
---

Updates how `defineIntegration`'s `options` are handled (breaking change). They're not optional by default, you need to manually add `.optional()` at the end of your zod schema. If it's optional, users can still pass nothing or `undefined`.
