import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode | string;
  className?: string;
  click?: () => void;
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
}: ButtonProps): ReactNode => (
  <button
    className={`flex items-center justify-center rounded-full font-important uppercase text-secondary focus:outline-none sm:transform sm:transition-transform sm:duration-300 sm:ease-in-out sm:hover:scale-110 ${className} ${
      active ? "bg-primary" : "bg-gray-300"
    } ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${
      size === "small"
        ? "sm: px - 4 text - base sm: text - xl h - 6 sm: h - 10 px-2.5 pt-0.5"
        : "h-8 px-2.5 pt-0.5 text-lg sm:h-14 sm:px-4 sm:pt-1 sm:text-4xl"
    } ${success ? "!bg-tertiary" : ""}`}
    onClick={() => (click ? click() : {})}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;
