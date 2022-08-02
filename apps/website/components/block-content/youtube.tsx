import ReactPlayer from "react-player/youtube";

interface YoutubeProps {
  node: {
    url: string;
  };
}

const Youtube = (props: YoutubeProps): JSX.Element => (
  <div className="mt-9">
    <ReactPlayer url={props.node.url} width="100%" controls={true} />
  </div>
);

export default Youtube;
