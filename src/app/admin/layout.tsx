"use client";

import { Authenticator, Theme, ThemeProvider, useAuthenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import "@/lib/amplify-config";
import AdminHeader from "@/components/ui/AdminHeader";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const theme: Theme = {
        tokens: {
            components: {
                button: {
                    primary: {
                        backgroundColor: "#1e213a"
                    },
                    link: {
                        color: "#1e213a"
                    }
                }
            }
        },
        name: "custom"
    }

    const { user, signOut } = useAuthenticator();

    return (
        <ThemeProvider theme={theme}>
            {/* <Authenticator variation="modal" hideSignUp>
                {({ signOut }) => (
                    <div>
                        <AdminHeader signOut={signOut} />
                        <main className="p-8">
                            {children}
                        </main>
                    </div>
                )}
            </Authenticator> */}
            <Authenticator variation="modal" hideSignUp />
            {user &&
                <>
                    {/* <AdminHeader /> */}
                    <main className="p-8">
                        {children}
                    </main>
                </>
            }
        </ThemeProvider>
    );
}