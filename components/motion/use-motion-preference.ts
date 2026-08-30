"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { motionTokens } from "@/lib/motion";

/*
  One source for reduced motion, per QA register X2 and N3.

  Before this hook, five components each decided for themselves what reduced
  motion meant: a scroll ramp, a timeout, a variant transition, a hardcoded
  literal and an early return. Only one of the five read the token. Worse, the
  token set was destructured at module scope as `reduced`, then shadowed by a
  `reduced: boolean` parameter, which made motionTokens.reduced.fade
  unreachable and left three expressions that evaluated but said nothing.

  Returning a named object kills that permanently. `isReduced` is the boolean,
  `fade` is the duration. Neither can shadow the token set, because the token
  set is never destructured into a bare name.
*/
export function useMotionPreference(): { isReduced: boolean; fade: number } {
	const isReduced = Boolean(useReducedMotion());
	return { isReduced, fade: motionTokens.reduced.fade };
}

/*
  Capability gate for the hero warp, per QA register N4.

  A 14px blur on a full viewport image is the most expensive thing in the
  motion system, and nothing gated it. This is a capability check, not user
  agent sniffing: it asks the device what it can do, never what it is called.

  Starts false on purpose. The server cannot measure anything, so the cheap
  cross dissolve is what renders first and what an un-upgraded client keeps.
  A capable machine upgrades to the warp after mount. That ordering also means
  there is no hydration mismatch to reconcile.
*/
export function useCanWarp(): boolean {
	const [canWarp, setCanWarp] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined" || !window.matchMedia) return;

		// `update: slow` is the standards answer for e-ink and low refresh panels.
		const slowPaint = window.matchMedia("(update: slow)").matches;

		// deviceMemory is not universal. Treat "not reported" as "do not disqualify",
		// and lean on core count, which is broadly available.
		const nav = navigator as Navigator & { deviceMemory?: number };
		const cores = nav.hardwareConcurrency ?? 0;
		const memory = nav.deviceMemory ?? 0;

		const capable = !slowPaint && cores >= 8 && (memory === 0 || memory >= 8);

		setCanWarp(capable);
	}, []);

	return canWarp;
}
