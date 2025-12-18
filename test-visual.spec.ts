import { test } from '@playwright/test';

test.describe('Charles Portfolio Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
    // Wait for animations to settle
    await page.waitForTimeout(3000);
  });

  test('capture home page and check hero layout', async ({ page }) => {
    // Take full page screenshot
    await page.screenshot({ path: 'test-results/charles-home-full.png', fullPage: true });

    // Check hero section specifically
    const hero = page.locator('section').first();
    await hero.screenshot({ path: 'test-results/charles-hero.png' });

    // Check if floating badges container exists and is visible
    const floatingBadgesContainer = page.locator('.perspective-2000').first();
    const isVisible = await floatingBadgesContainer.isVisible();
    console.log('Floating badges container visible:', isVisible);

    if (isVisible) {
      const box = await floatingBadgesContainer.boundingBox();
      console.log('Floating badges container bounding box:', box);
      await floatingBadgesContainer.screenshot({ path: 'test-results/charles-floating-badges.png' });
    }

    // Check social links
    const socialLinks = page.locator('a[aria-label]');
    const socialCount = await socialLinks.count();
    console.log('Social links count:', socialCount);

    // Check individual floating elements
    const floatingElements = page.locator('.absolute').filter({ hasText: /(React|TypeScript|Supabase|Node\.js)/ });
    const floatingCount = await floatingElements.count();
    console.log('Tech badges count:', floatingCount);

    // Get positions of floating badges
    for (let i = 0; i < Math.min(floatingCount, 5); i++) {
      const element = floatingElements.nth(i);
      const text = await element.textContent();
      const box = await element.boundingBox();
      console.log(`Badge "${text}" position:`, box);
    }
  });

  test('check viewport at different sizes', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/charles-desktop.png' });

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/charles-tablet.png' });

    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-results/charles-mobile.png' });
  });

  test('inspect CSS computed styles', async ({ page }) => {
    // Check the Floating component wrapper
    const floatingWrappers = page.locator('[class*="absolute"]').filter({ hasText: /React|TypeScript/ });
    const count = await floatingWrappers.count();

    console.log('\n=== Inspecting floating badge styles ===');

    for (let i = 0; i < Math.min(count, 3); i++) {
      const element = floatingWrappers.nth(i);
      const computedStyle = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          position: style.position,
          left: style.left,
          top: style.top,
          right: style.right,
          bottom: style.bottom,
          transform: style.transform,
          display: style.display,
        };
      });
      const text = await element.textContent();
      console.log(`Badge "${text?.trim()}" computed styles:`, computedStyle);
    }
  });
});
