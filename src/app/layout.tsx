"use client";

import "./globals.css";
import { Suspense } from "react";

const metadata = {
  title: "Formulario de Registro",
  description: "Registro de estudiantes para el transporte escolar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
