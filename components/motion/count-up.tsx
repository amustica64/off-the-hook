"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatMetric } from "@/lib/impact-metrics";
import { dur, easeEnter, motionTokens } from "@/lib/motion";
import { useMotionPreference } from "./use-motion-preference";

/*
  Impact number count-up per Doc 05 M1: runs once on viewport entry, over
  --dur-slow, tabular numerals so nothing jitters, never rounds to a friendlier
  value. Reduced motion: the final number renders immediately.

  QA register fixes applied:

  X2 and N3. Reduced motion comes from the one shared hook rather than a local
  boolean named `reduced`, which is the name that shadowed the token set
  everywhere else it appeared.

  Two magic numbers removed. The duration was a literal 0.9 sitting under a
  comment that said "~900ms", but Doc 05 M1 specifies --dur-slow, which is 0.8.
  It is now dur.slow, so the count is 100ms shorter than it was. The curve was a
  hand copied easeEnter.

  The comment promised tabular numerals and the markup never set them, so the
  figure jittered as it counted. It does not now.
*/
export function CountUp({
	metricKey,
	value,
}: {
	metricKey: string;
	value: number;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, {
		once: true,
		amount: motionTokens.viewport.most,
	});
	const { isReduced } = useMotionPreference();
	const [display, setDisplay] = useState(isReduced ? value : 0);

	useEffect(() => {
		if (!inView || isReduced) return;
		const controls = animate(0, value, {
			duration: dur.slow,
			ease: easeEnter,
			onUpdate: (v) => setDisplay(Math.round(v)),
		});
		return () => controls.stop();
	}, [inView, isReduced, value]);

	return (
		<span ref={ref} className="tabular-nums">
			{formatMetric(metricKey, String(isReduced ? value : display))}
		</span>
	);
}
