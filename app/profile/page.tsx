import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ProfileContent } from "@/components/profile/profile-content"

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your profile settings, listings, and account information.",
  openGraph: {
    title: "My Profile | Auto Market",
    description: "View and manage your profile settings, listings, and account information.",
  }
}

export default async function ProfilePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return <ProfileContent userId={userId} />
} 