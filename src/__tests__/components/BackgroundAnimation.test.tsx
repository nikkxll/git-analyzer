import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";

describe("BackgroundAnimation", () => {
  it("renders correctly", () => {
    const { container } = render(
      <BackgroundAnimation>
        <div>Test content</div>
      </BackgroundAnimation>,
    );

    expect(container.firstChild).toHaveClass("min-h-screen");
    expect(container.firstChild).toBeInTheDocument();
  });
});
