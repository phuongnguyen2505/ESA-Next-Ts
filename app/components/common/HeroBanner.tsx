import Link from "next/link";
import Viewmore from "../Ui/Viewmore";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
	const sectionRef = useRef(null);
	const textRef = useRef(null);
	const h1Ref = useRef(null);
	const h2Ref = useRef(null);
	const pRef = useRef(null);
	const buttonsRef = useRef(null);

	useEffect(() => {
		// Create GSAP context
		const ctx = gsap.context(() => {
			// Background effects animation
			gsap.from(sectionRef.current, {
				opacity: 0,
				duration: 1.5,
				ease: "power3.inOut",
			});

			// Text animations
			const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

			tl.from(h1Ref.current, {
				y: 100,
				opacity: 0,
				duration: 1,
				delay: 0.5,
			})
				.from(
					h2Ref.current,
					{
						y: 100,
						opacity: 0,
						duration: 1,
					},
					"-=0.5",
				)
				.from(
					pRef.current,
					{
						y: 50,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.3",
				)
				.from(
					buttonsRef.current,
					{
						y: 30,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.3",
				);

			// Glow effects animation
			gsap.to(".glow-effect", {
				opacity: 0.7,
				duration: 2,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});
		}, sectionRef); // Scope animations to sectionRef

		// Cleanup
		return () => ctx.revert();
	}, []); // Remove nested useEffect

	return (
		<section
			ref={sectionRef}
			className="h-fit relative flex items-center overflow-hidden rounded-t-3xl pt-10 pb-16"
		>
			{/* Background Effects */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#1e1e2f] to-[#0d0d1a]" />

			{/* Main Glow Effects */}
			<div className="glow-effect absolute top-0 right-0 w-[60%] h-[500px] bg-[#3a3a5a] blur-[150px] transform rotate-12 opacity-70" />
			<div className="glow-effect absolute bottom-0 left-0 w-[50%] h-[400px] bg-[#2a2a4a] blur-[130px] transform -rotate-12 opacity-60" />
			<div className="glow-effect absolute left-[10%] top-1/3 w-[300px] h-[300px] rounded-full bg-[#4a4a6a] blur-[80px]" />
			<div className="glow-effect absolute right-[20%] bottom-1/4 w-[250px] h-[250px] rounded-full bg-[#3a3a5a] blur-[90px]" />

			{/* Accent Glows */}
			<div className="glow-effect absolute right-[40%] top-[15%] w-[100px] h-[100px] rounded-full bg-[#5a5a7a] blur-[40px]" />
			<div className="glow-effect absolute left-[25%] bottom-[20%] w-[150px] h-[150px] rounded-full bg-[#4a4a6a] blur-[60px]" />

			{/* Grid and Noise */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
			<div className="absolute inset-0 opacity-30 mix-blend-soft-light bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]" />

			{/* Text and Buttons */}
			<div ref={textRef} className="relative text-white ml-[100px] mr-[100px]">
				<h1 ref={h1Ref} className="font-bold text-[20vmin]">
					Energy Saving
				</h1>
				<h2
					ref={h2Ref}
					className="text-[25vmin] font-bold bg-gradient-to-r from-[#4E54C8] to-[#8F94FB] text-transparent bg-clip-text"
				>
					VESA
				</h2>
				<p ref={pRef} className="text-[3vmin]">
					Your trusted partner in providing high-quality piping supplies and solutions for modern infrastructure projects.
				</p>
				<div ref={buttonsRef} className="mt-6 flex items-center">
					<Viewmore url="/" className="mr-4" text="View more" />
					<Link
						href={"/"}
						className="flex items-center justify-center min-w-[150px] bg-[#111928] border rounded-[50px] text-white px-4 py-2 text-[3vmin] font-medium
                        hover:bg-[#637381] hover:border-[#637381]"
					>
						Contact
					</Link>
				</div>
			</div>
		</section>
	);
}
