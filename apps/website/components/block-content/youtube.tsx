import ReactPlayer from 'react-player/youtube';

interface YoutubeProps {
  node: {
    url: string;
  };
}

const Youtube = (props: YoutubeProps): JSX.Element => (
  <div className="flex justify-center mt-9">
    <div className="w-full 3xl:w-2/3">
      <ReactPlayer url={props.node.url} width="100%" controls={true} />
      </div>
  </div>
);

export default Youtube;
