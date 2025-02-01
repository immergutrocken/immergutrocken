import { ReactNode } from "react";

interface LabelProps {
  children: string;
  className?: string;
}

const Label = ({ children, className = "" }: LabelProps): ReactNode => (
  <div className={"text-center " + className}>
    <span className="inline-block whitespace-nowrap rounded-full border-2 border-primary px-3 pb-1 pt-2 font-important text-base uppercase sm:text-2xl">
      {children}
    </span>
  </div>
);

export default Label;
