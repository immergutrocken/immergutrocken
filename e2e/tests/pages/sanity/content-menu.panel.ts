import { Locator, Page } from "@playwright/test";

export class ContentMenuPanel {
  constructor(private _parentLocator: Locator) {}

  public get root(): Locator {
    return this._parentLocator.getByTestId("structure-tool-list-pane");
  }

  public get btnKuenstler(): Locator {
    return this.root.getByRole("link", { name: "Künstler*in" });
  }

  public get btnSortierungen(): Locator {
    return this.root.getByRole("link", { name: "Sortierungen" });
  }
}
