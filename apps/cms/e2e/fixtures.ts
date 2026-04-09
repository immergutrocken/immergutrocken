import { test as base } from "@playwright/test";

/**
 * Extend the base test to include authentication state
 * This allows tests to reuse authentication state across tests
 */
export const test = base;

export { expect } from "@playwright/test";
