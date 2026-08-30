import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

describe("Button", () => {
	it("disables and announces busy while loading", () => {
		render(<Button loading>Sending</Button>);
		const btn = screen.getByRole("button", { name: /sending/i });
		expect(btn).toBeDisabled();
		expect(btn).toHaveAttribute("aria-busy", "true");
	});

	it("defaults to type=button so it never submits forms by accident", () => {
		render(<Button>Ok</Button>);
		expect(screen.getByRole("button")).toHaveAttribute("type", "button");
	});
});

describe("Field", () => {
	it("wires label, hint and error to the control via id and aria-describedby", () => {
		render(
			<Field
				label="Email"
				name="email"
				error="This email address does not look right."
			>
				<Input type="email" />
			</Field>,
		);
		const input = screen.getByLabelText("Email");
		expect(input).toHaveAttribute("id", "email");
		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(input).toHaveAccessibleDescription(/does not look right/);
	});

	it("marks optional fields in the label, not required ones", () => {
		render(
			<Field label="Notes" name="notes" optional>
				<Input />
			</Field>,
		);
		expect(screen.getByText("(optional)")).toBeInTheDocument();
	});
});
