import image from "../fields/image";
import { useClient } from "sanity";
import imageUrlBuilder from "@sanity/image-url";
import { IoMdImages } from "react-icons/io";

const Preview = (props) => {
  const { images, renderDefault } = props;
  const builder = imageUrlBuilder(useClient());
  console.log(images[1]);
  console.log(images[2]);

  return (
    <div>
      {renderDefault({ ...props, title: "Bildergalerie" })}
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
                  style={{
                    maxWidth: "25%",
                    margin: "10px",
                    maxHeight: "100px",
                  }}
                  key={image._key}
                />
              );
            }
          })}
      </div>
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
  components: {
    preview: Preview,
  },
  preview: {
    select: {
      images: "images",
    },
  },
};
