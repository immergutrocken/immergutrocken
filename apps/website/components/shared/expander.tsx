import { useState } from "react";

interface ExpanderProps {
  className?: string;
  title: string;
  children: JSX.Element | JSX.Element[];
}

const Expander = ({
  title,
  className,
  children,
}: ExpanderProps): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={className}>
      <button
        className="inline-flex items-center justify-start max-w-full cursor-pointer focus:outline-none"
        onClick={() => setCollapsed(!collapsed)}
        title={title}
      >
        <span className="truncate">{title}</span>
        <em
          className={`ml-2 fas fa-caret-${
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
