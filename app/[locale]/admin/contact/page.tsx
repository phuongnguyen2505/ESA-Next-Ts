"use client";

import { useEffect, useState } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import { Contact } from "@/types/contact";
import axiosInstance from "@/lib/axios";

interface ContactsResponse {
	contacts: Contact[];
}

export default function ContactList() {
	const [contacts, setContacts] = useState<Contact[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

	useEffect(() => {
		const fetchContacts = async () => {
			try {
				const response = await axiosInstance.get<ContactsResponse>("/api/contacts");
				setContacts(response.data.contacts);
			} catch (error) {
				console.error("Error fetching contacts:", error);
			}
		};

		fetchContacts();
	}, []);

	const handleRowClick = (contact: Contact) => {
		setSelectedContact(contact);
		setIsModalOpen(true);
	};

	return (
		<AdminLayout pageName="Contact">
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white rounded-lg overflow-hidden">
					<thead className="bg-gray-100 dark:text-black">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
								name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
								email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
								subject
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
								message
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
								date
							</th>
						</tr>
					</thead>
                    <tbody className="divide-y divide-gray-200 dark:text-black">
                        {contacts.map((contact) => (
                            <tr 
                                key={contact.id}
                                onClick={() => handleRowClick(contact)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap truncate max-w-[200px]">{contact.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap truncate max-w-[200px]">{contact.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap truncate max-w-[200px]">{contact.subject}</td>
                                <td className="px-6 py-4 truncate max-w-[300px]">{contact.message}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {contact.ngaytao ? new Date(contact.ngaytao).toLocaleString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }) : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
				</table>
			</div>
            {/* Detail Modal */}
            {isModalOpen && selectedContact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Contact Details</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                <p className="mt-1 text-gray-900">{selectedContact.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                <p className="mt-1 text-gray-900">{selectedContact.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Subject</h3>
                                <p className="mt-1 text-gray-900">{selectedContact.subject}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Message</h3>
                                <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date Submitted</h3>
                                <p className="mt-1 text-gray-900">
                                    {selectedContact.ngaytao ? new Date(selectedContact.ngaytao).toLocaleString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }) : ''}
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
		</AdminLayout>
	);
}
