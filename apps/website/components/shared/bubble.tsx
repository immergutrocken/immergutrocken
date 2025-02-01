import { ReactNode } from "react";

interface IClassName {
  className?: string;
}

interface BubbleProps extends IClassName {
  children: ReactNode | string;
  onClick?: () => void;
  size?: "small" | "large";
}

const Bubble = ({
  children,
  onClick = () => false,
  className = "",
  size = "large",
}: BubbleProps): ReactNode => {
  const sizeClasses =
    size === "large"
      ? "w-9 h-9 sm:w-14 sm:h-14 text-xl sm:text-3xl"
      : "w-9 h-9 text-xl";

  return (
    <button
      className={`flex cursor-pointer items-center justify-center rounded-full bg-primary text-secondary focus:outline-none sm:transform sm:transition-transform sm:duration-300 sm:ease-in-out sm:hover:scale-110 ${className} ${sizeClasses}`}
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
};

export default Bubble;
