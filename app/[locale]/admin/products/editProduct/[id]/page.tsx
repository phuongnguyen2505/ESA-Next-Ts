"use client";

import AdminLayout from "@/app/[locale]/admin/components/layouts/AdminLayout";
import { useTranslations } from "next-intl";
import { useState, useEffect, use } from "react";
import axiosInstance from "@/lib/axios";
import MyUploadAdapter from "@/pages/api/myUploadAdapter";
import Modal from "../../../components/Ui/ModalAlert";
import LanguageTabs from "../../../components/Ui/LanguageTabs";
import InputSm from "../../../components/Ui/InputSm";
import InputTextarea from "../../../components/Ui/InputArea";
import InputCKeditor from "../../../components/Ui/InputCKeditor";
import InputImage from "../../../components/Ui/InputImage";
import InputCheckbox from "../../../components/Ui/InputCheckbox";
import Button from "../../../components/Ui/Button";
import Select from "../../../components/Ui/Select";
import { Product } from "@/types/Product";
import { ProductList } from "@/types/productList";
import { ProductCat } from "@/types/productCat";
import { useRouter } from "next/navigation";

type EditProductForm = Omit<Product, 'id' | 'id_item' | 'list_ten_vi' | 'list_ten_en' | 'cat_ten_vi' | 'cat_ten_en' | 'thumb' | 'file' | 'ngaytao' | 'ngaysua' | 'luotxem'>;

interface ProductResponse {
    product: Product;
}

function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
        return new MyUploadAdapter(loader);
    };
}

const editorConfig = {
    toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
    ],
    extraPlugins: [uploadPlugin],
};

export default function EditProduct({ params }: { params: { id: string } }) {
    const id = use(params as unknown as Promise<{ id: string }>).id;
    const t = useTranslations("admin");
    const router = useRouter();
    const [formData, setFormData] = useState<EditProductForm>({
        id_list: 0,
        id_cat: 0,
        ten_vi: "",
        ten_en: "",
        masp: "",
        mota_vi: "",
        mota_en: "",
        noidung_vi: "",
        noidung_en: "",
        title_vi: "",
        title_en: "",
        keywords_vi: "",
        keywords_en: "",
        description_vi: "",
        description_en: "",
        photo: "",
        stt: 1,
        hienthi: 1,
        noibat: 0,
        tags_vi: "",
        tags_en: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [modal, setModal] = useState<{
        isOpen: boolean;
        message: string;
        type: "success" | "error";
    }>({
        isOpen: false,
        message: "",
        type: "success"
    });

    const [activeTab, setActiveTab] = useState<"vi" | "en">("vi");
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [productLists, setProductLists] = useState<ProductList[]>([]);
    const [productCats, setProductCats] = useState<ProductCat[]>([]);
    const [filteredCats, setFilteredCats] = useState<ProductCat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listsRes, catsRes] = await Promise.all([
                    axiosInstance.get<{ lists: Array<ProductList> }>('/api/productList'),
                    axiosInstance.get<{ categories: Array<ProductCat> }>('/api/productCat')
                ]);
                
                setProductLists(listsRes.data.lists || []);
                setProductCats(catsRes.data.categories || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                setProductLists([]);
                setProductCats([]);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosInstance.get<ProductResponse>(`/api/products/${id}`);
                const product = response.data.product;
                
                setFormData({
                    id_list: product.id_list,
                    id_cat: product.id_cat,
                    ten_vi: product.ten_vi,
                    ten_en: product.ten_en,
                    masp: product.masp,
                    mota_vi: product.mota_vi,
                    mota_en: product.mota_en,
                    noidung_vi: product.noidung_vi,
                    noidung_en: product.noidung_en,
                    title_vi: product.title_vi,
                    title_en: product.title_en,
                    keywords_vi: product.keywords_vi,
                    keywords_en: product.keywords_en,
                    description_vi: product.description_vi,
                    description_en: product.description_en,
                    photo: product.photo,
                    stt: product.stt,
                    hienthi: product.hienthi,
                    noibat: product.noibat,
                    tags_vi: product.tags_vi,
                    tags_en: product.tags_en,
                });

                if (product.photo) {
                    setImagePreview(product.photo);
                }

                const filtered = productCats.filter(cat => Number(cat.id_list) === product.id_list);
                setFilteredCats(filtered);
                
            } catch (error) {
                console.error('Error fetching product:', error);
                setModal({
                    isOpen: true,
                    message: t("messages.fetchError"),
                    type: "error"
                });
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id, productCats, t]);

    const handleProductListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const listId = parseInt(e.target.value);
        setFormData((prev) => ({
            ...prev,
            id_list: listId,
            id_cat: 0
        }));
        
        const filtered = productCats.filter(cat => Number(cat.id_list) === listId);
        setFilteredCats(filtered);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            if (typeof window !== 'undefined') {
                const previewUrl = URL.createObjectURL(file);
                setImagePreview(previewUrl);
                
                return () => {
                    URL.revokeObjectURL(previewUrl);
                };
            }
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview && typeof window !== 'undefined') {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value as string);
        });
        if (imageFile) {
            formDataToSend.append("photo", imageFile);
        }

        try {
            await axiosInstance.put(`/api/editProduct`, formDataToSend, {
                params: { id },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setModal({
                isOpen: true,
                message: t("messages.updateSuccess"),
                type: "success"
            });

            router.push('/admin/products');
            
        } catch (error) {
            console.error('Error updating product:', error);
            setModal({
                isOpen: true,
                message: t("messages.updateFailed"),
                type: "error"
            });
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev: typeof formData) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditorChange = (data: string, name: string) => {
        setFormData((prev: typeof formData) => ({
            ...prev,
            [name]: data
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setFormData((prev: typeof formData) => ({
            ...prev,
            hienthi: checked ? 1 : 0,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: typeof formData) => ({
            ...prev,
            [name]: parseInt(value),
        }));
    };

    const handleBack = () => {
        router.push('/admin/products');
    };

    return (
        <AdminLayout pageName={t("editProduct")}>
            <Modal
                isOpen={modal.isOpen}
                message={modal.message}
                type={modal.type}
                onClose={() => setModal((prev: typeof modal) => ({ ...prev, isOpen: false }))}
            />
            <form
                onSubmit={handleSubmit}
                className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6 dark:bg-gray-800"
            >
                <div className="space-y-6 mb-6">
                    <Select
                        title={t("productList")}
                        name="id_list"
                        value={formData.id_list}
                        onChange={handleProductListChange}
                        required
                    >
                        <option value="">{t("selectProductList")}</option>
                        {productLists.map(list => (
                            <option key={list.id} value={list.id.toString()}>
                                {activeTab === "vi" ? list.ten_vi : list.ten_en}
                            </option>
                        ))}
                    </Select>

                    <Select
                        title={t("productCat")}
                        name="id_cat"
                        value={formData.id_cat}
                        onChange={handleSelectChange}
                        required
                        disabled={!formData.id_list}
                    >
                        <option value="">{t("selectCategory")}</option>
                        {filteredCats.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {activeTab === "vi" ? cat.ten_vi : cat.ten_en}
                            </option>
                        ))}
                    </Select>

                    <InputSm
                        title={t("productCode")}
                        value={formData.masp}
                        onChange={handleChange}
                        name="masp"
                        required
                        placeholder={t("productCode")}
                    />
                </div>

                <LanguageTabs activeTab={activeTab} onTabChange={setActiveTab} t={t} />
                <div className={activeTab === "vi" ? "block" : "hidden"}>
                    <div className="space-y-6">
                        <InputSm
                            title={t("name")}
                            value={formData.ten_vi}
                            onChange={handleChange}
                            language={t("vn")}
                            placeholder={t("name")}
                            name="ten_vi"
                            required
                        />
                        <InputTextarea
                            title={t("description")}
                            name="mota_vi"
                            value={formData.mota_vi}
                            onChange={handleChange}
                            language={t("vn")}
                            placeholder={t("description")}
                        />
                        <InputCKeditor
                            title={t("content")}
                            value={formData.noidung_vi}
                            onChange={(data) => handleEditorChange(data, "noidung_vi")}
                            language={t("vn")}
                            editorConfig={editorConfig}
                        />
                        <InputSm
                            title={t("title") + " SEO"}
                            value={formData.title_vi}
                            onChange={handleChange}
                            placeholder={t("title") + " SEO"}
                            name="title_vi"
                        />
                        <InputSm
                            title={t("keywords") + " SEO"}
                            value={formData.keywords_vi}
                            onChange={handleChange}
                            placeholder={t("keywords") + " SEO"}
                            name="keywords_vi"
                        />
                        <InputTextarea
                            title={t("description") + " SEO"}
                            name="description_vi"
                            value={formData.description_vi}
                            onChange={handleChange}
                            language={t("vn")}
                            placeholder={t("description") + " SEO"}
                        />
                        <InputSm
                            title={t("tags")}
                            value={formData.tags_vi}
                            onChange={handleChange}
                            language={t("vn")}
                            placeholder={t("tags")}
                            name="tags_vi"
                        />
                    </div>
                </div>

                <div className={activeTab === "en" ? "block" : "hidden"}>
                    <div className="space-y-6">
                        <InputSm
                            title={t("name")}
                            language={t("en")}
                            value={formData.ten_en}
                            onChange={handleChange}
                            placeholder={t("name")}
                            name="ten_en"
                            required
                        />
                        <InputTextarea
                            title={t("description")}
                            name="mota_en"
                            placeholder={t("description")}
                            value={formData.mota_en}
                            onChange={handleChange}
                            language={t("en")}
                        />
                        <InputCKeditor
                            title={t("content")}
                            value={formData.noidung_en}
                            onChange={(data) => handleEditorChange(data, "noidung_en")}
                            language={t("en")}
                            editorConfig={editorConfig}
                        />
                        <InputSm
                            title={t("title") + " SEO"}
                            language={t("en")}
                            value={formData.title_en}
                            onChange={handleChange}
                            placeholder={t("title") + " SEO"}
                            name="title_en"
                        />
                        <InputSm
                            title={t("keywords") + " SEO"}
                            language={t("en")}
                            value={formData.keywords_en}
                            onChange={handleChange}
                            placeholder={t("keywords") + " SEO"}
                            name="keywords_en"
                        />
                        <InputTextarea
                            title={t("description") + " SEO"}
                            name="description_en"
                            value={formData.description_en}
                            onChange={handleChange}
                            language={t("en")}
                            placeholder={t("description") + " SEO"}
                        />
                        <InputSm
                            title={t("tags")}
                            value={formData.tags_en}
                            onChange={handleChange}
                            language={t("en")}
                            placeholder={t("tags")}
                            name="tags_en"
                        />
                    </div>
                </div>

                <InputImage
                    title={t("picture")}
                    name="photo"
                    onChange={handleImageUpload}
                    imagePreview={imagePreview}
                    currentImage={formData.photo}
                    t={t}
                />

                <InputCheckbox
                    name="hienthi"
                    checked={formData.hienthi === 1}
                    onChange={handleCheckboxChange}
                    label={t("show")}
                    placeholder={t("show")}
                />

                <div className="flex justify-end space-x-4">
                    <Button 
                        type="button" 
                        onClick={handleBack}
                        className="bg-gray-500 hover:bg-gray-600"
                    >
                        {t("back")}
                    </Button>
                    <Button type="submit">{t("save")}</Button>
                </div>
                
            </form>
        </AdminLayout>
    );
}
