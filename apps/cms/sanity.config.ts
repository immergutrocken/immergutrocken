/// <reference types="vite/client" />

import { defineConfig, PluginOptions, WorkspaceOptions } from "sanity";
import { structureTool } from "sanity/structure";

import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";

import { ImmergutLogo } from "./components/immergutLogo";
import deskStructure from "./deskStructure";
import schema from "./schemas/schema";

const commonWorkspace: WorkspaceOptions & { plugins: PluginOptions[] } = {
  title: "Immergutrocken",
  projectId: "05hvmwlk",
  name: process.env.SANITY_STUDIO_DATASET ?? "immergutrocken",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "",
  basePath: "/",
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    assist(),
  ],
  schema: {
    types: schema,
  },
  studio: {
    components: {
      logo: ImmergutLogo,
    },
  },
};

const pluginsWithVisionTool = [...commonWorkspace.plugins, visionTool()];

export default defineConfig(
  import.meta.env.DEV
    ? [
        {
          ...commonWorkspace,
          title: "DEV - Immergutrocken",
          dataset: process.env.SANITY_STUDIO_DATASET_DEVELOPMENT ?? "",
          name:
            process.env.SANITY_STUDIO_DATASET_DEVELOPMENT ?? "immergutrocken",
          basePath: "/dev",
          plugins: pluginsWithVisionTool,
        },
        {
          ...commonWorkspace,
          title: "PREVIEW - Immergutrocken",
          dataset: process.env.SANITY_STUDIO_DATASET_PREVIEW ?? "",
          name: process.env.SANITY_STUDIO_DATASET_PREVIEW ?? "immergutrocken",
          basePath: "/preview",
          plugins: pluginsWithVisionTool,
        },
        {
          ...commonWorkspace,
          title: "PRODUCTION - Immergutrocken",
          dataset: process.env.SANITY_STUDIO_DATASET_PRODUCTION ?? "",
          name:
            process.env.SANITY_STUDIO_DATASET_PRODUCTION ?? "immergutrocken",
          basePath: "/production",
          plugins: pluginsWithVisionTool,
        },
      ]
    : [commonWorkspace]
);
