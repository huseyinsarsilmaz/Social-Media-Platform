import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Social Media Platform",
  description: "A twitter like social media platform",
};


 export default function RootLayout(props : any) {
   return (
     <html lang="en">
       <body>
+        <AppRouterCacheProvider>
           {props.children}
+        </AppRouterCacheProvider>
       </body>
     </html>
   );
 }