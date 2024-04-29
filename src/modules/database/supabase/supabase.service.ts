import { Injectable } from "@nestjs/common";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";

@Injectable()
export class SupabaseService {
	private drizzleClient;
	constructor() {
		const isLambda = Boolean(process.env.LAMBDA_TASK_ROOT);

		this.drizzleClient = drizzle(
			postgres({
				host: process.env.SUPABASE_POSTGRES_HOST || "",
				port: isLambda
					? 6543
					: parseInt(process.env.SUPABASE_POSTGRES_PORT || "") ||
						undefined,
				database: process.env.SUPABASE_POSTGRES_DATABASE || "",
				user: process.env.SUPABASE_POSTGRES_USER || "",
				password: process.env.SUPABASE_POSTGRES_PASSWORD || "",
				prepare: isLambda ? false : undefined,
			}),
			{ schema }
		);
	}

	public get client() {
		return this.drizzleClient;
	}
}
