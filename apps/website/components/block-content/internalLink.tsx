import NextLink from "next/link";
import { ReactNode } from "react";

import Button from "../shared/button";

interface InternalLinkProps {
  mark: {
    docType: string;
    isCTA: boolean;
    slug: string;
  };
  children: string;
}

const buildChildren = (
  isCTA: boolean,
  children: ReactNode | string,
): ReactNode | string => {
  if (isCTA) return <Button size="small">{children}</Button>;
  else return children;
};

const InternalLink = ({ mark, children }: InternalLinkProps): ReactNode => {
  return (
    <NextLink href={`/${mark.docType}/${mark.slug}`} className="font-bold">
      {buildChildren(mark.isCTA, children)}
    </NextLink>
  );
};

export default InternalLink;
