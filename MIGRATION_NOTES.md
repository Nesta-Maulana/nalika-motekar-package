# Package Migration Notes

## Current Version: 1.0.12

## Changes Made

### Package (`@nesta-maulana/nalika-motekar-package`)

1. **Added 'use client' directive** (v1.0.10)
   - Updated `tsup.config.ts` to add 'use client' at top of all JS files via `onSuccess` hook
   - Fixes Next.js App Router SSR compatibility

2. **Fixed Type Exports:**
   - Added `RolePermission` export from `types/auth.ts` (v1.0.9)
   - Added `from` and `to` to `PaginatedResponse.meta` (v1.0.11)
   - Fixed duplicate `TenantStats` definition - now imports from `types/tenant.ts` in `lib/api/dashboard.ts` (v1.0.12)

3. **Type Definitions Updated:**
   - `Role` interface: Added `is_system`, `description`, `permissions`, `users_count`, `slug`
   - `User` interface: Added `status`, `is_active`
   - `TenantStats`: Has optional `total_tenants`, `active_tenants`, `pending_tenants`, `suspended_tenants`, `recent_signups`
   - `CentralUserRole`: Includes `'super_admin' | 'admin' | 'staff' | 'viewer'`

---

## FE Services Status

### fe-container-shell
- **Status: BUILD SUCCESS**
- Package version: ^1.0.12
- Changes made:
  - `src/types/index.ts`: Re-exports types from package
  - `src/hooks/index.ts`: Uses local hooks (exports from useTenants explicitly to avoid useCheckSubdomain conflict)
  - `src/app/page.tsx`: Imports components from package

### fe-management-service
- **Status: BUILD SUCCESS**
- Package version: ^1.0.12
- No additional changes needed

### fe-tenant-service
- **Status: BUILD PENDING** (interrupted)
- Package version: ^1.0.12
- Changes made:
  - `src/app/central-users/page.tsx`:
    - Added `viewer` to `roleLabels` object
    - Added `viewer` to Zod schemas (`createUserSchema`, `updateUserSchema`)
    - Fixed `user.status` undefined check in status display
  - `src/app/tenants/page.tsx`:
    - Fixed optional property access for `stats.total_tenants`, `stats.active_tenants`, etc.
  - `src/hooks/useCentralAuth.ts`:
    - Fixed optional `refresh_token` handling

---

## Next Steps to Continue

### 1. Finish fe-tenant-service build test
```bash
cd /mnt/d/00.\ Works/nalika.ai/fe-tenant-service
npm run build
```
If there are more type errors, fix them similarly.

### 2. Rebuild Docker containers
```bash
cd /mnt/d/00.\ Works/nalika.ai/docker
docker-compose build --no-cache fe-container-shell fe-management-service fe-tenant-service
```

### 3. Test at nalika-motekar.local
```bash
docker-compose up -d
```
Then visit http://nalika-motekar.local

---

## Known Issues / Patterns

1. **Type mismatches**: When package types have optional properties (`prop?`), local code using `record[prop]` will fail TypeScript. Use nullish coalescing: `record[prop] ?? fallback`

2. **Enum mismatches**: When package adds new enum values (like `'viewer'` to `CentralUserRole`), local Zod schemas and Record types must be updated to include the new value.

3. **SSR issues**: Package must have `"use client"` at top of all JS files for Next.js App Router compatibility.

---

## Package Publish Commands (via GitHub Actions)
```bash
cd /mnt/d/00.\ Works/nalika-motekar-package
# Make changes
npm run build
git add -A
git commit -m "Description"
git push
git tag vX.X.X
git push origin vX.X.X
# GitHub Actions will publish to npm
```

## Update FE Services
```bash
# After package is published, update FE services
# Edit package.json to use new version, then:
rm -rf node_modules package-lock.json
npm install
npm run build
```
