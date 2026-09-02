import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tabletop Corp. — Ficha de Jogador",
  description: "Criador automático de fichas para Tabletop Corp., com perks, talentos, habilidades por Moeda e salvamento local.",
  icons: {
    icon: `${process.env.PAGES_BASE_PATH || ""}/favicon.svg`,
    shortcut: `${process.env.PAGES_BASE_PATH || ""}/favicon.svg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
