import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader"; import { SiteFooter } from "@/components/SiteFooter";
export const metadata:Metadata={title:"Saarthi — public grievance, made clear",description:"A calmer way to file and track public grievances."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><div className="site-frame"><SiteHeader/><main>{children}</main><SiteFooter/></div></body></html>}
