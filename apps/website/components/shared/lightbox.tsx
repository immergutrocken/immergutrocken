import { useRouter } from "next/router";
import Bubble from "./bubble";
import Label from "./label";
import NextImage from "next/image";

interface LightBoxProps {
  images: {
    url: string;
    urlBlur: string;
    alt: string;
    credits: string;
  }[];
  imageIndex: number;
  show: boolean;
  onShow: (boolean) => void;
  onCurrentImageIndexChange: (number) => void;
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
      className={`fixed top-0 left-0 bg-secondary w-screen h-screen z-10 ${
        show ? "flex justify-center" : "hidden"
      }`}
    >
      <Bubble
        className="absolute top-10 right-2 md:right-9 md:top-14"
        onClick={() => {
          onShow(false);
          onCurrentImageIndexChange(null);
        }}
      >
        <em className="fas fa-times"></em>
      </Bubble>
      {imageIndex != null && (
        <div className="flex flex-col justify-center w-full h-full mx-5 sm:max-w-4xl sm:mx-8">
          <div className="relative w-full h-1/2">
            <NextImage
              src={images[imageIndex].url}
              style={{ fill: "responsive", objectFit: "contain" }}
              alt={images[imageIndex].alt}
              placeholder="blur"
              blurDataURL={images[imageIndex].urlBlur}
            />
            {images.length > 1 && (
              <>
                <Bubble
                  className="absolute -mt-4 top-1/2 sm:-mt-7 -left-4 md:-left-7"
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
                  className="absolute -mt-4 top-1/2 sm:-mt-7 -right-4 md:-right-7"
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

          <div className="flex flex-row items-center justify-end w-full h-8 mt-3 space-x-3 font-important">
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
