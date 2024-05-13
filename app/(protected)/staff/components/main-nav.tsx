"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/staff`,
            label: 'Overview',
            active: pathname === `/staff`,
        },
        {
            href: `/staff/monitoring`,
            label: 'Monitoring',
            active: pathname === `/staff/monitoring`,
        },
        {
            href: `/staff/registration`,
            label: 'Registration',
            active: pathname === `/staff/registration`,
        },
        {
            href: `/staff/in-out`,
            label: 'In/Out',
            active: pathname === `/staff/in-out`,
        }
    ]

    return (
        <div className="mr-4 hidden md:flex">
            <nav
                className={cn("flex items-center space-x-6 text-sm font-medium", className)}
                {...props}
            >
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            'text-sm font-medium transition-colors hover:text-primary',
                            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
                        )}
                    >
                        {route.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
};
