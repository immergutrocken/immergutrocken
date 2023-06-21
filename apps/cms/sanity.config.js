import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import schema from "./schemas/schema";
import deskStructure from "./deskStructure";
import { ImmergutLogo } from "./components/immergutLogo";

const getConfig = () => {
  if (import.meta.env.DEV)
    return [
      {
        title: "DEV - Immergutrocken",
        projectId: "05hvmwlk",
        dataset: "development",
        name: "development",
        basePath: "/dev",
        plugins: [
          deskTool({
            structure: deskStructure,
          }),
          visionTool(),
          media(),
        ],
        tools: (prev) => {
          if (import.meta.env.DEV) {
            return prev;
          }
          return prev.filter((tool) => tool.name !== "vision");
        },
        schema: {
          types: schema,
        },
        studio: {
          components: {
            logo: ImmergutLogo,
          },
        },
      },
      {
        title: "STAGING - Immergutrocken",
        projectId: "05hvmwlk",
        dataset: "staging",
        name: "staging",
        basePath: "/staging",
        plugins: [
          deskTool({
            structure: deskStructure,
          }),
          visionTool(),
          media(),
        ],
        tools: (prev) => {
          if (import.meta.env.DEV) {
            return prev;
          }
          return prev.filter((tool) => tool.name !== "vision");
        },
        schema: {
          types: schema,
        },
        studio: {
          components: {
            logo: ImmergutLogo,
          },
        },
      },
      {
        title: "PRODUCTION - Immergutrocken",
        projectId: "05hvmwlk",
        dataset: "production",
        name: "production",
        basePath: "/production",
        plugins: [
          deskTool({
            structure: deskStructure,
          }),
          visionTool(),
          media(),
        ],
        tools: (prev) => {
          if (import.meta.env.DEV) {
            return prev;
          }
          return prev.filter((tool) => tool.name !== "vision");
        },
        schema: {
          types: schema,
        },
        studio: {
          components: {
            logo: ImmergutLogo,
          },
        },
      },
    ];
  else
    return [
      {
        title: "Immergutrocken",
        projectId: "05hvmwlk",
        dataset: process.env.SANITY_STUDIO_DATASET,
        plugins: [
          deskTool({
            structure: deskStructure,
          }),
          media(),
        ],
        schema: {
          types: schema,
        },
        studio: {
          components: {
            logo: ImmergutLogo,
          },
        },
      },
    ];
};

export default defineConfig(getConfig());
