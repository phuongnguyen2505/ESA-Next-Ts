'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCat } from '@/types/productCat';
import { ProductList } from '@/types/productList';
import axiosInstance from '@/lib/axios';
import AdminLayout from "../../../components/layouts/AdminLayout";
import Modal from "../../../components/Ui/ModalAlert";
import Button from "../../../components/Ui/Button";
import InputSm from '../../../components/Ui/InputSm';
import LanguageTabs from '../../../components/Ui/LanguageTabs';
import { useTranslations } from 'next-intl';

interface ProductCatResponse {
    list: ProductCat;
}

interface ProductListResponse {
    lists: ProductList[];
}

export default function EditProductCat({ params }: { params: Promise<{ id: string }> }) {
    const t = useTranslations('admin');
    const router = useRouter();
    const resolvedParams = use(params);
    const [activeTab, setActiveTab] = useState<"en">("en");
    const [lists, setLists] = useState<ProductList[]>([]);
    const [formData, setFormData] = useState<Partial<ProductCat>>({
        id_list: 0,
        ten_en: '',
        tenkhongdau: '',
        title_en: '',
        keywords_en: '',
        description_en: '',
        hienthi: 1,
        noibat: 0
    });

    const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        type: "success" as "success" | "error",
    });

    const fetchLists = async () => {
        try {
            const response = await axiosInstance.get<ProductListResponse>('/api/productList');
            setLists(response.data.lists);
        } catch (error) {
            console.error('Error fetching lists:', error);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get<ProductCatResponse>('/api/productCatEdit', {
                    params: { id: resolvedParams.id }
                });
                setFormData(response.data.list);
            } catch (error) {
                console.error('Error fetching product category:', error);
                setModal({
                    isOpen: true,
                    message: t('messages.loadDataError'),
                    type: "error"
                });
            }
        };
        fetchData();
    }, [resolvedParams.id, t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleToggle = (field: 'hienthi' | 'noibat') => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field] === 1 ? 0 : 1
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.put('/api/productCatEdit', {
                ...formData,
                id: resolvedParams.id,
                ngaysua: new Date().toISOString(),
                hienthi: formData.hienthi ? 1 : 0,
                noibat: formData.noibat ? 1 : 0
            });

            setModal({
                isOpen: true,
                message: t('messages.updateSuccess'),
                type: "success"
            });
            
            setTimeout(() => {
                router.push('/admin/products');
            }, 1500);

        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            setModal({
                isOpen: true,
                message: t('messages.updateFailed'),
                type: "error"
            });
        }
    };

    return (
        <AdminLayout pageName={t('editProductCat')}>
            <Modal
                isOpen={modal.isOpen}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
            />
            
            <div className="w-full max-w-2xl mx-auto px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="id_list"
                            className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                        >
                            {t("productList")}
                        </label>
                        <select
                            id="id_list"
                            value={formData.id_list}
                            onChange={handleChange}
                            name="id_list"
                            className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:text-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">{t("selectProductList")}</option>
                            {lists.map(list => (
                                <option key={list.id} value={list.id.toString()}>
                                    {list.ten_en}
                                </option>
                            ))}
                        </select>
                    </div>

                    <>
                        <InputSm
                            title={t('name')}
                            value={formData.ten_en}
                            onChange={handleChange}
                            placeholder={t('name')}
                            name="ten_en"
                        />
                        <InputSm
                            title={t('title')}
                            value={formData.title_en}
                            onChange={handleChange}
                            placeholder={t('title')}
                            name="title_en"
                        />
                        <InputSm
                            title={t('keywords')}
                            value={formData.keywords_en}
                            onChange={handleChange}
                            placeholder={t('keywords')}
                            name="keywords_en"
                        />
                        <InputSm
                            title={t('description')}
                            value={formData.description_en}
                            onChange={handleChange}
                            placeholder={t('description')}
                            name="description_en"
                        />
                    </>

                    <InputSm
                        title={t("url")}
                        value={formData.tenkhongdau}
                        onChange={handleChange}
                        name="tenkhongdau"
                        placeholder={t("url")}
                        readOnly
                        disabled
                    />

                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.hienthi === 1}
                                onChange={() => handleToggle('hienthi')}
                                className="form-checkbox"
                            />
                            <span>{t('show')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.noibat === 1}
                                onChange={() => handleToggle('noibat')}
                                className="form-checkbox"
                            />
                            <span>{t('featured')}</span>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="bg-gray-600 hover:bg-gray-700"
                        >
                            {t("cancel")}
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {t("save")}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
