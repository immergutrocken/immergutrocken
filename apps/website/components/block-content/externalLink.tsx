import Button from "../shared/button";
import Link from "../shared/link";

interface ExternalLinkProps {
  mark: {
    isCTA: boolean;
    url: string;
  };
  children: JSX.Element | string;
}

const buildChildren = (
  isCTA: boolean,
  children: JSX.Element | string
): JSX.Element | string => {
  if (isCTA) return <Button size="small">{children}</Button>;
  else return children;
};

const ExternalLink = ({ mark, children }: ExternalLinkProps): JSX.Element => {
  return (
    <Link
      href={mark.url}
      className={`font-bold ${mark.isCTA ? "font-important mb-4" : ""}`}
    >
      {buildChildren(mark.isCTA, children)}
    </Link>
  );
};

export default ExternalLink;
