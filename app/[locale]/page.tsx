"use client";

import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroBanner from "../components/common/HeroBanner";
import AboutUs from "../components/common/AboutUs";
import Marquee from "../components/Ui/Marquee";
import Featured from "../components/common/Featured";
import ContactForm from "../components/common/ContactForm";

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col">
			<Navbar />
			<HeroBanner />
			<Marquee />
			<AboutUs />
			<Featured />
			<ContactForm />
			<Footer />
		</main>
	);
}
