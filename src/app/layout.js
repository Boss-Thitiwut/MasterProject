"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import styles from "./layout.module.css"; // NEW

export default function RootLayout({ children }) {
    const [role, setRole] = useState("non-user");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchRole = () => {
            const storedRole = localStorage.getItem("role") || "non-user";
            setRole(storedRole);
        };
        window.addEventListener("roleChange", fetchRole);
        fetchRole();
        return () => {
            window.removeEventListener("roleChange", fetchRole);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("role");
        setRole("non-user");
        router.push("/");
        window.dispatchEvent(new Event("roleChange"));
    };

    const getMenuItems = () => {
        switch (role) {
            case "admin":
                return [
                  //  { label: "Home", href: "/" },
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Questions", href: "/questions" }
                 //   { label: "Admin", href: "/admin" },
                  //  { label: "User Survey", href: "/users" },
                ];
            case "Product Owner":
            case "Requirements Engineer":
            case "Architectural Designer":
            case "Backend Developer":
            case "Frontend Developer":
            case "DevOps":
            case "Quality Engineer":
                return [
                    { label: "User Survey", href: "/users" },
                ];
            default:
                return [{ label: "Home", href: "/" }];
        }
    };

    const menuItems = getMenuItems();
    const isAuthPage = pathname === "/" || pathname === "/register";

    return (
        <html lang="en">
            <body className={styles.gradient}>
                {isAuthPage ? (
                    <>{children}</>
                ) : (
                    <div className={styles.appLayout}>
                        <aside className={styles.sidebar}>
                            <h2 className={styles.title}>Master-Project</h2>
                            <nav className={styles.nav}>
                                {menuItems.map((item) => (
                                    <Link key={item.href} href={item.href} className={styles.link}>
                                        {item.label}
                                    </Link>
                                ))}
                                {role !== "non-user" && (
                                    <button onClick={handleLogout} className={styles.logout}>
                                        Logout
                                    </button>
                                )}
                            </nav>
                        </aside>
                        <main className={styles.main}>{children}</main>
                    </div>
                )}
            </body>
        </html>
    );
}
