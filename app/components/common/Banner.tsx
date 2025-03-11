"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { usePathname } from 'next/navigation';

interface BannerProps {}

const bannerItems = [
    { path: "about", title: "About Us", des: "Learn about our story, our mission, and the people who make it all happen." },
    { path: "products", title: "Products", des: "Explore our innovative product lineup." },
    { path: "services", title: "Services", des: "Discover our comprehensive range of services." },
    { path: "news", title: "News", des: "Stay updated with our latest news and announcements." },
    { path: "contact", title: "Contact", des: "Get in touch with us today." },
];

export default function Banner({}: BannerProps) {
    const pathname = usePathname();
    const currentPath = pathname?.split('/en/')[1] || "";
    
    const currentBanner = bannerItems.find(item => item.path === currentPath) 
        || { title: "Welcome", des: "Welcome to our website" };

    return (
        <section className="bg-[#202037] relative flex items-center overflow-hidden py-10 rounded-t-2xl">
            <div className="ml-[100px] mr-[100px]">
                <h1 className="text-left text-[20vmin] font-bold text-white">
                    {currentBanner.title}
                </h1>
                <p className="text-left text-[3vmin] text-white">
                    {currentBanner.des}
                </p>
            </div>
        </section>
    );
}

