import { ReactNode } from "react";
import ReactPlayer from "react-player";

interface YoutubeProps {
  node: {
    url: string;
  };
}

const Youtube = (props: YoutubeProps): ReactNode => (
  <div className="mt-9 flex justify-center">
    <div className="3xl:w-2/3 w-full">
      <ReactPlayer src={props.node.url} width="100%" controls={true} />
    </div>
  </div>
);

export default Youtube;
