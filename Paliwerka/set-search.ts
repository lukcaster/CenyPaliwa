import { Page } from "playwright";

export class SetSearch {
    readonly page: Page;
    readonly town: string;
    readonly fuelType: string;

    constructor(page, town, fuelType) {
        this.page = page;
        this.town = town;
        this.fuelType = fuelType;
    }

    async inputTown() {
        await this.page.getByPlaceholder('Wpisz nazwę lub adres stacji').click();

        await this.page.keyboard.insertText(this.town);

        await this.page.keyboard.press('Enter');

        await this.page.waitForLoadState('domcontentloaded', { timeout: 1000000 });

        await this.page.waitForTimeout(3000);
    }

    async selectFuelType() {
        await this.page.getByRole('combobox').waitFor();

        await this.page.getByRole('combobox').selectOption(this.fuelType);

        await this.page.waitForLoadState('domcontentloaded', { timeout: 1000000 });
    }
}