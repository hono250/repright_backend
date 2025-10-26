---
timestamp: 'Sun Oct 26 2025 12:58:02 GMT-0400 (Eastern Daylight Time)'
parent: '[[../20251026_125802.31ec2d06.md]]'
content_id: 6ac8ded0849171c920750c8e6987850475813c9877099c7fbe93f564b508dfdd
---

# file: deno.json

```json
{
    "imports": {
        "@concepts/": "./src/concepts/",
        "@felix/argon2": "jsr:@felix/argon2@^3.0.2",
        "@utils/": "./src/utils/"
    },
    "tasks": {
        "concepts": "deno run --allow-net --allow-read --allow-sys --allow-env src/concept_server.ts --port 8000 --baseUrl /api"
    }
}
```
