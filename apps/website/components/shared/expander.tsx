import { ReactNode, useState } from "react";

interface ExpanderProps {
  className?: string;
  title: string;
  children: ReactNode | ReactNode[];
}

const Expander = ({ title, className, children }: ExpanderProps): ReactNode => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={className}>
      <button
        className="inline-flex max-w-full cursor-pointer items-center justify-start focus:outline-none"
        onClick={() => setCollapsed(!collapsed)}
        title={title}
      >
        <span className="truncate">{title}</span>
        <em
          className={`fas ml-2 fa-caret-${
            collapsed ? "down" : "up"
          } text-primary`}
        ></em>
      </button>
      <div className={`my-2 sm:text-5xl ${collapsed ? "hidden" : "block"}`}>
        {children}
      </div>
    </div>
  );
};

export default Expander;
