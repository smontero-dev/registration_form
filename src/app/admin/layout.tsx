"use client";

import { Authenticator, Theme, ThemeProvider } from "@aws-amplify/ui-react";
// import '@aws-amplify/ui-react/styles.css';
import "@/lib/amplify-config";
import AdminHeader from "@/components/ui/AdminHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const metadata = {
    title: "Admin Dashboard",
    description: "Dashboard para la gestión de estudiantes y rutas escolares",
};

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

    return (
        <html lang="es">
            <head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
            </head>
            <body>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>
                        <Authenticator variation="modal" hideSignUp>
                            {({ signOut }) => (
                                <div className="h-screen grid grid-rows-[auto_1fr]">
                                    <AdminHeader signOut={signOut} />
                                    <main className="overflow-hidden">
                                        {children}
                                    </main>
                                </div>
                            )}
                        </Authenticator>
                    </ThemeProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}