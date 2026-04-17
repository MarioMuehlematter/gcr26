# Testing Patterns

**Analysis Date:** 2025-02-14

## Test Framework

**Runner:**
- Not detected. No automated test runner (Jest, Vitest, etc.) is configured in the codebase.

**Assertion Library:**
- Not applicable.

**Run Commands:**
```bash
# No automated test commands available
```

## Test File Organization

**Location:**
- No automated tests found.

**Naming:**
- Not applicable.

**Structure:**
- Not applicable.

## Test Structure

**Suite Organization:**
```typescript
// No automated test suites detected
```

**Patterns:**
- No automated testing patterns detected.

## Mocking

**Framework:** Not applicable.

**Patterns:**
- Not applicable.

**What to Mock:**
- Not applicable.

**What NOT to Mock:**
- Not applicable.

## Fixtures and Factories

**Test Data:**
```markdown
| Name             | Email                        | Password  |
|------------------|------------------------------|-----------|
| Sherlock Holmes  | sherlock@221b.co.uk          | sherlock  |
| Indiana Jones    | indy@archaeology.edu         | indiana   |
```

**Location:**
- Manual test data is documented in `local/test-players.md`.
- A seeding script for the Firebase emulator exists at `local/seed-players.mjs`.

## Coverage

**Requirements:** None enforced.

**View Coverage:**
```bash
# No coverage reporting tool configured
```

## Test Types

**Unit Tests:**
- None detected.

**Integration Tests:**
- None detected.

**E2E Tests:**
- None detected.

## Common Patterns

**Async Testing:**
- Not applicable.

**Error Testing:**
- Not applicable.

## Manual Testing (Current State)

The project currently relies on manual testing using the Firebase emulator.
1. **Seeding**: Use `local/seed-players.mjs` to populate the local database.
2. **Environment**: Use `.env.example` files in `apps/admin` and `apps/mobile` to configure connection to local/dev services.
3. **Verification**: Developers manually verify features by running the apps and interacting with the UI.

---

*Testing analysis: 2025-02-14*
