
import { CartProvider } from "./context/CartContext";
import { Geist, Geist_Mono, Imprima } from "next/font/google";
import Header from "./components/header/page";
import "./globals.css";
import Footer from "./components/footer/page";
import Navbar from "./components/navBar/page";
import { cookies } from 'next/headers'
import { verifyJwt } from "@/lib/jwt";




export async function GET() {
  const token = cookies().get('token')?.value

  if (!token) {
    return Response.json({ user: null }, { status: 401 })
  }

  const user = verifyJwt(token) // تحقق من التوكن

  return Response.json({ user })
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "fursati",
  description: "uniforms store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="rtl">

      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <CartProvider>
          <Header />
          <Navbar />
          <main>{children}</main>
          <Footer />

        </CartProvider>
      </body>
    </html>
  );
}
