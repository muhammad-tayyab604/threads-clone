'use client'
import Link from 'next/link'
import React from 'react'
import {sidebarLinks} from "@/constants/index.js"
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn } from '@clerk/nextjs'

const LeftSidebar = () => {
  const router = useRouter()
  const pathName = usePathname()
  return (
    <section className='custome-scrollbar leftsidebar'>
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {
          sidebarLinks.map((link)=> 
          {
            const isActive = (pathName.includes (link.route) && link.route.length > 1) || pathName === link.route
            return (
            <div className="">
              <Link href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
              >
              <Image src={link.imgURL} alt={link.label} width={24} height={24} />
              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
              </Link>
            </div>
          )})}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
                    <SignOutButton signOutCallback={()=> router.push('/sign-in')}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image src="/assets/logout.svg" alt="logout" width={24} height={24}  />
                            <p className="max-lg:hidden text-light-1">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
      </div>
    </section>
  )
}

export default LeftSidebar