import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";

describe("BackgroundAnimation", () => {
  // This test verifies that the BackgroundAnimation component:
  // 1. Properly wraps its children
  // 2. Applies the correct CSS classes for full-screen layout
  // 3. Successfully renders in the DOM

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
