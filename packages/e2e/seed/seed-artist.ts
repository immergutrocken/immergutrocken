import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@sanity/client";

import "../load-env";
import { ARTIST_BANNER_ALT, ARTIST_SLUG, ARTIST_TITLE } from "./fixture-data";

const __dirname = dirname(fileURLToPath(import.meta.url));

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const token = process.env.SANITY_STUDIO_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET and SANITY_STUDIO_WRITE_TOKEN must be set (see .env.e2e.example). " +
      "This script is a one-time/manual seed for the e2e-test dataset and must never be pointed at production.",
  );
}

if (dataset !== "e2e-test") {
  throw new Error(
    `Refusing to seed dataset "${dataset}" — this script only seeds the "e2e-test" dataset.`,
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const emptyBlockContent = [
  {
    _type: "block",
    _key: "seedblock1",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "seedspan1",
        text: "This is static e2e test content, seeded for issue #551.",
        marks: [],
      },
    ],
  },
];

const seed = async (): Promise<void> => {
  const imageBuffer = readFileSync(join(__dirname, "fixtures/banner.png"));
  const asset = await client.assets.upload("image", imageBuffer, {
    filename: "e2e-test-banner.png",
  });

  await client.createOrReplace({
    _id: "e2e-general-settings",
    _type: "generalSettings",
    languages: {
      de: {
        websiteTitle: "Immergutrocken (e2e)",
        bannerDesktop: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
        bannerMobile: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
      },
    },
    displayMode: "artists",
    isPerformanceDetailsVisible: true,
  });

  await client.createOrReplace({
    _id: "e2e-test-artist",
    _type: "artist",
    languages: {
      de: {
        title: ARTIST_TITLE,
        banner: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: ARTIST_BANNER_ALT,
          credits: "E2E fixture",
        },
        content: emptyBlockContent,
      },
    },
    slug: { _type: "slug", current: ARTIST_SLUG },
    category: "music",
  });

  console.log(`Seeded artist "${ARTIST_TITLE}" (slug: ${ARTIST_SLUG}) in dataset "${dataset}".`);
};

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
