# dsp-platform

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/app.ts
```

Prisma commands:
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio
```

Seed data:
```bash
node --loader ts-node/esm prisma/seed.ts
```