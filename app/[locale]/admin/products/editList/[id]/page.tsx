'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProductList } from '@/types/productList';
import axiosInstance from '@/lib/axios';
import AdminLayout from "../../../components/layouts/AdminLayout";
import Modal from "../../../components/Ui/ModalAlert";
import Button from "../../../components/Ui/Button";
import InputSm from '../../../components/Ui/InputSm';
import InputTextarea from '../../../components/Ui/InputArea';
import LanguageTabs from '../../../components/Ui/LanguageTabs';
import { useTranslations } from 'next-intl';

interface ProductListResponse {
    list: ProductList;
}

export default function EditProductList({ params }: { params: Promise<{ id: string }> }) {
    const t = useTranslations('admin');
    const router = useRouter();
    const resolvedParams = use(params);
    const [activeTab, setActiveTab] = useState<"vi" | "en">("vi");
    const [formData, setFormData] = useState<Partial<ProductList>>({
        ten_vi: '',
        ten_en: '',
        mota_vi: '',
        mota_en: '',
        noidung_vi: '',
        noidung_en: '',
        title_vi: '',
        title_en: '',
        keywords_vi: '',
        keywords_en: '',
        description_vi: '',
        description_en: '',
        hienthi: 1,
        noibat: 0
    });

    const [modal, setModal] = useState({
        isOpen: false,
        message: "",
        type: "success" as "success" | "error",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get<ProductListResponse>('/api/productListEdit', {
                    params: { id: resolvedParams.id }
                });
                setFormData(response.data.list);
            } catch (error) {
                console.error('Error fetching product list:', error);
                setModal({
                    isOpen: true,
                    message: t('messages.loadDataError'),
                    type: "error"
                });
            }
        };
        fetchData();
    }, [resolvedParams.id, t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            await axiosInstance.put('/api/productListEdit', {
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
        <AdminLayout pageName={t('editProductList')}>
            <Modal
                isOpen={modal.isOpen}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
            />
            
            <div className="w-full max-w-2xl mx-auto px-4 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} t={t} />

                    {activeTab === "vi" ? (
                        <>
                            <InputSm
                                title={t('name')}
                                language={t('vn')}
                                value={formData.ten_vi}
                                onChange={handleChange}
                                placeholder={t('name')}
                                name="ten_vi"
                            />
                            <div>
                                <InputTextarea
                                    title={t('description')}
                                    language={t('vn')}
                                    value={formData.mota_vi || ''}
                                    onChange={handleChange}
                                    placeholder={t('description')}
                                    name="mota_vi"
                                />
                            </div>
                            <InputSm
                                title={t('title')}
                                language={t('vn')}
                                value={formData.title_vi}
                                onChange={handleChange}
                                placeholder={t('title')}
                                name="title_vi"
                            />
                            <InputSm
                                title={t('keywords')}
                                language={t('vn')}
                                value={formData.keywords_vi}
                                onChange={handleChange}
                                placeholder={t('keywords')}
                                name="keywords_vi"
                            />
                        </>
                    ) : (
                        <>
                            <InputSm
                                title={t('name')}
                                language={t('en')}
                                value={formData.ten_en}
                                onChange={handleChange}
                                placeholder={t('name')}
                                name="ten_en"
                            />
                            <div>
                                <InputTextarea
                                    title={t('description')}
                                    language={t('en')}
                                    value={formData.mota_en || ''}
                                    onChange={handleChange}
                                    placeholder={t('description')}
                                    name="mota_en"
                                />
                            </div>
                            <InputSm
                                title={t('title')}
                                language={t('en')}
                                value={formData.title_en}
                                onChange={handleChange}
                                placeholder={t('title')}
                                name="title_en"
                            />
                            <InputSm
                                title={t('keywords')}
                                language={t('en')}
                                value={formData.keywords_en}
                                onChange={handleChange}
                                placeholder={t('keywords')}
                                name="keywords_en"
                            />
                        </>
                    )}

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
