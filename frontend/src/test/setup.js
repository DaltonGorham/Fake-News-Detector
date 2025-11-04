import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// This runs before any test file is executed



// we use the .extend here so we get a lot more testing functions like .toBeInTheDocument() 
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
