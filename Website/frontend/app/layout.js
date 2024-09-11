import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { Context } from "./contexts/UserContext";
config.autoAddCss = false;

// Setup the font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Aquapong",
  description: "by me weeee",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href="/aquafavicon.png" type="image/x-icon" />
      </head>
      <body>
        <Context>
            {children}
        </Context>
      </body>
    </html>
  );
}
