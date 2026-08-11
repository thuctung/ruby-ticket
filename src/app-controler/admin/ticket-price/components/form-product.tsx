import Modal from "@/components/site/Modal";
import { useState } from "react";
import { CategoryType, ProductType, SiteType } from "../type";
import { SelectBox } from "@/components/ui/customs/selectBox";
import { formatVND } from "@/lib/money";

type FormSiteProps = {
  onClose: () => void;
  mode: string;
  onSubmit: (value: any) => void;
  currentProduct: ProductType;
  listCategory: CategoryType[];
  listSite: SiteType[];
};
const FormProduct = ({
  mode,
  currentProduct,
  listSite,
  listCategory,
  onClose,
  onSubmit,
}: FormSiteProps) => {
  const [product, setProduct] = useState({ ...currentProduct });

  const handleSubmit = () => {
    onSubmit(product);
  };

  const handleChangeProduct = (key: string, value: string | number) => {
    setProduct((pre) => ({ ...pre, [key]: value }));
  };

  return (
    <Modal onClose={onClose} title={mode === "create" ? "Tạo vé mới" : "Chỉnh sửa vé"}>
      <Field label="Công viên">
        <SelectBox
          value={product.site_code}
          onChange={(value) => handleChangeProduct("site_code", value)}
          className=" h-12"
          style={{ border: "1px solid" }}
        >
          <option value="">Chọn</option>
          {listSite.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </SelectBox>
      </Field>
      <Field label="Mã vé">
        <input
          value={product.code}
          onChange={(e) => handleChangeProduct("code", e.target.value.toUpperCase())}
          placeholder="VD: SWV"
          className={inputClass(false)}
          maxLength={10}
          disabled={mode === "edit"}
        />
      </Field>

      <Field label="Tên vé">
        <input
          value={product.name}
          onChange={(e) => handleChangeProduct("name", e.target.value)}
          placeholder="VD: Sun World Vũng Tàu"
          className={inputClass(false)}
        />
      </Field>

      <Field label="Giá công bố" hint={formatVND(product.publicPrice)}>
        <input
          type="number"
          min={0}
          value={product.publicPrice}
          onChange={(e) => handleChangeProduct("publicPrice", Number(e.target.value))}
          placeholder="VD: Sun World Vũng Tàu"
          className={inputClass(false)}
        />
      </Field>

      <Field label="Giá đại lý" hint={formatVND(product.unitPrice)}>
        <input
          min={0}
          value={product.unitPrice}
          onChange={(e) => handleChangeProduct("unitPrice", Number(e.target.value))}
          placeholder="VD: Sun World Vũng Tàu"
          className={inputClass(false)}
        />
      </Field>

      <Field label="Loại vé">
        <SelectBox
          value={product.personType}
          onChange={(value) => handleChangeProduct("personType", value)}
          className=" h-12"
          style={{ border: "1px solid" }}
        >
          {listCategory.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </SelectBox>
      </Field>

      <Field label="Thông tin">
        <textarea
          value={product.description}
          onChange={(e) => handleChangeProduct("description", e.target.value)}
          placeholder="VD: Sun World Vũng Tàu"
          className={inputClass(false)}
        />
      </Field>

      <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium  transition "
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium  transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Lưu
        </button>
      </div>
    </Modal>
  );
};
export default FormProduct;

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium ">{label}</label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border  px-3 py-2 text-sm  focus:outline-none focus:ring-1 ${
    hasError
      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
      : "border-slate-700 focus:border-emerald-500 focus:ring-emerald-500"
  }`;
}
