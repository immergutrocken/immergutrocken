import BlockContent from "@sanity/block-content-to-react";
import AlignCenter from "./alignCenter";
import BlockExpander from "./expander";
import ImageGallery from "./imageGallery";
import InternalLink from "./internalLink";
import Youtube from "./youtube";
import ExternalLink from "./externalLink";

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
  content: [];
}

const Content = ({ content }: ContentProps): JSX.Element => (
  <div className="font-content text-base sm:text-lg">
    <BlockContent
      blocks={content}
      serializers={serializers}
      projectId={process.env.SANITY_PROJECT_ID}
      dataset={process.env.SANITY_DATASET}
    />
  </div>
);

export default Content;
