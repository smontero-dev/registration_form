import { AuthEventData } from "@aws-amplify/ui";

type AdminHeaderProps = {
  signOut: ((data?: AuthEventData | undefined) => void) | undefined;
};

export default function AdminHeader({ signOut }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-[#1e213a] px-8 py-4 text-white">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <button
        onClick={signOut}
        className="cursor-pointer rounded-md bg-white px-6 py-3 font-bold text-[#1e213a] transition-colors hover:bg-gray-100"
      >
        Sign Out
      </button>
    </header>
  );
}
