"use client";

import Link from 'next/link'
import React from 'react'

export default function Viewmore({ url, className, text }: { url: string, className: string, text: string}) {
    return (
        <>
            <Link
                href={url}
                className={`flex items-center justify-center gap-2 min-w-[250px] bg-gradient-to-r from-[#4E54C8] to-[#8F94FB] text-white px-4 py-2 rounded-[50px] text-[3vmin] font-medium transition duration-200 
                        hover:bg-none bg-[#DEE2E6] hover:text-black ${className}`}
            >
                {text}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={11}
                    height={16}
                    className="transition duration-0 hover:fill-black"
                    viewBox="0 0 11 16"
                >
                    <path d="M6.71622 8L0.5 2.25L2.39189 0.5L10.5 8L2.39189 15.5L0.5 13.75L6.71622 8Z" fill="currentcolor" />
                </svg>
            </Link>
        </>
    )
}
