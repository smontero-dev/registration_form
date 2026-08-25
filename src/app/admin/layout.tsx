"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.layer.css";
import "@/lib/amplify-config";
import AdminHeader from "@/components/ui/AdminHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminModeProvider } from "@/contexts/AdminModeContext";

const queryClient = new QueryClient();

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Authenticator variation="modal" hideSignUp>
        {({ signOut }) => (
          <AdminModeProvider>
            <div className="h-screen grid grid-rows-[auto_1fr]">
              <AdminHeader signOut={signOut} />
              <main className="overflow-hidden">{children}</main>
            </div>
          </AdminModeProvider>
        )}
      </Authenticator>
    </QueryClientProvider>
  );
}
