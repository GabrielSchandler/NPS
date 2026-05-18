import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SAC NPS | Visão Executiva",
  description: "Dashboard executivo online para acompanhamento de NPS, SMS e retorno do SAC."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
