import NextImage from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Bubble from "../shared/bubble";
import Label from "../shared/label";

interface ImageGalleryProps {
  node: {
    images;
  };
}

const ImageGallery = (props: ImageGalleryProps): JSX.Element => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 mt-9">
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
                layout="fill"
                objectFit="cover"
                placeholder="blur"
                blurDataURL={image.urlPreviewBlur}
              />
            </div>
            <Bubble className="absolute right-1 top-1" size="small">
              <em className="fas fa-expand-alt"></em>
            </Bubble>
          </div>
        ))}
      </div>
      <div
        className={`fixed top-0 left-0 bg-secondary w-screen h-screen z-10 ${
          showLightbox ? "flex justify-center" : "hidden"
        }`}
      >
        <Bubble
          className="absolute top-10 right-2 md:right-9 md:top-14"
          onClick={() => {
            setShowLightbox(false);
            setCurrentImageIndex(null);
          }}
        >
          <em className="fas fa-times"></em>
        </Bubble>
        {currentImageIndex != null && (
          <div className="flex flex-col justify-center w-full h-full mx-5 sm:max-w-4xl sm:mx-8">
            <div className="relative w-full h-1/2">
              <NextImage
                src={props.node.images[currentImageIndex].url}
                layout="fill"
                objectFit="contain"
                alt={props.node.images[currentImageIndex].alt}
                placeholder="blur"
                blurDataURL={props.node.images[currentImageIndex].urlBlur}
              />
              <Bubble
                className="absolute -mt-4 top-1/2 sm:-mt-7 -left-4 md:-left-7"
                onClick={() => {
                  if (currentImageIndex === 0) {
                    setCurrentImageIndex(props.node.images.length - 1);
                  } else {
                    setCurrentImageIndex(currentImageIndex - 1);
                  }
                }}
              >
                <em className="fas fa-long-arrow-alt-left"></em>
              </Bubble>
              <Bubble
                className="absolute -mt-4 top-1/2 sm:-mt-7 -right-4 md:-right-7"
                onClick={() => {
                  if (currentImageIndex === props.node.images.length - 1) {
                    setCurrentImageIndex(0);
                  } else {
                    setCurrentImageIndex(currentImageIndex + 1);
                  }
                }}
              >
                <em className="fas fa-long-arrow-alt-right"></em>
              </Bubble>
            </div>
            <div className="flex flex-row items-center justify-end w-full mt-3 space-x-3 font-milona">
              <Label>{router.locale === "de" ? "Foto" : "Photo"}</Label>
              <span className="text-2xl sm:text-3xl">
                {props.node.images[currentImageIndex].credits}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageGallery;
