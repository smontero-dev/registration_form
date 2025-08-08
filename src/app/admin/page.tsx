"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";

export default function AdminPage() {
  const { user, signOut } = useAuthenticator((context) => [context.user])

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, {user?.username}!</p>
      <button className="font-bold" onClick={signOut}>Sign Out</button>
    </div>
  );
}