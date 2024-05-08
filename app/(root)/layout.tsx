import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth()

  if (!session) {
    redirect("/welcome")
  }

  const page = await db.labaratory.findFirst({
    where: {
      userId: session.user.id
    }
  })

  if (page) {
    redirect(`/${page.id}`)
  }

  return (
    <>
      {children}
    </>
  )
}
