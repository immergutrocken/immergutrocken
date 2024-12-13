import getYouTubeId from "get-youtube-id";
import { FaYoutube } from "react-icons/fa";
import YouTube from "react-youtube";
import { defineField, PreviewLayoutKey, PreviewProps } from "sanity";

const Preview = (props: PreviewProps<PreviewLayoutKey> & { url?: string }) => {
  const { url, renderDefault } = props;
  if (url != null) {
    const id = getYouTubeId(url);
    return (
      <div>
        {renderDefault({ ...props, title: "YouTube Video" })}
        <YouTube videoId={id} opts={{ width: "100%" }} />
      </div>
    );
  }
};

export default defineField({
  name: "youtube",
  type: "object",
  title: "YouTube Video",
  icon: FaYoutube,
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "YouTube video URL",
    }),
  ],
  components: {
    preview: Preview,
  },
  preview: {
    select: {
      url: "url",
    },
  },
});
