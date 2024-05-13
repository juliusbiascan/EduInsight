import { format } from 'date-fns'
import { db } from '@/lib/db'
import { RegistrationClient } from './components/client'
import { RegistrationColumn } from './components/columns'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getUserById } from '@/data/user'

const RegistrationPage = async () => {

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

  const devUser = await db.deviceUser.findMany({
    where: {
      labId: lab.id,
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedDevices: RegistrationColumn[] = devUser.map(item => ({
    id: item.id,
    labId: item.labId,
    name: item.name,
    image: item.image,
    role: item.role,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <RegistrationClient data={formattedDevices} />
      </div>
    </div>
  )
}

export default RegistrationPage;