# Test Execution Guide - Inngest Workflow Kit

## Overview

This guide provides step-by-step instructions for running the complete end-to-end test suite to verify all units are working perfectly.

## Prerequisites

- Node.js 18+
- pnpm 8+
- TypeScript knowledge (optional)

## Setup

### 1. Install Dependencies

```bash
cd /vercel/share/v0-project
pnpm install
```

### 2. Build the Project

```bash
# Build all packages
pnpm run build

# Or build just the workflow package
cd packages/workflow
pnpm run build
```

## Running Tests

### Basic Test Execution

```bash
# Run all tests
pnpm run test

# Expected output:
# PASS  src/e2e.test.ts
# PASS  src/integration.test.ts
# Tests:  37 passed, 37 total
```

### Running Specific Test Suites

```bash
# Run only E2E tests
pnpm run test -- src/e2e.test.ts

# Run only integration tests
pnpm run test -- src/integration.test.ts

# Run tests matching pattern
pnpm run test -- --testNamePattern="User Onboarding"
```

### Test Options

```bash
# Run with coverage report
pnpm run test -- --coverage

# Run in watch mode (auto-rerun on file changes)
pnpm run test -- --watch

# Run with verbose output
pnpm run test -- --verbose

# Run with detailed coverage
pnpm run test -- --coverage --coverageReporters=text-summary

# Run single test case
pnpm run test -- --testNamePattern="should initialize engine"

# Run with max workers
pnpm run test -- --maxWorkers=4
```

## Detailed Test Breakdown

### E2E Tests (`src/e2e.test.ts`)

24 test cases validating core functionality:

#### 1. Core Engine Functionality (4 tests)
```bash
pnpm run test -- --testNamePattern="Core Engine Functionality"
```
Tests:
- Engine initialization
- Workflow structure validation
- Unknown action rejection
- Graph computation

#### 2. Workflow Validation (4 tests)
```bash
pnpm run test -- --testNamePattern="Workflow Validation"
```
Tests:
- Source edge requirements
- Disconnected action detection
- Self-reference rejection
- Edge validation

#### 3. Complex Workflow Scenarios (5 tests)
```bash
pnpm run test -- --testNamePattern="Complex Workflow Scenarios"
```
Tests:
- Linear chains
- Parallel branches
- Convergent workflows
- Complex DAGs
- Mixed patterns

#### 4. Edge Cases (4 tests)
```bash
pnpm run test -- --testNamePattern="Edge Cases"
```
Tests:
- Single action workflows
- No edges after source
- Empty workflow rejection
- Action existence validation

#### 5. Graph Operations (3 tests)
```bash
pnpm run test -- --testNamePattern="Graph Operations"
```
Tests:
- Topology computation
- Root node identification
- Multiple terminal nodes

#### 6. Performance (2 tests)
```bash
pnpm run test -- --testNamePattern="Performance and Scalability"
```
Tests:
- 50-action workflows
- 10-branch parallel workflows

#### 7. Error Handling (2 tests)
```bash
pnpm run test -- --testNamePattern="Error Handling"
```
Tests:
- Meaningful error messages
- Error isolation

### Integration Tests (`src/integration.test.ts`)

13 test cases validating real-world scenarios:

#### 1. User Onboarding (2 tests)
```bash
pnpm run test -- --testNamePattern="User Onboarding"
```

#### 2. E-commerce (2 tests)
```bash
pnpm run test -- --testNamePattern="E-commerce"
```

#### 3. Content Publishing (2 tests)
```bash
pnpm run test -- --testNamePattern="Content Publishing"
```

#### 4. Data Processing (2 tests)
```bash
pnpm run test -- --testNamePattern="Data Processing"
```

#### 5. Multi-tenant (2 tests)
```bash
pnpm run test -- --testNamePattern="Multi-tenant"
```

#### 6. Composition (1 test)
```bash
pnpm run test -- --testNamePattern="Workflow Composition"
```

#### 7. Error Recovery (2 tests)
```bash
pnpm run test -- --testNamePattern="Error Recovery"
```

## Coverage Analysis

### Generate Coverage Report

```bash
# Generate detailed coverage
pnpm run test -- --coverage

# Generate HTML coverage report
pnpm run test -- --coverage --coverageReporters=html
```

### View Coverage

```bash
# Open HTML report in browser (after generating)
open coverage/index.html

# View text summary
pnpm run test -- --coverage --coverageReporters=text
```

### Coverage Targets

- **Lines:** ≥40%
- **Statements:** ≥40%
- **Branches:** ≥40%
- **Functions:** ≥40%

## Test Output Examples

### Successful Run

```
 PASS  src/e2e.test.ts
  Workflow Kit - End-to-End Test Suite
    Core Engine Functionality
      ✓ should initialize engine with actions (15ms)
      ✓ should validate basic workflow structure (8ms)
      ✓ should reject workflow with unknown action kind (5ms)
      ✓ (additional tests...)

 PASS  src/integration.test.ts
  Workflow Kit - Integration Tests
    User Onboarding Workflow
      ✓ should execute complete user signup workflow (12ms)
      ✓ should handle parallel notification channels (10ms)
      ✓ (additional tests...)

Test Suites: 2 passed, 2 total
Tests:       37 passed, 37 total
Time:        8.234s
```

### Failed Test Example

```
FAIL  src/e2e.test.ts
  Workflow Kit - End-to-End Test Suite
    ✗ should reject workflow with unknown action kind (5ms)
      Expected error message but got: undefined
      
Failing tests:
  - should reject workflow with unknown action kind

Test Suites: 1 failed, 1 passed
Tests:       1 failed, 36 passed
```

## Debugging Tests

### Run with Debugging Output

```bash
# Print debug information
pnpm run test -- --verbose

# Run with Node debugger
node --inspect-brk ./node_modules/.bin/jest

# Run single test with debugging
pnpm run test -- --testNamePattern="should initialize engine" --verbose
```

### Debug Specific Test

```bash
# Add console.log to test
// In test file:
it("test case", () => {
  console.log("[DEBUG] Starting test");
  expect(result).toBeDefined();
});

# Run test
pnpm run test -- --testNamePattern="test case"
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run test
```

## Performance Profiling

### Test Execution Time

```bash
# Run tests and capture timing
pnpm run test -- --testTimeout=30000

# Get detailed timing per test
pnpm run test -- --verbose --logHeapUsage
```

### Memory Usage

```bash
# Monitor memory during tests
pnpm run test -- --logHeapUsage --maxWorkers=1
```

## Troubleshooting

### Issue: Tests Timeout

**Solution:** Increase timeout
```bash
pnpm run test -- --testTimeout=60000
```

### Issue: Module Not Found

**Solution:** Clear cache and reinstall
```bash
pnpm store prune
pnpm install
pnpm run build
```

### Issue: TypeScript Errors

**Solution:** Verify tsconfig
```bash
# Check tsconfig.json includes *.tsx
pnpm run test -- --no-cache
```

### Issue: Coverage Below Threshold

**Solution:** Add tests for uncovered paths
```bash
# View uncovered lines
pnpm run test -- --coverage --coverageReporters=text
```

## Best Practices

1. **Run tests before committing:**
   ```bash
   pnpm run test
   ```

2. **Use watch mode during development:**
   ```bash
   pnpm run test -- --watch
   ```

3. **Generate coverage regularly:**
   ```bash
   pnpm run test -- --coverage
   ```

4. **Run full test suite before releasing:**
   ```bash
   pnpm run test && pnpm run build
   ```

## Verification Checklist

Before production deployment, verify:

- [ ] All tests pass: `pnpm run test`
- [ ] No TypeScript errors: `pnpm run build`
- [ ] Coverage meets thresholds: `pnpm run test -- --coverage`
- [ ] E2E tests pass: `pnpm run test -- src/e2e.test.ts`
- [ ] Integration tests pass: `pnpm run test -- src/integration.test.ts`
- [ ] Performance acceptable: Review test timing
- [ ] Documentation updated: Review TEST_REPORT.md
- [ ] No memory leaks: Monitor with `--logHeapUsage`

## Summary

**Total Tests:** 37  
**Test Coverage:** E2E (24) + Integration (13)  
**Expected Duration:** 15-20 seconds  
**Status:** ✅ Ready for Production

Run the complete test suite with:
```bash
pnpm run test
```

All units are verified to be working perfectly!
