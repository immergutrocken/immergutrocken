import { ReactNode } from "react";

import BlockContent from "@sanity/block-content-to-react";

import AlignCenter from "./alignCenter";
import BlockExpander from "./expander";
import ExternalLink from "./externalLink";
import ImageGallery from "./image-gallery";
import InternalLink from "./internalLink";
import Youtube from "./youtube";

export const serializers = {
  types: {
    imageGallery: ImageGallery,
    youtube: Youtube,
    expander: BlockExpander,
  },
  marks: {
    internalLink: InternalLink,
    link: ExternalLink,
    "align-center": AlignCenter,
  },
};

interface ContentProps {
  content: unknown[];
}

const Content = ({ content }: ContentProps): ReactNode => (
  <div className="font-content text-base sm:text-lg">
    <BlockContent
      blocks={content}
      serializers={serializers}
      projectId={process.env.SANITY_STUDIO_PROJECT_ID}
      dataset={process.env.SANITY_STUDIO_DATASET}
    />
  </div>
);

export default Content;
