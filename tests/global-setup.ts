import postgres from "postgres";

/*
  Reset transient state before an e2e run so form-gate tests start clean.
  The rate limiter buckets by hashed IP; all local test traffic shares one
  bucket, so without this the RPC (correctly) throttles repeated runs.
*/
export default async function globalSetup() {
	const url = process.env.DATABASE_URL;
	if (!url) return;
	const sql = postgres(url, { max: 1 });
	try {
		await sql`delete from rate_limits`;
	} finally {
		await sql.end();
	}
}
