import { cloneElement } from "react";
import { cn } from "@/lib/utils";

/*
  Form primitives per Doc 07 §6.4 and Doc 09 §1.5.
  Labels above fields, never placeholder-as-label. Optional fields say "(optional)".
  Native controls styled with tokens: accessible by default, native pickers on mobile.
  Error text is tied to the control via aria-describedby.
*/

const controlBase =
	"w-full rounded-[var(--r-sm)] border border-divider bg-bg text-[max(16px,1rem)] text-text " +
	"placeholder:text-text-muted transition-colors duration-[var(--dur-fast)] " +
	"focus:border-accent focus:outline-none aria-invalid:border-status-danger disabled:opacity-50";

type FieldProps = {
	label: string;
	name: string;
	error?: string;
	hint?: string;
	optional?: boolean;
	children: React.ReactElement<Record<string, unknown>>;
};

export function Field({
	label,
	name,
	error,
	hint,
	optional,
	children,
}: FieldProps) {
	const hintId = hint ? `${name}-hint` : undefined;
	const errorId = error ? `${name}-error` : undefined;
	const control = cloneElement(children, {
		id: name,
		name,
		"aria-describedby":
			[hintId, errorId].filter(Boolean).join(" ") || undefined,
		"aria-invalid": error ? true : undefined,
	});

	return (
		<div className="space-y-1.5">
			<label
				htmlFor={name}
				className="block text-[length:var(--fs-small)] font-medium text-text-secondary"
			>
				{label}
				{optional && (
					<span className="font-normal text-text-muted"> (optional)</span>
				)}
			</label>
			{control}
			{hint && !error && (
				<p
					id={hintId}
					className="text-[length:var(--fs-small)] text-text-muted"
				>
					{hint}
				</p>
			)}
			{error && (
				<p
					id={errorId}
					className="text-[length:var(--fs-small)] text-status-danger"
				>
					{error}
				</p>
			)}
		</div>
	);
}

export function Input({
	className,
	...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input className={cn(controlBase, "h-12 px-3.5", className)} {...rest} />
	);
}

export function Textarea({
	className,
	...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<textarea
			className={cn(controlBase, "min-h-28 px-3.5 py-3", className)}
			{...rest}
		/>
	);
}

export function Select({
	className,
	children,
	...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select
			className={cn(controlBase, "h-12 appearance-none px-3.5 pr-9", className)}
			{...rest}
		>
			{children}
		</select>
	);
}

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
};

export function Checkbox({ label, className, ...rest }: CheckboxProps) {
	return (
		<label
			className={cn(
				"flex cursor-pointer items-start gap-3 text-[length:var(--fs-body)] text-text",
				className,
			)}
		>
			<input
				type="checkbox"
				className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[var(--forest-600)]"
				{...rest}
			/>
			<span>{label}</span>
		</label>
	);
}

type RadioGroupProps = {
	legend: string;
	name: string;
	options: { value: string; label: string }[];
	defaultValue?: string;
};

export function RadioGroup({
	legend,
	name,
	options,
	defaultValue,
}: RadioGroupProps) {
	return (
		<fieldset className="space-y-2.5">
			<legend className="mb-1 text-[length:var(--fs-small)] font-medium text-text-secondary">
				{legend}
			</legend>
			{options.map((o) => (
				<label
					key={o.value}
					className="flex cursor-pointer items-center gap-3 text-text"
				>
					<input
						type="radio"
						name={name}
						value={o.value}
						defaultChecked={o.value === defaultValue}
						className="h-5 w-5 cursor-pointer accent-[var(--forest-600)]"
					/>
					{o.label}
				</label>
			))}
		</fieldset>
	);
}

export function GdprConsent({ name = "gdpr_consent" }: { name?: string }) {
	return (
		<Checkbox
			name={name}
			required
			label="I agree to Off the Hook storing these details to reply to me. See how we handle data in the privacy policy."
		/>
	);
}

export function FormError({ children }: { children: React.ReactNode }) {
	return (
		<div
			role="alert"
			className="rounded-[var(--r-sm)] border border-status-danger/40 bg-status-danger/10 p-4 text-[length:var(--fs-small)] text-status-danger"
		>
			{children}
		</div>
	);
}
