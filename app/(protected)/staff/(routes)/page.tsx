import { auth } from "@/auth";
import { Overview } from "@/components/overview";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { CreditCard, DollarSign, Package } from "lucide-react";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: { labId: string }
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {

  interface GraphData {
    name: string;
    total: number;
  }

  const graphRevenue: GraphData[] = [
    { name: 'Jan', total: 12 },
    { name: 'Feb', total: 10 },
    { name: 'Mar', total: 20 },
    { name: 'Apr', total: 40 },
    { name: 'May', total: 15 },
    { name: 'Jun', total: 18 },
    { name: 'Jul', total: 19 },
    { name: 'Aug', total: 30 },
    { name: 'Sep', total: 50 },
    { name: 'Oct', total: 35 },
    { name: 'Nov', total: 3 },
    { name: 'Dec', total: 10 }
  ];


  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/login")
  }

  const lab = await db.labaratory.findUnique({
    where: {
      id: user.labId!,
    }
  })

  if (!lab) {
    redirect("/")
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <Heading title="Dashboard" description="Overview of labaratory" />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Active Now
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                20
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Students
              </CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                20
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Teachers
              </CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                20
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage