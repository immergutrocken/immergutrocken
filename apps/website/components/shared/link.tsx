interface LinkProps {
  children: JSX.Element | string;
  title?: string;
  href: string;
  className?: string;
  click?: () => void;
}

const Link = ({
  children,
  title,
  href,
  className = "",
  click,
}: LinkProps): JSX.Element => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className={`hover:underline focus:outline-none ${className}`}
    title={title}
    onClick={() => (click ? click() : {})}
  >
    {children}
  </a>
);

export default Link;
