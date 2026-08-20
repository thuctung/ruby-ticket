import Modal from "@/components/site/Modal";
import { SiteType } from "../type";
import { useState } from "react";
import ToggleCustom from "@/components/site/Toggle";

type FormSiteProps = {
  onClose: () => void;
  mode: string;
  onSubmit: (value: any) => void;
  currentSite: SiteType;
};
const FormSite = ({ mode, currentSite, onClose, onSubmit }: FormSiteProps) => {
  const [site, setSite] = useState({ ...currentSite });

  const handleSubmit = () => {
    onSubmit(site);
  };

  return (
    <Modal onClose={onClose} title={mode === "create" ? "Tạo site mới" : "Chỉnh sửa site"}>
      <Field label="Mã site">
        <input
          value={site.code}
          onChange={(e) => setSite((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
          placeholder="VD: SWV"
          className={inputClass(false)}
          maxLength={10}
          disabled={mode === "edit"}
        />
      </Field>

      <Field label="Tên site">
        <input
          value={site.name}
          onChange={(e) => setSite((f) => ({ ...f, name: e.target.value }))}
          placeholder="VD: Sun World Vũng Tàu"
          className={inputClass(false)}
        />
      </Field>
      <Field label="Thứ tự hiển thị">
        <input
          value={site.order}
          type="number"
          min={0}
          onChange={(e) => setSite((f) => ({ ...f, order: Number(e.target.value) }))}
          placeholder="VD: Sun World Vũng Tàu"
          className={inputClass(false)}
        />
      </Field>

      <div className="flex gap-6 pt-1 flex-wrap mt-4">
        <ToggleCustom
          label="Khách lẻ"
          checked={site.status}
          onChange={(v) => setSite((f) => ({ ...f, status: v }))}
        />
        <ToggleCustom
          label="Đại lý"
          checked={site.status_affilate}
          onChange={(v) => setSite((f) => ({ ...f, status_affilate: v }))}
        />
        <ToggleCustom
          label="Trong hệ thống"
          checked={site.in_system}
          onChange={(v) => setSite((f) => ({ ...f, in_system: v }))}
        />
      </div>

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
export default FormSite;

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
    <div>
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
