import { expect, test } from '@playwright/test';
import { ArtistScenario } from './scenarios/artist.scenario';
import { SortingScenario } from './scenarios/sorting.scenario';

test('anlegen, ansehen und löschen', async ({ page }) => {
    const now: string = Date.now() + '';
    const prefix: string = `e2e-${now}`

    await ArtistScenario.createArtist(page, prefix);
    await SortingScenario.addArtist(page, prefix);

    await page.goto(`${process.env.FRONTEND_BASE_URL}`);
    await page.getByRole('link', { name: prefix }).click();
    await new Promise(resolve => setTimeout(resolve, 5000));

    await SortingScenario.removeArtist(page, prefix);
    await ArtistScenario.deleteArtist(page, prefix);
});