import "server-only";
import { createReadOnlyServerClient } from "../../../supabase/clients/server";

export async function getServerUserId() {
    const supabase = createReadOnlyServerClient();
    const { data } = await supabase.auth.getUser();
    return data?.user?.id;
}