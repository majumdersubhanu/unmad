# UNMAD

Cultural platform landing experience deployed on Cloudflare Workers.

Live site: https://unmad.me

## What is included

- Single Worker entrypoint serving the animated UNMAD site
- GSAP + ScrollTrigger story animations
- Lenis smooth scrolling
- Cloudflare D1-backed preregistration endpoint
- SQL schema for preregistration storage
- Notes for Cloudflare DNS/routing

## Cloudflare setup

Worker name: `unmad-cultural-platform`

Routes:

- `unmad.me/*`
- `www.unmad.me/*`

D1 database:

- `unmad-preregistrations`
- Binding name: `DB`

## API

`POST /api/pre-register`

```json
{
  "email": "you@example.com",
  "source": "unmad.me"
}
```

Successful response:

```json
{
  "ok": true,
  "duplicate": false
}
```
