const AlignCenter = ({
  children,
}: {
  children: JSX.Element | string;
}): JSX.Element => <span className="text-center">{children}</span>;

export default AlignCenter;
