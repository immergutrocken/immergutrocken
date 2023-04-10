import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import schema from "./schemas/schema";
import deskStructure from "./deskStructure";
import { ImmergutLogo } from "./components/immergutLogo";

export default defineConfig({
  title: "Immergutrocken",
  projectId: "05hvmwlk",
  dataset: "development",
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
});
