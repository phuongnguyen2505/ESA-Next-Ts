"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

export default function AboutUs() {
	const sectionRef = useRef(null);
	const headingRef = useRef(null);
	const textRef = useRef(null);
	const statsRef = useRef<HTMLDivElement>(null);
	const missionRef = useRef(null);
	const visionRef = useRef(null);
	const fig1Ref = useRef(null);
	const fig2Ref = useRef(null);

	const stats = [
		{ value: "10+", label: "Years Experience" },
		{ value: "200+", label: "Clients Worldwide" },
		{ value: "15+", label: "Industry Awards" },
		{ value: "24/7", label: "Support Available" },
	];

	useEffect(() => {
		if (typeof window !== "undefined") {
			gsap.registerPlugin(ScrollTrigger);

			// Heading animation
			gsap.fromTo(
				headingRef.current,
				{ x: -50, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					duration: 1,
					scrollTrigger: {
						trigger: sectionRef.current,
						start: "top 80%",
					},
				},
			);

			// Text animation
			gsap.fromTo(
				textRef.current,
				{ y: 20, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 0.8,
					delay: 0.3,
					scrollTrigger: {
						trigger: textRef.current,
						start: "top 80%",
					},
				},
			);

			// Stats animation
			if (statsRef.current) {
				gsap.fromTo(
					Array.from(statsRef.current.children),
					{ scale: 0.8, opacity: 0 },
					{
						scale: 1,
						opacity: 1,
						stagger: 0.2,
						duration: 0.6,
						scrollTrigger: {
							trigger: statsRef.current,
							start: "top 85%",
						},
					},
				);
			}

			// Mission box animation
			gsap.fromTo(
				missionRef.current,
				{ x: -30, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					duration: 0.8,
					scrollTrigger: {
						trigger: missionRef.current,
						start: "top 85%",
					},
				},
			);

			// Vision box animation
			gsap.fromTo(
				visionRef.current,
				{ x: 30, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					duration: 0.8,
					scrollTrigger: {
						trigger: visionRef.current,
						start: "top 85%",
					},
				},
			);

			// Image animations
			gsap.fromTo(
				fig1Ref.current,
				{ y: 50, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 1,
					scrollTrigger: {
						trigger: fig1Ref.current,
						start: "top 85%",
					},
				},
			);

			gsap.fromTo(
				fig2Ref.current,
				{ y: -50, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 1,
					delay: 0.3,
					scrollTrigger: {
						trigger: fig2Ref.current,
						start: "top 85%",
					},
				},
			);
		}
	}, []);

	return (
		<section
			ref={sectionRef}
			className="bg-[#202037] relative flex items-center overflow-hidden py-12"
		>
			<div className="container mx-auto px-4 md:px-8 lg:px-20 text-white">
				<h1
					ref={headingRef}
					className="font-bold text-[13vmin] md:text-[13vmin] mb-8 text-center"
				>
					About Us
				</h1>
				<div className="flex flex-col xl:flex-row gap-8 items-stretch">
					<div className="flex-1 bg-[#2a2a4a] h-fit p-6 md:p-8 rounded-lg shadow-lg">
						<p
							ref={textRef}
							className="text-base md:text-lg leading-relaxed mb-6 text-justify"
						>
							We are a company specializing in providing energy-saving solutions
							for VESA devices. With a team of experienced experts, we are
							committed to delivering the highest quality products and services to
							our customers.
						</p>
						<div
							ref={statsRef}
							className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
						>
							{stats.map((stat, index) => (
								<div
									key={index}
									className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
								>
									<div className="text-2xl md:text-3xl font-bold text-indigo-600 mb-1">
										{stat.value}
									</div>
									<div className="text-sm md:text-base text-gray-600 font-medium">
										{stat.label}
									</div>
								</div>
							))}
						</div>
						<div className="grid md:grid-cols-2 gap-4">
							<div
								ref={missionRef}
								className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-lg text-white"
							>
								<h2 className="text-xl md:text-2xl font-semibold">Our Mission</h2>
								<p className="text-sm md:text-base mt-4 leading-relaxed">
									To innovate and provide sustainable energy solutions that
									enhance the efficiency and performance of VESA devices,
									contributing to a greener future.
								</p>
							</div>
							<div
								ref={visionRef}
								className="bg-white border border-gray-200 p-6 rounded-lg shadow-md"
							>
								<h2 className="text-xl md:text-2xl font-semibold text-gray-800">
									Our Vision
								</h2>
								<p className="text-sm md:text-base mt-4 leading-relaxed text-gray-800">
									To be the leading provider of innovative energy-saving
									solutions, recognized globally for our commitment to quality,
									sustainability, and customer satisfaction.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
