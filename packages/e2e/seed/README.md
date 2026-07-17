# Seeding the `e2e-test` dataset

This seeds a single static artist document (plus the `generalSettings` singleton
it depends on) into the Sanity `e2e-test` dataset. It is a **manual, one-time
step** — it is never run by the test suite or CI, since e2e test runs must stay
read-only.

Run it whenever the fixture needs to be (re-)created:

```sh
pnpm --filter e2e seed
```

Requires `.env.e2e.local` (copy from `.env.e2e.example`) with a Sanity API
token that has write access to the `e2e-test` dataset
(`SANITY_STUDIO_WRITE_TOKEN`). Never commit that token or the `.env.e2e.local`
file.

The script refuses to run against any dataset other than `e2e-test`.
