import NextImage from "next/image";
import { useRouter } from "next/router";

import { SanityImage } from "../../lib/shared/sanityImageUrl";
import Bubble from "./bubble";
import Label from "./label";

interface LightBoxProps {
  images: SanityImage[];
  imageIndex: number | null;
  show: boolean;
  onShow: (newValue: boolean) => void;
  onCurrentImageIndexChange: (newValue: number | null) => void;
}

const LightBox = ({
  images,
  imageIndex = null,
  show = false,
  onShow,
  onCurrentImageIndexChange,
}: LightBoxProps): JSX.Element => {
  const router = useRouter();

  return (
    <div
      className={`fixed left-0 top-0 z-10 h-screen w-screen bg-secondary ${
        show ? "flex justify-center" : "hidden"
      }`}
    >
      <Bubble
        className="absolute right-2 top-10 md:right-9 md:top-14"
        onClick={() => {
          onShow(false);
          onCurrentImageIndexChange(null);
        }}
      >
        <em className="fas fa-times"></em>
      </Bubble>
      {imageIndex != null && (
        <div className="mx-5 flex h-full w-full flex-col justify-center sm:mx-8 sm:max-w-4xl">
          <div className="relative h-1/2 w-full">
            <NextImage
              src={images[imageIndex].url}
              style={{ fill: "responsive", objectFit: "contain" }}
              fill={true}
              alt={images[imageIndex].alt}
              placeholder="blur"
              blurDataURL={images[imageIndex].urlBlur}
            />
            {images.length > 1 && (
              <>
                <Bubble
                  className="absolute -left-4 top-1/2 -mt-4 sm:-mt-7 md:-left-7"
                  onClick={() => {
                    if (imageIndex === 0) {
                      onCurrentImageIndexChange(images.length - 1);
                    } else {
                      onCurrentImageIndexChange(imageIndex - 1);
                    }
                  }}
                >
                  <em className="fas fa-long-arrow-alt-left"></em>
                </Bubble>
                <Bubble
                  className="absolute -right-4 top-1/2 -mt-4 sm:-mt-7 md:-right-7"
                  onClick={() => {
                    if (imageIndex === images.length - 1) {
                      onCurrentImageIndexChange(0);
                    } else {
                      onCurrentImageIndexChange(imageIndex + 1);
                    }
                  }}
                >
                  <em className="fas fa-long-arrow-alt-right"></em>
                </Bubble>
              </>
            )}
          </div>

          <div className="mt-3 flex h-8 w-full flex-row items-center justify-end space-x-3 font-important">
            {images[imageIndex].credits && (
              <>
                <Label>{router.locale === "de" ? "Foto" : "Photo"}</Label>
                <span className="text-2xl sm:text-3xl">
                  {images[imageIndex].credits}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LightBox;
