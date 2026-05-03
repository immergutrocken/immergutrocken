/// <reference types="vite/client" />

import { defineConfig, PluginOptions, WorkspaceOptions } from "sanity";
import { structureTool } from "sanity/structure";

import { assist } from "@sanity/assist";
import { deDELocale } from "@sanity/locale-de-de";
import { visionTool } from "@sanity/vision";

import { vercelDeployTool } from "sanity-plugin-vercel-deploy";
import { ImmergutLogo } from "./components/immergutLogo";
import deskStructure from "./deskStructure";
import schema from "./schemas/schema";

const commonWorkspace: WorkspaceOptions & { plugins: PluginOptions[] } = {
  title: "Immergutrocken",
  projectId: "05hvmwlk",
  name: process.env.SANITY_STUDIO_DATASET ?? "immergutrocken",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "immergutrocken",
  basePath: "/",
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    assist(),
    deDELocale(),
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
  document: {
    actions: (prev, context) => {
      return ["sortings", "generalSettings", "verein"].includes(
        context.schemaType,
      )
        ? prev.filter(
            (action) =>
              !["delete", "duplicate", "unpublish"].includes(
                action.action ?? "",
              ),
          )
        : prev;
    },
  },
};

const pluginsWithVisionTool = [...commonWorkspace.plugins, visionTool()];

export default defineConfig(
  import.meta.env.DEV
    ? [
        {
          ...commonWorkspace,
          title: "DEV",
          dataset:
            process.env.SANITY_STUDIO_DATASET_DEVELOPMENT ?? "development",
          name: "dev",
          basePath: "/dev",
          plugins: pluginsWithVisionTool,
        },
        {
          ...commonWorkspace,
          title: "E2E",
          dataset: process.env.SANITY_STUDIO_DATASET_DEVELOPMENT ?? "e2e-test",
          name: "e2e-test",
          basePath: "/e2e",
          plugins: pluginsWithVisionTool,
        },
        {
          ...commonWorkspace,
          title: "PREVIEW",
          dataset: process.env.SANITY_STUDIO_DATASET_PREVIEW ?? "development",
          name: "preview",
          basePath: "/preview",
          plugins: pluginsWithVisionTool,
        },
        {
          ...commonWorkspace,
          title: "PRODUCTION",
          dataset:
            process.env.SANITY_STUDIO_DATASET_PRODUCTION ?? "immergutrocken",
          name: "production",
          basePath: "/production",
          plugins: pluginsWithVisionTool,
        },
      ]
    : [commonWorkspace],
);
