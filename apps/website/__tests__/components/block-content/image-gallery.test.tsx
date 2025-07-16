import { fireEvent, render, screen } from "@testing-library/react";

import ImageGallery, {
  ImageGalleryProps,
} from "../../../components/block-content/image-gallery";

jest.mock("../../../components/shared/lightbox", () => "Lightbox");

describe("Image Gallery", () => {
  const mockProps: ImageGalleryProps = {
    node: {
      images: [
        {
          urlPreview: "https://example.com/image.jpg",
          urlPreviewBlur: "https://example.com/image-blur.jpg",
          alt: "Test image",
          credits: "Test credits",
          url: "https://example.com/image.jpg",
          urlBlur: "https://example.com/image-blur.jpg",
          hotspot: {
            x: 0,
            y: 0,
          },
          asset: {},
        },
        {
          urlPreview: "https://example.com/image2.jpg",
          urlPreviewBlur: "https://example.com/image2-blur.jpg",
          alt: "Second test image",
          credits: "Second test credits",
          url: "https://example.com/image2.jpg",
          urlBlur: "https://example.com/image2-blur.jpg",
          hotspot: {
            x: 0.5,
            y: 0.5,
          },
          asset: {},
        },
      ],
    },
  };

  it("renders correctly", () => {
    render(<ImageGallery node={mockProps.node} />);

    expect(screen.getByAltText("Test image")).toBeInTheDocument();
    expect(screen.getByAltText("Second test image")).toBeInTheDocument();
  });

  it("opens lightbox on image click", () => {
    render(<ImageGallery node={mockProps.node} />);

    const firstImageContainer = screen
      .getByAltText("Test image")
      .closest('[role="button"]');
    fireEvent.click(firstImageContainer!);

    const lightbox = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === "lightbox",
    );
    expect(lightbox).toBeInTheDocument();
  });

  it("opens lightbox on Enter key press", () => {
    render(<ImageGallery node={mockProps.node} />);

    const firstImageContainer = screen
      .getByAltText("Test image")
      .closest('[role="button"]');
    fireEvent.keyDown(firstImageContainer!, { key: "Enter" });

    const lightbox = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === "lightbox",
    );
    expect(lightbox).toBeInTheDocument();
  });

  it("does not open lightbox on other key press", () => {
    render(<ImageGallery node={mockProps.node} />);

    const firstImageContainer = screen
      .getByAltText("Test image")
      .closest('[role="button"]');
    fireEvent.keyDown(firstImageContainer!, { key: "Space" });

    // Lightbox should not be shown (show prop should be false)
    const lightbox = screen.getByText(
      (content, element) => element?.tagName.toLowerCase() === "lightbox",
    );
    expect(lightbox).toBeInTheDocument();
  });
});
