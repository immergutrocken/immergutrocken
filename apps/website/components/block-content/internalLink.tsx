import NextLink from "next/link";

interface InternalLinkProps {
  mark: {
    docType: string;
    slug: string;
  };
  children: string;
}

const InternalLink = ({ mark, children }: InternalLinkProps): JSX.Element => {
  return (
    <NextLink href={`/${mark.docType}/${mark.slug}`}>
      <a className="font-bold">{children}</a>
    </NextLink>
  );
};

export default InternalLink;
