"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface BannerProps {}

const bannerItems = [
    {
        path: "about",
        title: "About Us",
        des: "Learn about our story, our mission, and the people who make it all happen.",
    },
    {
        path: "products",
        title: "Products",
        des: "Explore our innovative product lineup.",
    },
    {
        path: "services",
        title: "Services",
        des: "Discover our comprehensive range of services.",
    },
    {
        path: "news",
        title: "News",
        des: "Stay updated with our latest news and announcements.",
    },
    {
        path: "contact",
        title: "Contact",
        des: "Get in touch with us today.",
    },
];

export default function Banner({}: BannerProps) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const pathname = usePathname();
    let currentPath = "";

    if (pathname) {
        if (pathname.includes("/en/")) {
            currentPath = pathname.split("/en/")[1];
        } else {
            currentPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
        }
        // Ensure only the first segment is used
        currentPath = currentPath.split("/")[0];
    }

    const currentBanner =
        bannerItems.find((item) => item.path === currentPath) || {
            title: "Welcome",
            des: "Welcome to our website",
        };

    useEffect(() => {
        if (titleRef.current && descRef.current) {
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: -50 },
                { opacity: 1, y: 0, duration: 1 }
            );
            gsap.fromTo(
                descRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, delay: 0.5 }
            );
        }
    }, [currentBanner.title, currentBanner.des]);

    return (
        <section className="bg-[#202037] relative flex items-center overflow-hidden py-10 rounded-t-2xl">
            <div className="ml-[100px] mr-[100px]">
                <h1 ref={titleRef} className="text-left text-[20vmin] font-bold text-white">
                    {currentBanner.title}
                </h1>
                <p ref={descRef} className="text-left text-[3vmin] text-white">
                    {currentBanner.des}
                </p>
            </div>
        </section>
    );
}
