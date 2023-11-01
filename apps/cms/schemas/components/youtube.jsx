import getYouTubeId from "get-youtube-id";
import YouTube from "react-youtube";
import { FaYoutube } from "react-icons/fa";

const Preview = (props) => {
  const { url, renderDefault } = props;
  const id = getYouTubeId(url);
  return (
    <div>
      {renderDefault({ ...props, title: "YouTube Video" })}
      <YouTube videoId={id} opts={{ width: "100%" }} />
    </div>
  );
};

export default {
  name: "youtube",
  type: "object",
  title: "YouTube Video",
  icon: FaYoutube,
  fields: [
    {
      name: "url",
      type: "url",
      title: "YouTube video URL",
    },
  ],
  components: {
    preview: Preview,
  },
  preview: {
    select: {
      url: "url",
    },
  },
};
