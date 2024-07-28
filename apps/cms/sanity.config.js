import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { media } from "sanity-plugin-media";
import { vercelDeployTool } from "sanity-plugin-vercel-deploy";
import { structureTool } from "sanity/structure";
import { ImmergutLogo } from "./components/immergutLogo";
import deskStructure from "./deskStructure";
import schema from "./schemas/schema";

// TODO make this typesafe and more DRY
const getConfig = () => {
  if (import.meta.env.DEV) {
    return [
      {
        title: "DEV - Immergutrocken",
        projectId: process.env.SANITY_STUDIO_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET_DEVELOPMENT,
        name: "development",
        basePath: "/dev",
        plugins: [
          structureTool({
            structure: deskStructure,
          }),
          visionTool(),
          media(),
          vercelDeployTool(),
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
        title: "PREVIEW - Immergutrocken",
        projectId: process.env.SANITY_STUDIO_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET_PREVIEW,
        name: "preview",
        basePath: "/preview",
        plugins: [
          structureTool({
            structure: deskStructure,
          }),
          visionTool(),
          media(),
          vercelDeployTool(),
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
        projectId: process.env.SANITY_STUDIO_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET_PRODUCTION,
        name: "production",
        basePath: "/production",
        plugins: [
          structureTool({
            structure: deskStructure,
          }),
          visionTool(),
          media(),
          vercelDeployTool(),
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
  } else {
    return [
      {
        title: "Immergutrocken",
        projectId: process.env.SANITY_STUDIO_PROJECT_ID,
        dataset: process.env.SANITY_STUDIO_DATASET,
        plugins: [
          structureTool({
            structure: deskStructure,
          }),
          media(),
          vercelDeployTool(),
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
  }
};

export default defineConfig(getConfig());
