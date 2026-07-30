import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-6 py-16">
      <p className="text-foreground/70">
        Dashboard — coming in the next build step.
      </p>
    </main>
  );
}
