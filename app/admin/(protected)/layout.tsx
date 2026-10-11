import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin-sidebar";
import AdminTopbar from "@/components/admin-topbar";
import { createClient } from "@/lib/supabase/server";

// The middleware already redirects signed-out visitors before this layout
// renders. This second check is defense in depth — it also gives us the
// admin's email for the topbar without an extra client-side request.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-sand/40 md:flex">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8">
        <AdminTopbar email={user.email ?? ""} />
        {children}
      </main>
    </div>
  );
}
