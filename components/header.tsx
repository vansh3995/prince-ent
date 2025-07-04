"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Truck, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAdminAuth } from "@/context/admin-auth-context"

const navItems = [
	{ name: "About Us", href: "/about" },
	{ name: "Services", href: "/services" },
	{ name: "E-Booking", href: "/booking" },
	{ name: "Track", href: "/track" },
	{ name: "Network", href: "/network" },
	{ name: "Contact Us", href: "/contact" },
]

const adminNavItems = [
	{ name: "Dashboard", href: "/admin" }
]

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const pathname = usePathname()
	const { user, logout } = useAdminAuth()

	return (
		<header className="border-b bg-white shadow-sm sticky top-0 z-50">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center space-x-2">
						<Link href="/" className="flex items-center space-x-2">
							<Truck className="h-8 w-8 text-red-600" />
							<span className="text-xl font-bold text-gray-900">
								PRINCE ENTERPRISES
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"text-gray-700 hover:text-red-600 font-medium transition-colors",
									pathname === item.href && "text-red-600 font-semibold",
								)}
							>
								{item.name}
							</Link>
						))}
						{user ? (
							<>
								{adminNavItems.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className={cn(
											"text-gray-700 hover:text-red-600 font-medium transition-colors",
											pathname === item.href && "text-red-600 font-semibold",
										)}
									>
										{item.name}
									</Link>
								))}
								<span className="mr-4">Welcome, Admin</span>
								<Button
									onClick={logout}
									className="bg-red-600 hover:bg-red-700 text-white"
								>
									Logout
								</Button>
							</>
						) : (
							<>
								<Link href="/admin/login">
									<Button
										size="sm"
										className="bg-red-600 hover:bg-red-700 text-white"
									>
										Admin Login
									</Button>
								</Link>
								<Link href="/register">
									<Button size="sm" className="bg-red-600 hover:bg-red-700">
										Register
									</Button>
								</Link>
								<Link href="/login">
									<Button variant="outline" size="sm">
										Login
									</Button>
								</Link>
							</>
						)}
					</nav>

					{/* Mobile menu button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{mobileMenuOpen && (
				<div className="md:hidden bg-white border-t py-4">
					<div className="container mx-auto px-4 space-y-3">
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"block py-2 text-gray-700 hover:text-red-600 font-medium",
									pathname === item.href && "text-red-600 font-semibold",
								)}
								onClick={() => setMobileMenuOpen(false)}
							>
								{item.name}
							</Link>
						))}
						<div className="pt-4 flex flex-col space-y-2">
							{user ? (
								<>
									<span className="text-center mb-2">Welcome, Admin</span>
									<Button
										onClick={() => {
											setMobileMenuOpen(false)
											logout()
										}}
										className="bg-red-600 hover:bg-red-700 text-white"
									>
										Logout
									</Button>
								</>
							) : (
								<>
									<Link
										href="/admin/login"
										onClick={() => setMobileMenuOpen(false)}
									>
										<Button
											size="sm"
											className="bg-red-600 hover:bg-red-700 text-white w-full justify-center"
										>
											Admin Login
										</Button>
									</Link>
									<Link
										href="/register"
										onClick={() => setMobileMenuOpen(false)}
									>
										<Button
											size="sm"
											className="bg-red-600 hover:bg-red-700 w-full justify-center"
										>
											Register
										</Button>
									</Link>
									<Link
										href="/login"
										onClick={() => setMobileMenuOpen(false)}
									>
										<Button
											variant="outline"
											size="sm"
											className="w-full justify-center"
										>
											Login
										</Button>
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	)
}
