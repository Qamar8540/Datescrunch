import LogoutButton from "@/components/logout-button";

export default function AdminTopbar({ email }: { email: string }) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-sand pb-4">
      <p className="text-sm text-stone">
        Signed in as <span className="text-coffee">{email}</span>
      </p>
      <LogoutButton />
    </div>
  );
}
