import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if onboarding is complete
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("user_id", user.id)
    .single();

  if (!business) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7" }}>
      <DashboardNav businessName={business.name} />
      <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
