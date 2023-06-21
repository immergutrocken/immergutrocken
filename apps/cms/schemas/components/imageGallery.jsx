import image from "../fields/image";
import { useClient } from "sanity";
import imageUrlBuilder from "@sanity/image-url";
import { IoMdImages } from "react-icons/io";

const Preview = ({ value }) => {
  const { images } = value;
  const builder = imageUrlBuilder(useClient());

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        alignItems: "center",
        padding: "10px",
      }}
    >
      {images &&
        images.map((image) => {
          if (image.asset != null) {
            const url = builder.image(image).url();
            return (
              <img
                src={url}
                style={{ maxWidth: "25%", margin: "10px", maxHeight: "100px" }}
                key={url}
              />
            );
          }
        })}
    </div>
  );
};

export default {
  type: "object",
  name: "imageGallery",
  title: "Bildergalerie",
  icon: IoMdImages,
  fields: [
    {
      type: "array",
      name: "images",
      title: "Bilder",
      of: [image],
    },
  ],
  componets: {
    preview: Preview,
  },
  preview: {
    select: {
      images: "images",
    },
  },
};
