interface ButtonProps {
  children: JSX.Element | string;
  className?: string;
  click?: (event?) => void;
  disabled?: boolean;
  active?: boolean;
  size?: "small" | "large";
  success?: boolean;
}

const Button = ({
  children,
  className = "",
  click,
  disabled = false,
  active = true,
  size = "large",
  success = false,
}: ButtonProps): JSX.Element => (
  <button
    className={`text-secondary rounded-full focus:outline-none font-important uppercase flex justify-center items-center sm:transition-transform sm:duration-300 sm:ease-in-out sm:transform sm:hover:scale-110 ${className} ${
      active ? "bg-primary" : "bg-gray-200"
    } ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${
      size === "small"
        ? "pt-0.5 px-2.5 sm: px - 4 text - base sm: text - xl h - 6 sm: h - 10"
        : "pt-0.5 sm:pt-1 px-2.5 sm:px-4 text-lg sm:text-4xl h-8 sm:h-14"
    } ${success ? "!bg-tertiary" : ""}`}
    onClick={() => (click ? click() : {})}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
