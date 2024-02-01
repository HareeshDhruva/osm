import "./globals.css";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import PhotoContestProvider from "./Context/UserContest";
import QueryProvider from "./QueryProvider";

export const metadata = {
  title: "one social media",
  description:
    "Connecting people, one post at a time. Welcome to one social media platform for sharing moments, connecting with friends, and discovering what matters to you. Join the community today and make every day memorable. #ConnectShareDiscover #SocialMediaRevolution #oms #one-social-media #oneSocialMedia #onesocialmedia #1socialmedia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <PhotoContestProvider>{children}</PhotoContestProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
