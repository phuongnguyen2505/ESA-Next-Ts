"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

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

			// Main heading animation
			gsap.fromTo(
				headingRef.current,
				{ x: -100, opacity: 0 },
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

			// Main text animation
			gsap.fromTo(
				textRef.current,
				{ y: 50, opacity: 0 },
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
				{ x: -50, opacity: 0 },
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
				{ x: 50, opacity: 0 },
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

			// Images animation
			gsap.fromTo(
				fig1Ref.current,
				{ y: 100, opacity: 0 },
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
				{ y: -100, opacity: 0 },
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
			className="bg-[#202037] relative flex items-center overflow-hidden py-10"
		>
			<div className="relative w-full text-white px-4 md:px-8 lg:px-[100px]">
				<h1
					ref={headingRef}
					className="font-bold text-[15vmin] md:text-[20vmin] mb-6"
				>
					About Us
				</h1>
				<div className="flex flex-col lg:flex-row w-full justify-between gap-0">
					<div className="relative flex flex-col flex-1 justify-between p-4 md:p-6 bg-[#2a2a4a] rounded-lg shadow-lg">
						<p ref={textRef} className="md:text-lg leading-relaxed text-justify">
							We are a company specializing in providing energy-saving solutions
							for VESA devices. With a team of experienced experts, we are
							committed to delivering the highest quality products and services to
							our customers.
						</p>
						<div
							ref={statsRef}
							className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
						>
							{stats.map((stat, index) => (
								<div
									key={index}
									className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
								>
									<div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
										{stat.value}
									</div>
									<div className="text-gray-600 font-medium">{stat.label}</div>
								</div>
							))}
						</div>
						<div className="grid md:grid-cols-2 gap-4">
							<div
								ref={missionRef}
								className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-lg text-white"
							>
								<h2 className="text-xl md:text-2xl font-semibold">Our Mission</h2>
								<p className="text-base md:text-lg leading-relaxe mt-4">
									To innovate and provide sustainable energy solutions that
									enhance the efficiency and performance of VESA devices,
									contributing to a greener future.
								</p>
							</div>
							<div
								ref={visionRef}
								className="bg-white border border-gray-200 p-8 rounded-lg shadow-md"
							>
								<h2 className="text-xl md:text-2xl font-semibold text-gray-800">
									Our Vision
								</h2>
								<p className="text-base md:text-lg leading-relaxed mt-4 text-gray-800">
									To be the leading provider of innovative energy-saving
									solutions, recognized globally for our commitment to quality,
									sustainability, and customer satisfaction.
								</p>
							</div>
						</div>
					</div>
					<div className="relative lg:w-[550px] h-[400px] md:h-[680px] mx-auto">
						<div
							ref={fig2Ref}
							className="fig2 w-[250px] md:w-[350px] h-[300px] md:h-[450px] absolute rounded-3xl top-0 right-0 bg-cover bg-no-repeat"
						></div>
						<div
							ref={fig1Ref}
							className="fig1 w-[250px] md:w-[350px] h-[300px] md:h-[450px] absolute rounded-3xl top-[20%] md:top-[34%] right-16 md:right-32 bg-cover bg-no-repeat"
						></div>
					</div>
				</div>
			</div>
		</section>
	);
}
