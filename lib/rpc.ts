import "server-only";
import { sql } from "@/db/client";

/*
  Server-only RPC gateway. Every public write goes through a SECURITY DEFINER
  function (Doc 06 §5), never a direct table insert. The functions own the
  authorisation, rate limiting, validation and (for referrals) encryption.

  Payload is passed as a parameterised JSON string cast to jsonb: injection-safe
  (the value is always a bound parameter, never interpolated) and bundler-safe
  (postgres.js's sql.json() helper misbehaves once bundled by Next).
*/

async function callRpc(
	fn: "submit_enquiry" | "create_referral" | "submit_booking",
	payload: Record<string, unknown>,
): Promise<string> {
	if (!sql) throw new Error("no database");
	const json = JSON.stringify(payload);
	/*
	  One branch per function rather than interpolating the name. The function
	  name can never come from the payload, and postgres.js still binds the
	  payload as a parameter in every branch.
	*/
	const [row] =
		fn === "submit_enquiry"
			? await sql<{ id: string }[]>`select submit_enquiry(${json}::jsonb) as id`
			: fn === "submit_booking"
				? await sql<
						{ id: string }[]
					>`select submit_booking(${json}::jsonb) as id`
				: await sql<
						{ id: string }[]
					>`select create_referral(${json}::jsonb) as id`;
	return row.id;
}

export const callSubmitEnquiry = (payload: Record<string, unknown>) =>
	callRpc("submit_enquiry", payload);
export const callCreateReferral = (payload: Record<string, unknown>) =>
	callRpc("create_referral", payload);
export const callSubmitBooking = (payload: Record<string, unknown>) =>
	callRpc("submit_booking", payload);
