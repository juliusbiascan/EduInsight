import React from 'react'
import { MainNav } from './main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from '@/components/auth/user-button';
import LabSwitcher from './lab-switcher';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Image from 'next/image';
import { MobileNav } from './mobile-nav';

const Navbar = async () => {

  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const lab = await db.labaratory.findMany({
    where: {
      userId: session.user.id
    }
  });

  return (
    <div className='border-b'>
      <div className='flex items-center h-16 px-4 gap-4'>
        <Image src={"/smnhs_logo.png"} alt={'logo'} width={50} height={50} />
        <LabSwitcher items={lab} />
        <MainNav className='mx-6' />
        <MobileNav />
        <div className='flex items-center ml-auto space-x-4'>
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export default Navbar
