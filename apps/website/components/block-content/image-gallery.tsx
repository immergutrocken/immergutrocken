import NextImage from "next/image";
import { ReactNode, useState } from "react";

import { SanityImage } from "../../lib/shared/sanity-image-url";
import Bubble from "../shared/bubble";
import LightBox from "../shared/lightbox";

export interface ImageGalleryProps {
  node: {
    images: SanityImage[];
  };
}

const ImageGallery = (props: ImageGalleryProps): ReactNode => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null,
  );

  return (
    <>
      <div className="mt-9 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
        {props.node.images.map((image, index) => (
          <div
            className="relative cursor-pointer"
            key={index}
            onClick={() => {
              setShowLightbox(true);
              setCurrentImageIndex(index);
            }}
            onKeyDown={(e) => {
              if (e.key === "enter") {
                setShowLightbox(true);
                setCurrentImageIndex(index);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <div className="relative h-48 md:h-64 xl:h-96">
              <NextImage
                src={image.urlPreview}
                style={{ fill: "responsive", objectFit: "cover" }}
                fill={true}
                placeholder="blur"
                blurDataURL={image.urlPreviewBlur}
                alt={image.alt}
              />
            </div>
            <Bubble className="absolute right-1 top-1" size="small">
              <em className="fas fa-expand-alt"></em>
            </Bubble>
          </div>
        ))}
      </div>
      <LightBox
        images={props.node.images}
        imageIndex={currentImageIndex}
        show={showLightbox}
        onShow={setShowLightbox}
        onCurrentImageIndexChange={setCurrentImageIndex}
      ></LightBox>
    </>
  );
};

export default ImageGallery;
