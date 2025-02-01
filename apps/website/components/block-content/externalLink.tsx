import { ReactNode } from "react";

import Button from "../shared/button";
import Link from "../shared/link";

interface ExternalLinkProps {
  mark: {
    isCTA: boolean;
    url: string;
  };
  children: ReactNode | string;
}

const buildChildren = (
  isCTA: boolean,
  children: ReactNode | string,
): ReactNode | string => {
  if (isCTA) return <Button size="small">{children}</Button>;
  else return children;
};

const ExternalLink = ({ mark, children }: ExternalLinkProps): ReactNode => {
  return (
    <Link
      href={mark.url}
      className={`font-bold ${mark.isCTA ? "mb-4 font-important" : ""}`}
    >
      {buildChildren(mark.isCTA, children)}
    </Link>
  );
};

export default ExternalLink;
