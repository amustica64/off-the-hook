/* Metric definitions live in code per Doc 06 §3.3. The DB holds values per year. */

export const METRIC_DEFINITIONS = {
	people_trained: { label: "people through the programme", format: "count" },
	qualifications_awarded: {
		label: "nationally recognised qualifications",
		format: "count",
	},
	employment_rate: { label: "in work after 6 months", format: "percent" },
	meals_served: { label: "meals served", format: "count" },
	wages_paid: { label: "paid in real wages", format: "gbp" },
	reoffending_rate: {
		label: "reoffending vs the national average",
		format: "percent-delta",
	},
} as const;

export type MetricKey = keyof typeof METRIC_DEFINITIONS;

export function formatMetric(key: string, value: string): string {
	const def = METRIC_DEFINITIONS[key as MetricKey];
	const n = Number(value);
	if (!def || Number.isNaN(n)) return value;
	switch (def.format) {
		case "percent":
			return `${n}%`;
		case "percent-delta":
			return `${n > 0 ? "+" : ""}${n}%`;
		case "gbp":
			return `£${n.toLocaleString("en-GB")}`;
		default:
			return n.toLocaleString("en-GB");
	}
}

export function metricLabel(key: string): string {
	return METRIC_DEFINITIONS[key as MetricKey]?.label ?? key;
}
