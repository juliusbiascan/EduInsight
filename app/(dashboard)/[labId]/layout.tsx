import Navbar from "../../../components/navbar";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { SiteFooter } from "@/components/ui/site-footer";


export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { pageId: string }
}) {

  const session = await auth();

  if (!session) {
    redirect("/login")
  }

  const lab = await db.labaratory.findFirst({
    where: {
      id: params.pageId,
      userId: session.user.id,
    }
  });


  if (!lab) {
    redirect('/');
  };

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 mt-14">{children}</div>
        <SiteFooter />
      </div>
    </>
  );
};
