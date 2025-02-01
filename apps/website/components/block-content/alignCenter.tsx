import { ReactNode } from "react";

const AlignCenter = ({
  children,
}: {
  children: ReactNode | string;
}): ReactNode => <span className="text-center">{children}</span>;

export default AlignCenter;
