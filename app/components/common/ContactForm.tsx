"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axiosInstance from "@/lib/axios";
import { Contact } from "@/types/contact";

export default function ContactForm() {
	const sectionRef = useRef(null);
	const headingRef = useRef(null);
	const formRef = useRef(null);
	const infoRef = useRef(null);
	const socialRef = useRef<HTMLDivElement>(null);

	const [formData, setFormData] = useState<Contact>({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [status, setStatus] = useState<{
		type: "success" | "error" | null;
		message: string;
	}>({
		type: null,
		message: "",
	});

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			// Heading animation
			gsap.from(headingRef.current, {
				y: 50,
				opacity: 0,
				duration: 1,
				scrollTrigger: {
					trigger: headingRef.current,
					start: "top 80%",
				},
			});

			// Form animation
			gsap.from(formRef.current, {
				x: -50,
				opacity: 0,
				duration: 1,
				delay: 0.3,
				scrollTrigger: {
					trigger: formRef.current,
					start: "top 80%",
				},
			});

			// Info panel animation
			gsap.from(infoRef.current, {
				x: 50,
				opacity: 0,
				duration: 1,
				delay: 0.3,
				scrollTrigger: {
					trigger: infoRef.current,
					start: "top 80%",
				},
			});

			// Social icons stagger animation
			if (socialRef.current) {
				gsap.from(socialRef.current.children, {
					scale: 0,
					opacity: 0,
					duration: 0.5,
					delay: 1,
					stagger: 0.1,
					scrollTrigger: {
						trigger: socialRef.current,
						start: "top 85%",
					},
				});
			}
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await axiosInstance.post("/api/contacts", formData);

			setStatus({
				type: "success",
				message: "Thank you for your message! We will get back to you soon.",
			});

			// Reset form
			setFormData({
				name: "",
				email: "",
				subject: "",
				message: "",
			});

			// Clear success message after 5 seconds
			setTimeout(() => {
				setStatus({ type: null, message: "" });
			}, 5000);
		} catch (error: any) {
			console.error("Error submitting form:", error?.response?.data || error);
			setStatus({
				type: "error",
				message:
					error?.response?.data?.message ||
					"Something went wrong. Please try again later.",
			});
		}
	};

	return (
		<section
			ref={sectionRef}
			className="relative w-full bg-gradient-to-b from-gray-50 to-gray-100 py-16 md:py-24 overflow-hidden"
		>
			{/* Popup Notification */}
			{status.type && (
				<div
					className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
						status.type === "success"
							? "bg-green-100 text-green-700"
							: "bg-red-100 text-red-700"
					}`}
				>
					{status.message}
				</div>
			)}

			{/* Background decoration */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)]"></div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="text-center mb-14" ref={headingRef}>
					<h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#23233d] to-[#444466] mb-4">
						Get In Touch
					</h2>
					<p className="max-w-2xl mx-auto text-gray-600 text-lg">
						Have questions or want to learn more? Contact us today.
					</p>
					<div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl mx-auto mt-4" />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					{/* Form Section */}
					<div
						ref={formRef}
						className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300"
					>
						<h3 className="text-2xl font-semibold mb-6 text-[#23233d]">
							Send us a message
						</h3>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="mb-4">
								<label htmlFor="name" className="block text-gray-700 mb-2">
									Your Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="email" className="block text-gray-700 mb-2">
									Your Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>
							<div className="mb-4">
								<label htmlFor="subject" className="block text-gray-700 mb-2">
									Subject
								</label>
								<input
									type="text"
									id="subject"
									name="subject"
									value={formData.subject}
									onChange={handleChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								/>
							</div>
							<div className="mb-6">
								<label htmlFor="message" className="block text-gray-700 mb-2">
									Your Message
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									rows={5}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
									required
								></textarea>
							</div>
							<button
								type="submit"
								className="w-full bg-gradient-to-r from-[#23233d] to-[#444466] text-white px-6 py-3 rounded-xl 
                                transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 
                                focus:ring-[#23233d] focus:ring-opacity-50"
							>
								Send Message
							</button>
						</form>
					</div>

					{/* Info Section */}
					<div
						ref={infoRef}
						className="bg-gradient-to-br from-[#23233d] to-[#444466] text-white p-8 rounded-2xl shadow-lg 
                        transform hover:scale-[1.02] transition-transform duration-300"
					>
						<div>
							<h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
							<p className="mb-8">
								We are here to help and answer any questions you might have. We
								look forward to hearing from you.
							</p>
							<div className="space-y-4">
								<div className="flex items-start">
									<div className="flex-shrink-0 h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
										<svg
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</div>
									<div>
										<h4 className="text-lg font-medium">Address</h4>
										<p className="text-white text-opacity-80">
											
										</p>
									</div>
								</div>
								<div className="flex items-start">
									<div className="flex-shrink-0 h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
										<svg
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											/>
										</svg>
									</div>
									<div>
										<h4 className="text-lg font-medium">Phone</h4>
										<p className="text-white text-opacity-80"></p>
									</div>
								</div>
								<div className="flex items-start">
									<div className="flex-shrink-0 h-10 w-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
										<svg
											className="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div>
										<h4 className="text-lg font-medium">Email</h4>
										<p className="text-white text-opacity-80">
											
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="mt-8">
							<h4 className="text-lg font-medium mb-4">Follow Us</h4>
							<div ref={socialRef} className="flex space-x-4">
								{[
									{ name: "Facebook", icon: "/images/fb.svg" },
									{ name: "Zalo", icon: "/images/zalo.svg" },
									{ name: "Youtube", icon: "/images/ytb.svg" },
								].map((social) => (
									<Link
										key={social.name}
										href="/"
										className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center 
                                        hover:bg-white/20 transform hover:scale-110 transition-all duration-300"
									>
										<span className="sr-only">{social.name}</span>
										<Image
											src={social.icon}
											alt={social.name}
											width={24}
											height={24}
											className="w-6 h-6"
											priority
										/>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
