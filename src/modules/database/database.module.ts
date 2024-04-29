import { forwardRef, Global, Module } from "@nestjs/common";
import { SupabaseModule } from "./supabase/supabase.module";
import { SupabaseService } from "./supabase/supabase.service";

@Global()
@Module({
	imports: [SupabaseModule],
	controllers: [],
	providers: [],
	exports: [SupabaseModule],
})
export class DatabaseModule {}
