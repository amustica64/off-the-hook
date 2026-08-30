/* Primary nav per Doc 03 §2, six items in this order. The academy points at /journey (Doc 12). */

export type NavChild = { label: string; href: string; note: string };
export type NavItem = { label: string; href: string; children?: NavChild[] };

export const primaryNav: NavItem[] = [
	{ label: "The restaurant", href: "/restaurant" },
	{ label: "The academy", href: "/journey" },
	{ label: "Our impact", href: "/impact" },
	{
		label: "For partners",
		href: "/partners",
		children: [
			{
				label: "Funders",
				href: "/partners/funders",
				note: "Fund measurable work",
			},
			{
				label: "Referrers",
				href: "/partners/referrals",
				note: "Refer someone to the programme",
			},
			{
				label: "Employers",
				href: "/partners/employers",
				note: "Hire a graduate",
			},
			{
				label: "Educators",
				href: "/partners/education",
				note: "Deliver qualifications with us",
			},
		],
	},
	{ label: "About", href: "/about" },
];
