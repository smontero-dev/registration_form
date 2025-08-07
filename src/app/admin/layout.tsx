"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || "",
            loginWith: {
                username: true
            },
        }
    }
})

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    if (true) {
        return (
            <Authenticator>
                {({ signOut, user }) => (
                    <div className="min-h-screen bg-gray-50 py-8">
                        <div className="container mx-auto px-4">
                            <h1 className="text-2xl font-bold mb-4">Bienvenido, {user?.username}</h1>
                            <button onClick={signOut} className="mb-4 bg-red-500 text-white px-4 py-2 rounded">
                                Cerrar sesión
                            </button>
                            {children}
                        </div>
                    </div>
                )}
            </Authenticator>
        )
    }

    return (
        <div>
            {children}
        </div>
    );
}