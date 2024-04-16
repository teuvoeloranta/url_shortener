import { Lato } from "next/font/google";
import { ReactNode } from "react";
import { SiCodemagic } from "react-icons/si";

const lato = Lato({
  weight: ["400", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`${lato.variable} font-lato flex flex-col min-h-screen`}>
      <header className="border-b border-gray-300 border-dashed py-6 px-4 sm:px-10 shadow-md shadow-gray-200/60 flex items-center">
        <strong className="font-extrabold text-2xl flex items-center gap-2">
          <SiCodemagic className="text-black" /> <span>Url Shortener</span>
        </strong>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
