import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { SkipLink } from "@/components/ui/utility";

export const metadata: Metadata = {
	title: "Off the Hook · A hospitality-led training academy for prison leavers",
	description:
		"Off the Hook trains people leaving prison into paid restaurant work and nationally recognised qualifications. A working restaurant, a serious academy.",
};

/*
  QA register X1 and X1b. Framer serialises every `initial` into the SSR markup
  as an inline style, so any element that animates in ships as opacity 0. This
  puts it back.

  X1b is the half that is easy to miss: framer compiles pathLength into
  stroke-dasharray and stroke-dashoffset, not into opacity or transform. Without
  the two stroke resets below, this rule reaches no line on the site, and the
  intro draw, every section hairline, the journey rail and the footer knot all
  stay invisible.

  P3. The hero stacks its chapters and relies on clip-path alone to hide all but
  the active one, since their opacity clamps to 1 outside their own transition
  band. Stripping clip-path would therefore reveal the last chapter on top of
  the other two. With no script the hero collapses to a single screen showing
  chapter one, which is the readable degradation.

  P2, recorded honestly: <noscript> applies only where scripting is disabled. It
  does not cover a bundle that 404s, a hydration throw, or a blocking extension,
  because JS is enabled in all three. Covering those means not emitting the
  hidden state server side at all, which is a larger change than this slice. The
  guarantee this block delivers is "readable with JS disabled", and the file
  headers should not claim more than that.
*/
const NOSCRIPT_REVEAL_CSS = `
[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;stroke-dasharray:none!important;stroke-dashoffset:0!important}
[data-hero-section]{height:100svh!important}
[data-hero-layer]:not([data-hero-index="0"]){display:none!important}
`;

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en-GB" suppressHydrationWarning>
			<head>
				<noscript>
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: static CSS constant, no interpolation */}
					<style dangerouslySetInnerHTML={{ __html: NOSCRIPT_REVEAL_CSS }} />
				</noscript>
			</head>
			<body className="flex min-h-dvh flex-col">
				<ThemeProvider
					attribute="data-theme"
					defaultTheme="light"
					enableSystem={false}
				>
					<SkipLink />
					<Header />
					<main id="main" className="flex-1">
						{children}
					</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
