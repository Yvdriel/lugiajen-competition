import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/AdminDashboard"

export default async function AdminPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return <AdminDashboard />
}
