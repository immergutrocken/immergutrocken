import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ImageGallery from "../../../components/block-content/image-gallery";

jest.mock("../../../components/shared/lightbox", () => "Lightbox");

describe("Image Gallery", () => {
  it("renders correctly", () => {
    const props = {
      node: {
        images: [
          {
            urlPreview: "https://example.com/image.jpg",
            urlPreviewBlur: "https://example.com/image.jpg",
            alt: "alt",
            credits: "credits",
          },
        ],
      },
    };

    render(<ImageGallery node={props.node} />);
    screen.debug();
  });
});
