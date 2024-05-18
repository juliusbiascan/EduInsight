import React from 'react'
import { MainNav } from './main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from '@/components/auth/user-button';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Image from 'next/image';
import { MobileNav } from './mobile-nav';
import { getUserById } from '@/data/user';

const Navbar = async () => {

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

  return (
    <div className='border-b'>
      <div className='flex items-center h-16 px-4 gap-4'>
        <MobileNav />

        <Image src={"/smnhs_logo.png"} alt={'logo'} width={50} height={50} />

        <h2 className=''>{lab.name}</h2>

        <MainNav className='mx-6' />

        <div className='flex items-center ml-auto space-x-4'>
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export default Navbar
