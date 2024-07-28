import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { media } from "sanity-plugin-media";
import { vercelDeployTool } from "sanity-plugin-vercel-deploy";
import { structureTool } from "sanity/structure";
import { ImmergutLogo } from "./components/immergutLogo";
import deskStructure from "./deskStructure";
import schema from "./schemas/schema";

const getConfig = () => {
  if (import.meta.env.DEV) {
    return [
      {
        title: "DEV - Immergutrocken",
        projectId: "05hvmwlk",
        dataset: "development",
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
        title: "STAGING - Immergutrocken",
        projectId: "05hvmwlk",
        dataset: "staging",
        name: "staging",
        basePath: "/staging",
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
        projectId: "05hvmwlk",
        dataset: "production",
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
        projectId: "05hvmwlk",
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
