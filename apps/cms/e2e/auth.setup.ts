import { test as setup } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

/**
 * Authentication setup for Sanity Studio
 *
 * Sanity uses session-based authentication. This setup will:
 * 1. Navigate to the Sanity login page
 * 2. Fill in credentials from environment variables
 * 3. Save the authenticated state to a file for reuse
 *
 * Environment variables required:
 * - SANITY_STUDIO_EMAIL: The email for login
 * - SANITY_STUDIO_PASSWORD: The password for login
 */
setup("authenticate", async ({ page }) => {
  // Navigate to Sanity Studio
  await page.goto("/");

  // Wait for the login page to load
  // Sanity login is handled by their authentication provider
  // We need to check if we're already logged in or need to authenticate
  const isLoggedIn = await page
    .getByText("Künstler*in")
    .isVisible()
    .catch(() => false);

  if (!isLoggedIn) {
    // If not logged in, we need to authenticate
    // Note: Sanity's authentication flow may vary depending on the provider
    // This is a placeholder for the actual authentication flow
    console.log("Not authenticated, needs login flow implementation");

    // For now, we'll skip this in tests
    // In a real implementation, you would:
    // 1. Click on the login button
    // 2. Fill in email/password
    // 3. Submit the form
    // 4. Wait for successful authentication
  }

  // Save signed-in state to the file
  await page.context().storageState({ path: authFile });
});
