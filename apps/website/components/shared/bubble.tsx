interface IClassName {
  className?: string;
}

interface BubbleProps extends IClassName {
  children: JSX.Element | string;
  onClick?: () => void;
  size?: "small" | "large";
}

const Bubble = ({
  children,
  onClick = () => false,
  className = "",
  size = "large",
}: BubbleProps): JSX.Element => {
  const sizeClasses =
    size === "large"
      ? "w-9 h-9 sm:w-14 sm:h-14 text-xl sm:text-3xl"
      : "w-9 h-9 text-xl";

  return (
    <button
      className={`bg-primary rounded-full flex justify-center items-center cursor-pointer sm:transition-transform sm:duration-300 sm:ease-in-out sm:transform sm:hover:scale-110 focus:outline-none text-secondary ${className} ${sizeClasses}`}
      onClick={() => onClick()}
    >
      {children}
    </button>
  );
};

export default Bubble;
