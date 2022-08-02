const AlignCenter = ({
  children,
}: {
  children: JSX.Element | string;
}): JSX.Element => <div className="text-center">{children}</div>;

export default AlignCenter;
