import { fireEvent, render, screen } from "@testing-library/react";

import Bubble from "../../../components/shared/bubble";

describe("Bubble", () => {
  it("renders with default props", () => {
    render(<Bubble>Test content</Bubble>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Test content");
    expect(button).toHaveClass(
      "w-9",
      "h-9",
      "sm:w-14",
      "sm:h-14",
      "text-xl",
      "sm:text-3xl",
    );
  });

  it("renders with small size", () => {
    render(<Bubble size="small">Small</Bubble>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("w-9", "h-9", "text-xl");
    expect(button).not.toHaveClass("sm:w-14", "sm:h-14", "sm:text-3xl");
  });

  it("renders with custom className", () => {
    render(<Bubble className="custom-class">Test</Bubble>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = jest.fn();
    render(<Bubble onClick={mockOnClick}>Clickable</Bubble>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("uses default onClick function when none provided", () => {
    render(<Bubble>Default click</Bubble>);

    const button = screen.getByRole("button");
    // This should not throw an error when clicked
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
