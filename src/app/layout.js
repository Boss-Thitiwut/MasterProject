"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
    const [role, setRole] = useState("non-user"); // Default role is non-user
    const router = useRouter();

    useEffect(() => {
        // Function to fetch role from localStorage
        const fetchRole = () => {
            const storedRole = localStorage.getItem("role") || "non-user";
            setRole(storedRole);
        };

        // Add listener for roleChange event
        window.addEventListener("roleChange", fetchRole);

        // Initial role fetch
        fetchRole();

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener("roleChange", fetchRole);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role"); // Remove role from localStorage
        setRole("non-user"); // Reset state to non-user
        router.push("/"); // Redirect to home page
        window.dispatchEvent(new Event("roleChange")); // Trigger roleChange event
    };

    // Generate menu items dynamically based on the role
    const getMenuItems = () => {
        switch (role) {
            case "admin":
                return [
                    { label: "Home", href: "/" },
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Questions", href: "/questions" },
                    { label: "Admin", href: "/admin" },
                    { label: "Configuration", href: "/users" },
                ];
            case "user":
                return [
                    { label: "Home", href: "/" },
                    { label: "Questions", href: "/questions" },
                ];
            default:
                return [{ label: "Home", href: "/" }];
        }
    };

    const menuItems = getMenuItems();

    return (
        <html lang="en">
            <body>
                <div className="layout">
                    {/* Sidebar */}
                    <aside className="sidebar">
                        <h2 className="sidebar-title">Master-Project</h2>
                        <nav className="menu">
                            {menuItems.map((item) => (
                                <Link key={item.href} href={item.href} className="menu-item">
                                    {item.label}
                                </Link>
                            ))}
                            {role !== "non-user" && (
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            )}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="content">{children}</main>
                </div>
            </body>
        </html>
    );
}
