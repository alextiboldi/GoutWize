import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in — GoutWize",
  description:
    "Sign in to GoutWize with a magic link. No passwords needed — just enter your email and we'll send you a secure login link.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
