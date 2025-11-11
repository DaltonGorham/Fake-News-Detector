import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// This runs before any test file is executed

// Mock environment variables for tests
import.meta.env.VITE_SUPABASE_URL = 'https://mock-supabase-url.supabase.co';
import.meta.env.VITE_SUPABASE_ANON_KEY = 'mock-anon-key';
import.meta.env.VITE_API_BASE_URL = 'http://localhost:8000';



// we use the .extend here so we get a lot more testing functions like .toBeInTheDocument() 
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
