import { sanityClientFetchMock } from "../../jest.setup";
import { MenuItemType } from "../../lib/enums/menuItemType.enum";
import { getMenu } from "../../lib/menu";

describe("Menu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getMenu", () => {
    it("should return menu items with external links", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Externe Seite",
                en: "External Page",
              },
              _type: "link",
              url: "https://example.com",
            },
          ],
          menuEntryRefs: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      const result = await getMenu();

      expect(sanityClientFetchMock).toHaveBeenCalledWith(
        expect.stringContaining("[_type == 'menu']"),
      );
      expect(result).toEqual([
        {
          title: {
            de: "Externe Seite",
            en: "External Page",
          },
          type: MenuItemType.EXTERNAL_LINK,
          url: "https://example.com",
        },
      ]);
    });

    it("should return menu items with internal links", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Artikel",
                en: "Article",
              },
              _type: "internalLink",
              reference: {
                _ref: "article-ref-123",
              },
            },
          ],
          menuEntryRefs: [
            {
              _id: "article-ref-123",
              _type: "article",
              slug: {
                current: "test-article",
              },
            },
          ],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      const result = await getMenu();

      expect(result).toEqual([
        {
          title: {
            de: "Artikel",
            en: "Article",
          },
          type: MenuItemType.INTERNAL_LINK,
          slug: "test-article",
          documentType: "article",
          url: null,
        },
      ]);
    });

    it("should return menu items with internal links and custom URL", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Artikel",
                en: "Article",
              },
              _type: "internalLink",
              reference: {
                _ref: "article-ref-123",
              },
              url: "/custom-url",
            },
          ],
          menuEntryRefs: [
            {
              _id: "article-ref-123",
              _type: "article",
              slug: {
                current: "test-article",
              },
            },
          ],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      const result = await getMenu();

      expect(result).toEqual([
        {
          title: {
            de: "Artikel",
            en: "Article",
          },
          type: MenuItemType.INTERNAL_LINK,
          slug: "test-article",
          documentType: "article",
          url: "/custom-url",
        },
      ]);
    });

    it("should return menu items with internal links when reference is not found", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Artikel",
                en: "Article",
              },
              _type: "internalLink",
              reference: {
                _ref: "non-existent-ref",
              },
            },
          ],
          menuEntryRefs: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      const result = await getMenu();

      expect(result).toEqual([
        {
          title: {
            de: "Artikel",
            en: "Article",
          },
          type: MenuItemType.INTERNAL_LINK,
          slug: null,
          documentType: null,
          url: null,
        },
      ]);
    });

    it("should return menu items with submenu", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Submenu",
                en: "Submenu",
              },
              _type: "submenu",
              _ref: "submenu-1",
            },
          ],
          menuEntryRefs: [],
        },
        {
          _id: "submenu-1",
          displayName: {
            de: "Untermenü",
            en: "Submenu",
          },
          isMainMenu: false,
          menuEntries: [
            {
              title: {
                de: "Unterseite",
                en: "Subpage",
              },
              _type: "link",
              url: "https://subpage.com",
            },
          ],
          menuEntryRefs: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      const result = await getMenu();

      expect(result).toEqual([
        {
          title: {
            de: "Untermenü",
            en: "Submenu",
          },
          type: MenuItemType.SUBMENU,
          submenuItems: [
            {
              title: {
                de: "Unterseite",
                en: "Subpage",
              },
              type: MenuItemType.EXTERNAL_LINK,
              url: "https://subpage.com",
            },
          ],
        },
      ]);
    });

    it("should return nested submenu items", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Submenu",
                en: "Submenu",
              },
              _type: "submenu",
              _ref: "submenu-1",
            },
          ],
          menuEntryRefs: [],
        },
        {
          _id: "submenu-1",
          displayName: {
            de: "Untermenü",
            en: "Submenu",
          },
          isMainMenu: false,
          menuEntries: [
            {
              title: {
                de: "Nested Submenu",
                en: "Nested Submenu",
              },
              _type: "submenu",
              _ref: "submenu-2",
            },
          ],
          menuEntryRefs: [],
        },
        {
          _id: "submenu-2",
          displayName: {
            de: "Verschachteltes Untermenü",
            en: "Nested Submenu",
          },
          isMainMenu: false,
          menuEntries: [
            {
              title: {
                de: "Tiefe Seite",
                en: "Deep Page",
              },
              _type: "link",
              url: "https://deep.com",
            },
          ],
          menuEntryRefs: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      const result = await getMenu();

      expect(result).toEqual([
        {
          title: {
            de: "Untermenü",
            en: "Submenu",
          },
          type: MenuItemType.SUBMENU,
          submenuItems: [
            {
              title: {
                de: "Verschachteltes Untermenü",
                en: "Nested Submenu",
              },
              type: MenuItemType.SUBMENU,
              submenuItems: [
                {
                  title: {
                    de: "Tiefe Seite",
                    en: "Deep Page",
                  },
                  type: MenuItemType.EXTERNAL_LINK,
                  url: "https://deep.com",
                },
              ],
            },
          ],
        },
      ]);
    });

    it("should return mixed menu items", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Externe Seite",
                en: "External Page",
              },
              _type: "link",
              url: "https://example.com",
            },
            {
              title: {
                de: "Artikel",
                en: "Article",
              },
              _type: "internalLink",
              reference: {
                _ref: "article-ref-123",
              },
            },
            {
              title: {
                de: "Submenu",
                en: "Submenu",
              },
              _type: "submenu",
              _ref: "submenu-1",
            },
          ],
          menuEntryRefs: [
            {
              _id: "article-ref-123",
              _type: "article",
              slug: {
                current: "test-article",
              },
            },
          ],
        },
        {
          _id: "submenu-1",
          displayName: {
            de: "Untermenü",
            en: "Submenu",
          },
          isMainMenu: false,
          menuEntries: [
            {
              title: {
                de: "Unterseite",
                en: "Subpage",
              },
              _type: "link",
              url: "https://subpage.com",
            },
          ],
          menuEntryRefs: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      const result = await getMenu();

      expect(result).toEqual([
        {
          title: {
            de: "Externe Seite",
            en: "External Page",
          },
          type: MenuItemType.EXTERNAL_LINK,
          url: "https://example.com",
        },
        {
          title: {
            de: "Artikel",
            en: "Article",
          },
          type: MenuItemType.INTERNAL_LINK,
          slug: "test-article",
          documentType: "article",
          url: null,
        },
        {
          title: {
            de: "Untermenü",
            en: "Submenu",
          },
          type: MenuItemType.SUBMENU,
          submenuItems: [
            {
              title: {
                de: "Unterseite",
                en: "Subpage",
              },
              type: MenuItemType.EXTERNAL_LINK,
              url: "https://subpage.com",
            },
          ],
        },
      ]);
    });

    it("should throw error when submenu is not found", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Submenu",
                en: "Submenu",
              },
              _type: "submenu",
              _ref: "non-existent-submenu",
            },
          ],
          menuEntryRefs: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      await expect(getMenu()).rejects.toThrow(
        "Submenu with id non-existent-submenu not found",
      );
    });

    it("should throw error when menu type is not implemented", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [
            {
              title: {
                de: "Unknown Type",
                en: "Unknown Type",
              },
              _type: "unknownType",
            },
          ],
          menuEntryRefs: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      await expect(getMenu()).rejects.toThrow(
        "The type undefined is not implemented",
      );
    });

    it("should handle empty menu entries", async () => {
      const mockMenuData = [
        {
          _id: "main-menu",
          displayName: {
            de: "Hauptmenü",
            en: "Main Menu",
          },
          isMainMenu: true,
          menuEntries: [],
          menuEntryRefs: [],
        },
      ];

      sanityClientFetchMock.mockResolvedValueOnce(mockMenuData);

      const result = await getMenu();

      expect(result).toEqual([]);
    });
  });
});
