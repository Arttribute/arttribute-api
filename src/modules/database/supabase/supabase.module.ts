import { forwardRef, Global, Module } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [SupabaseService],
	exports: [SupabaseService],
})
export class SupabaseModule {}
