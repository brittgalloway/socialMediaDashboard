// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Social Media Dashboard', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for Alpine.js to initialise
    await page.waitForFunction(() => document.body.hasAttribute('x-data'));
  });


  // ── Theme ──────────────────────────────────────────────────

  test.describe('Theme toggle', () => {

    test('default theme is light', async ({ page }) => {
      await expect(page.locator('body')).not.toHaveClass(/dark/);
    });

    test('clicking toggle switches to dark mode', async ({ page }) => {
      await page.getByRole('switch', { name: /dark mode/i }).click();
      await expect(page.locator('body')).toHaveClass(/dark/);
    });

    test('clicking toggle again switches back to light mode', async ({ page }) => {
      const toggle = page.getByRole('switch', { name: /dark mode/i });
      await toggle.click();
      await expect(page.locator('body')).toHaveClass(/dark/);
      await toggle.click();
      await expect(page.locator('body')).not.toHaveClass(/dark/);
    });

    test('toggle aria-checked reflects current theme', async ({ page }) => {
      const toggle = page.getByRole('switch', { name: /dark mode/i });
      await expect(toggle).toHaveAttribute('aria-checked', 'false');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    test('toggle is keyboard accessible', async ({ page }) => {
      const toggle = page.getByRole('switch', { name: /dark mode/i });
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('body')).toHaveClass(/dark/);
    });

  });


  // ── Follower cards ─────────────────────────────────────────

  test.describe('Follower cards', () => {

    test('renders 4 follower cards', async ({ page }) => {
      await expect(page.locator('.follower-card')).toHaveCount(4);
    });

    test('renders correct platforms', async ({ page }) => {
      const platforms = ['facebook', 'twitter', 'instagram', 'youtube'];
      for (const platform of platforms) {
        await expect(
          page.locator(`.follower-card--${platform}`)
        ).toBeVisible();
      }
    });

    test('renders correct follower counts', async ({ page }) => {
      const cards = page.locator('.follower-card');
      await expect(cards.nth(0).locator('.follower-card__number')).toHaveText('1987');
      await expect(cards.nth(1).locator('.follower-card__number')).toHaveText('1044');
      await expect(cards.nth(2).locator('.follower-card__number')).toHaveText('11k');
      await expect(cards.nth(3).locator('.follower-card__number')).toHaveText('8239');
    });

    test('renders correct handles', async ({ page }) => {
      const cards = page.locator('.follower-card');
      await expect(cards.nth(0).locator('.follower-card__handle span')).toHaveText('@nathanf');
      await expect(cards.nth(1).locator('.follower-card__handle span')).toHaveText('@nathanf');
      await expect(cards.nth(2).locator('.follower-card__handle span')).toHaveText('@realnathanf');
      await expect(cards.nth(3).locator('.follower-card__handle span')).toHaveText('Nathan F.');
    });

    test('up changes are green', async ({ page }) => {
      // Facebook, Twitter, Instagram are all up
      const upCards = page.locator('.follower-card .follower-card__change.is-up');
      await expect(upCards).toHaveCount(3);
      for (const card of await upCards.all()) {
        await expect(card).toHaveCSS('color', 'rgb(30, 188, 138)'); // --color-lime-green
      }
    });

    test('down changes are red', async ({ page }) => {
      // YouTube is down
      const downCard = page.locator('.follower-card--youtube .follower-card__change.is-down');
      await expect(downCard).toBeVisible();
      await expect(downCard).toHaveCSS('color', 'rgb(220, 55, 67)'); // --color-bright-red
    });

    test('total followers count is displayed in header', async ({ page }) => {
      // 1987 + 1044 + 11000 + 8239 = 22,270
      await expect(page.locator('.site-header__subheading')).toContainText('22,270');
    });

  });


  // ── Overview cards ─────────────────────────────────────────

  test.describe('Overview cards', () => {

    test('renders 8 overview cards', async ({ page }) => {
      await expect(page.locator('.overview-card')).toHaveCount(8);
    });

    test('renders correct metrics', async ({ page }) => {
      const metrics = [
        'Page Views', 'Likes', 'Likes', 'Profile Views',
        'Retweets', 'Likes', 'Likes', 'Total Views',
      ];
      const cards = page.locator('.overview-card');
      for (let i = 0; i < metrics.length; i++) {
        await expect(
          cards.nth(i).locator('.overview-card__metric')
        ).toHaveText(metrics[i]);
      }
    });

    test('renders correct counts', async ({ page }) => {
      const counts = ['87', '52', '5462', '52k', '117', '507', '107', '1407'];
      const cards = page.locator('.overview-card');
      for (let i = 0; i < counts.length; i++) {
        await expect(
          cards.nth(i).locator('.overview-card__number')
        ).toHaveText(counts[i]);
      }
    });

    test('up changes are green', async ({ page }) => {
      const upChanges = page.locator('.overview-card .overview-card__change.is-up');
      for (const change of await upChanges.all()) {
        await expect(change).toHaveCSS('color', 'rgb(30, 188, 138)');
      }
    });

    test('down changes are red', async ({ page }) => {
      const downChanges = page.locator('.overview-card .overview-card__change.is-down');
      for (const change of await downChanges.all()) {
        await expect(change).toHaveCSS('color', 'rgb(220, 55, 67)');
      }
    });

  });


  // ── Tooltip ────────────────────────────────────────────────

  test.describe('Tooltip', () => {

    test('tooltip is hidden on load', async ({ page }) => {
      await expect(page.locator('.tooltip')).toBeHidden();
    });

    test('tooltip appears when a follower card is clicked', async ({ page }) => {
      await page.locator('.follower-card').first().click();
      await expect(page.locator('.tooltip')).toBeVisible();
      await expect(page.locator('.tooltip')).toHaveText('Display only');
    });

    test('tooltip appears when an overview card is clicked', async ({ page }) => {
      await page.locator('.overview-card').first().click();
      await expect(page.locator('.tooltip')).toBeVisible();
      await expect(page.locator('.tooltip')).toHaveText('Display only');
    });

    test('tooltip disappears after 1 second', async ({ page }) => {
      await page.locator('.follower-card').first().click();
      await expect(page.locator('.tooltip')).toBeVisible();
      await page.waitForTimeout(1200); // slight buffer over 1000ms
      await expect(page.locator('.tooltip')).toBeHidden();
    });

    test('clicking another card resets the timer', async ({ page }) => {
      const cards = page.locator('.follower-card');
      await cards.first().click();
      await page.waitForTimeout(600);
      // Click a second card before tooltip disappears
      await cards.nth(1).click();
      await page.waitForTimeout(600);
      // Should still be visible — timer was reset
      await expect(page.locator('.tooltip')).toBeVisible();
    });

    test('tooltip is keyboard triggerable on follower card', async ({ page }) => {
      const card = page.locator('.follower-card').first();
      await card.focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('.tooltip')).toBeVisible();
    });

    test('tooltip is near the card that triggered it', async ({ page }) => {
      const card = page.locator('.follower-card').first();
      const cardBox = await card.boundingBox();
      await card.click();

      const tooltip = page.locator('.tooltip');
      await expect(tooltip).toBeVisible();
      const tooltipBox = await tooltip.boundingBox();

      // Tooltip should be within 60px vertically of the card
      const verticalDistance = Math.abs(
        tooltipBox.y - (cardBox.y + cardBox.height)
      );
      expect(verticalDistance).toBeLessThan(60);

      // Tooltip should overlap horizontally with the card
      const tooltipCenter = tooltipBox.x + tooltipBox.width / 2;
      expect(tooltipCenter).toBeGreaterThan(cardBox.x);
      expect(tooltipCenter).toBeLessThan(cardBox.x + cardBox.width);
    });

  });


  // ── Responsive layout ──────────────────────────────────────

  test.describe('Responsive grid', () => {

    test('follower cards stack to 1 column on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      const grid = page.locator('.followers-grid');
      const cols = await grid.evaluate(el =>
        getComputedStyle(el).gridTemplateColumns
      );
      // 1 column = one value with no spaces
      expect(cols.trim().split(' ').length).toBe(1);
    });

    test('follower cards show 2 columns at tablet', async ({ page }) => {
      await page.setViewportSize({ width: 700, height: 900 });
      const grid = page.locator('.followers-grid');
      const cols = await grid.evaluate(el =>
        getComputedStyle(el).gridTemplateColumns
      );
      expect(cols.trim().split(' ').length).toBe(2);
    });

    test('follower cards show 4 columns at desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      const grid = page.locator('.followers-grid');
      const cols = await grid.evaluate(el =>
        getComputedStyle(el).gridTemplateColumns
      );
      expect(cols.trim().split(' ').length).toBe(4);
    });

  });

});