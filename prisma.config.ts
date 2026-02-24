import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Direct connection (port 5432) for migrations, bypassing pgbouncer
    url: process.env["DIRECT_URL"],
  },
});
