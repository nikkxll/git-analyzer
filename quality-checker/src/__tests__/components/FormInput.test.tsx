import "@testing-library/jest-dom";
import { render, fireEvent } from "@testing-library/react";
import { HelpCircle } from "lucide-react";
import { FormInput } from "@/components/FormInput";

describe("FormInput", () => {
  it("Renders the label and icon correctly", () => {
    const { getByText, getByTestId } = render(
      <FormInput
        icon={<HelpCircle data-testid="icon" />}
        label="Test Label"
        value="Test Value"
        onChange={() => {}}
        placeholder="Test Placeholder"
      />
    );

    expect(getByText("Test Label")).toBeInTheDocument();
    expect(getByTestId("icon")).toBeInTheDocument();
  });

  it("Calls the onChange function when the input value changes", () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <FormInput
        icon={<HelpCircle />}
        label="Test Label"
        value="Test Value"
        onChange={mockOnChange}
        placeholder="Test Placeholder"
      />
    );

    const input = getByPlaceholderText("Test Placeholder");
    fireEvent.change(input, { target: { value: "New Value" } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("Dropdown menu renders correctly", () => {
    const options = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
    ];
    const { getByRole } = render(
      <FormInput
        icon={<HelpCircle />}
        label="Test Label"
        value="Test Value"
        onChange={() => {}}
        placeholder="Test Placeholder"
        dropdown={{
          value: "option1",
          onChange: () => {},
          options,
        }}
      />
    );

    const dropdown = getByRole("combobox");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveValue("option1");
  });
});
