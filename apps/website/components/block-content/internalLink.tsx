import NextLink from "next/link";
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
  children: JSX.Element | string
): JSX.Element | string => {
  if (isCTA) return <Button size="small">{children}</Button>;
  else return children;
};

const InternalLink = ({ mark, children }: InternalLinkProps): JSX.Element => {
  return (
    <NextLink href={`/${mark.docType}/${mark.slug}`}>
      <a className="font-bold">{buildChildren(mark.isCTA, children)}</a>
    </NextLink>
  );
};

export default InternalLink;
