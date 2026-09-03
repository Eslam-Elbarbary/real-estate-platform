-- Convert roles.code from RoleCode enum to TEXT, preserving existing values.
ALTER TABLE "roles" ALTER COLUMN "code" TYPE TEXT USING "code"::text;

-- Drop the PostgreSQL enum type (no longer referenced after column migration).
DROP TYPE "RoleCode";
