export interface ProductList {
	id: number;
	ten_en: string;
	mota_en: string;
	noidung_en: string;
	tenkhongdau: string;
	title_en: string;
	keywords_en: string;
	description_en: string;
	stt: number;
	hienthi: number;
	ngaytao: Date;
	ngaysua: Date;
	noibat: number;
}

export type ProductListFormData = Omit<ProductList, 'id' | 'stt'>;