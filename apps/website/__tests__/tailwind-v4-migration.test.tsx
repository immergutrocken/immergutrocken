import { render, screen } from "@testing-library/react";

describe("Tailwind v4 Custom Classes", () => {
  it("should render custom colors correctly", () => {
    render(
      <div>
        <div className="bg-primary text-secondary" data-testid="primary-div">
          Primary Colors
        </div>
        <div className="bg-tertiary text-primary" data-testid="tertiary-div">
          Tertiary Colors
        </div>
      </div>,
    );

    const primaryDiv = screen.getByTestId("primary-div");
    const tertiaryDiv = screen.getByTestId("tertiary-div");

    // Check that elements exist and classes are applied
    expect(primaryDiv).toBeInTheDocument();
    expect(primaryDiv).toHaveClass("bg-primary", "text-secondary");

    expect(tertiaryDiv).toBeInTheDocument();
    expect(tertiaryDiv).toHaveClass("bg-tertiary", "text-primary");
  });

  it("should render custom fonts correctly", () => {
    render(
      <div>
        <div className="font-content" data-testid="content-font">
          Content Font
        </div>
        <div className="font-important" data-testid="important-font">
          Important Font
        </div>
      </div>,
    );

    const contentFont = screen.getByTestId("content-font");
    const importantFont = screen.getByTestId("important-font");

    expect(contentFont).toBeInTheDocument();
    expect(contentFont).toHaveClass("font-content");

    expect(importantFont).toBeInTheDocument();
    expect(importantFont).toHaveClass("font-important");
  });

  it("should render custom utilities correctly", () => {
    render(
      <div className="invert-partner" data-testid="invert-test">
        Inverted
      </div>,
    );

    const invertedDiv = screen.getByTestId("invert-test");
    expect(invertedDiv).toBeInTheDocument();
    expect(invertedDiv).toHaveClass("invert-partner");
  });

  it("should render custom breakpoint classes correctly", () => {
    render(
      <div className="3xl:w-2/3 w-full" data-testid="responsive-test">
        Responsive
      </div>,
    );

    const responsiveDiv = screen.getByTestId("responsive-test");
    expect(responsiveDiv).toBeInTheDocument();
    expect(responsiveDiv).toHaveClass("w-full", "3xl:w-2/3");
  });
});
