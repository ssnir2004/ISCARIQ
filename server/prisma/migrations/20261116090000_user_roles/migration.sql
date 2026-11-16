-- Each user is an admin (may change data and manage users) or a viewer
-- (read only). Existing users stay admins.
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'admin';
