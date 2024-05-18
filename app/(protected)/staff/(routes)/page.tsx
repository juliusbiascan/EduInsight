import { getStudentCount, getTeacherCount, getGuestCount, getActiveCount } from "@/actions/staff";
import { auth } from "@/auth";
import { Overview } from "@/components/overview";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { ActivitySquareIcon, User } from "lucide-react";
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
    redirect("/auth/login")
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/auth/login")
  }

  const lab = await db.labaratory.findUnique({
    where: {
      id: user.labId!,
    }
  })

  if (!lab) {
    redirect("/")
  }


  const activeCount = await getActiveCount(lab.id);
  const studentCount = await getStudentCount(lab.id);
  const teacherCount = await getTeacherCount(lab.id);
  const guestCount = await getGuestCount(lab.id);

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <Heading title="Dashboard" description="Overview of labaratory" />
        <Separator />
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Active Now
              </CardTitle>
              <ActivitySquareIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <User className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Teachers
              </CardTitle>
              <User className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teacherCount}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Guest
              </CardTitle>
              <User className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {guestCount}
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

function getGuestRevenue(storeId: any) {
  throw new Error("Function not implemented.");
}
