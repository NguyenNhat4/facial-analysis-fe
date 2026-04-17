const { test, expect } = require('@playwright/test');

test('demo page loads', async ({ page }) => {
  await page.goto('http://localhost:5173/demo');
  await page.waitForTimeout(5000);
});
