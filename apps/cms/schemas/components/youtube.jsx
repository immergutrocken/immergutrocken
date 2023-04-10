import getYouTubeId from "get-youtube-id";
import YouTube from "react-youtube";
import { FaYoutube } from "react-icons/fa";

const Preview = ({ value }) => {
  const { url } = value;
  const id = getYouTubeId(url);
  return <YouTube videoId={id} opts={{ width: "100%" }} />;
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
  preview: {
    select: {
      url: "url",
    },
    component: Preview,
  },
};
