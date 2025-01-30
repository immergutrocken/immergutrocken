import { ReactNode } from "react";

import Expander from "../shared/expander";
import Content from "./content";

interface BlockExpanderProps {
  node: {
    title: string;
    content: [];
  };
}

const BlockExpander = (props: BlockExpanderProps): ReactNode => {
  return (
    <div className="font-important text-xl sm:text-3xl">
      <Expander className="max-w-full" title={props.node.title}>
        <div className="font-content">
          <Content content={props.node.content} />
        </div>
      </Expander>
    </div>
  );
};

export default BlockExpander;
