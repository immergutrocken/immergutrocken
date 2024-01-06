import { Locator } from "@playwright/test";

export abstract class Panel {
    constructor(protected _parentLocator: Locator) { }

    public abstract get root(): Locator;
}