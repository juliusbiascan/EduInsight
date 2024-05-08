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
            href: `/${params.labId}`,
            label: 'Overview',
            active: pathname === `/${params.labId}`,
        },
        {
            href: `/${params.labId}/devices`,
            label: 'Devices',
            active: pathname === `/${params.labId}/devices`,
        },
        {
            href: `/${params.labId}/monitoring`,
            label: 'Monitoring',
            active: pathname === `/${params.labId}/monitoring`,
        },
        {
            href: `/${params.labId}/staff`,
            label: 'Manage Staff',
            active: pathname === `/${params.labId}/staff`,
        },
        {
            href: `/${params.labId}/controlpanel`,
            label: 'Control Panel',
            active: pathname === `/${params.labId}/controlpanel`,
        },
        {
            href: `/${params.labId}/settings`,
            label: 'Settings',
            active: pathname === `/${params.labId}/settings`,
        },
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
