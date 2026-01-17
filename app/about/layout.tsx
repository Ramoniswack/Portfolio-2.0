import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about R.a.mohan Tiwari - Full-Stack Developer based in Pokhara, Nepal. Self-taught developer specializing in React, Laravel, Django, and modern web technologies.",
  openGraph: {
    title: "About | R.a.mohan Tiwari",
    description: "Learn more about R.a.mohan Tiwari - Full-Stack Developer based in Pokhara, Nepal. Self-taught developer specializing in React, Laravel, Django, and modern web technologies.",
    type: "profile",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
