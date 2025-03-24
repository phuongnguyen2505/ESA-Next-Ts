import ContactForm from "@/app/components/common/ContactForm";
import ClientLayout from "@/app/components/layouts/ClientLayout";
import React from "react";

export default function page() {
	return (
		<>
			<ClientLayout>
				<ContactForm />
			</ClientLayout>
		</>
	);
}
