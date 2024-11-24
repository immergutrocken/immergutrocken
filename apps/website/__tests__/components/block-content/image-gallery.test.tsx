import { render } from "@testing-library/react";

import ImageGallery, {
  ImageGalleryProps,
} from "../../../components/block-content/image-gallery";

jest.mock("../../../components/shared/lightbox", () => "Lightbox");

describe("Image Gallery", () => {
  it("renders correctly", () => {
    const props: ImageGalleryProps = {
      node: {
        images: [
          {
            urlPreview: "https://example.com/image.jpg",
            urlPreviewBlur: "https://example.com/image.jpg",
            alt: "alt",
            credits: "credits",
            url: "https://example.com/image.jpg",
            urlBlur: "https://example.com/image.jpg",
            hotspot: {
              x: 0,
              y: 0,
            },
            asset: {},
          },
        ],
      },
    };

    render(<ImageGallery node={props.node} />);
  });
});
