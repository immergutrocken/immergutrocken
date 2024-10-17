import getYouTubeId from 'get-youtube-id';
import { FaYoutube } from 'react-icons/fa';
import YouTube from 'react-youtube';

const Preview = (props: {
  url: string;
  renderDefault: (props: unknown) => JSX.Element;
}) => {
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
