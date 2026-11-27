import { useEffect, useRef, useState } from "react";
import { SiteType } from "../type";
import { deleteSiteImage, uploadSiteImage } from "../api";
import { CompanyType, LocationType } from "@/types";
import { SelectBox } from "@/components/ui/customs/selectBox";
import DeleteIcon from "@/components/ui/icons/delete";

const DEFAULT_SITE: SiteType = {
  id: "",
  code: "",
  name: "",
  status: true,
  in_system: false,
  status_affilate: true,
  order: 7,
  pre_price: 100000,
  en: "",
  ko: "",
  zh: "",
  company_code: "",
  location_code: "",
  link_image_site: [],
};

const MAX_IMAGE_MB = 5;

const readAsDataURL = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Không đọc được file ảnh"));
    reader.readAsDataURL(file);
  });

type FormSiteProps = {
  currentSite: SiteType;
  locations: LocationType[];
  companys: CompanyType[];
  onSave: (value: SiteType) => void;
  onClose: () => void;
};
export default function FormSite({
  currentSite = DEFAULT_SITE,
  locations,
  companys,
  onSave,
  onClose,
}: FormSiteProps) {
  const [form, setForm] = useState(currentSite);
  const [errors, setErrors] = useState<any>({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState<any>(null); // { type: 'ok' | 'error', text }
  const fileRef = useRef<any>(null);

  useEffect(() => {
    setForm(currentSite);
    setErrors({});
  }, [currentSite]);

  const set = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e: any) => ({ ...e, [key]: undefined }));
  };

  const setNumber = (key: string) => (e: any) => {
    const v = e.target.value;
    set(key, v === "" ? "" : Number(v));
  };

  const handleFile = async (file: any) => {
    if (!file) return;
    if (!form.code) {
      setErrors((e: any) => ({
        ...e,
        link_image_site: "Vui lòng nhập Site Code",
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrors((e: any) => ({
        ...e,
        link_image_site: "Chỉ chấp nhận file ảnh (JPG, PNG, WebP).",
      }));
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setErrors((e: any) => ({ ...e, link_image_site: `Ảnh tối đa ${MAX_IMAGE_MB}MB.` }));
      return;
    }
    setUploading(true);
    setErrors((e: any) => ({ ...e, link_image_site: undefined }));
    try {
      const url = uploadSiteImage
        ? await uploadSiteImage(file, form.code)
        : await readAsDataURL(file);
      if (form.link_image_site) {
        set("link_image_site", [...form.link_image_site, url]);
      }
    } catch (err: any) {
      setErrors((e: any) => ({ ...e, link_image_site: err.message || "Tải ảnh lên thất bại." }));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageURL: string, index: number) => {
    try {
      setUploading(true);
      const result = await deleteSiteImage(imageURL, form.code);
      if (result) {
        set(
          "link_image_site",
          form.link_image_site?.filter((_: any, i: number) => i !== index)
        );
      }
    } catch (err: any) {
      setErrors((e: any) => ({ ...e, link_image_site: err.message || "Lỗi xóa ảnh" }));
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: any) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const validate = () => {
    const next: any = {};
    if (!form.name?.trim()) next.name = "Nhập tên site.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setMessage(null);
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave?.(form);
      setMessage({ type: "ok", text: "Đã lưu thay đổi." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Lưu thất bại, thử lại sau." });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !saving && !uploading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose, saving, uploading]);

  return (
    <div
      className="es-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving && !uploading) {
          onClose();
        }
      }}
    >
      <div className="es-root" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <style>{css}</style>

        {/* Header */}
        <header className="es-head">
          <div>
            <h2 id="modal-title">{form.id ? "Chỉnh sửa site" : "Tạo site mới"}</h2>
          </div>
        </header>

        {/* Content scroll */}
        <main className="es-content">
          <div className="es-grid">
            <div className="es-col">
              <section className="es-card">
                <h3>Thông tin chung</h3>

                <div className="es-fields two">
                  <Field label="Site code">
                    <input
                      value={form.code ?? ""}
                      disabled={Boolean(form.id)}
                      onChange={(e) => set("code", e.target.value?.toLocaleUpperCase())}
                    />
                  </Field>

                  <Field label="Thứ tự hiển thị" error={errors.order}>
                    <input
                      type="number"
                      min="0"
                      value={form.order ?? ""}
                      onChange={setNumber("order")}
                    />
                  </Field>

                  <Field label="Tên site" error={errors.name} full>
                    <input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
                  </Field>

                  <Field label="Công ty">
                    <SelectBox
                      value={form.company_code || ""}
                      onChange={(value) => set("company_code", value)}
                    >
                      <option value="">Lựa chọn</option>
                      {companys.map((item) => (
                        <option value={item.company_code}>{item.company_name}</option>
                      ))}
                    </SelectBox>
                  </Field>

                  <Field label="Tỉnh/Thành phố">
                    <SelectBox
                      value={form.location_code || ""}
                      onChange={(value) => set("location_code", value)}
                    >
                      <option value="">Lựa chọn</option>
                      {locations.map((item) => (
                        <option value={item.code}>{item.name}</option>
                      ))}
                    </SelectBox>
                  </Field>
                </div>
              </section>

              <section className="es-card">
                <h3>Ngôn ngữ</h3>

                <div className="es-fields two">
                  <Field label="Tiếng Anh">
                    <input value={form.en ?? ""} onChange={(e) => set("en", e.target.value)} />
                  </Field>

                  <Field label="Tiếng Hàn">
                    <input value={form.ko ?? ""} onChange={(e) => set("ko", e.target.value)} />
                  </Field>

                  <Field label="Tiếng Trung" full>
                    <input value={form.zh ?? ""} onChange={(e) => set("zh", e.target.value)} />
                  </Field>
                </div>
              </section>

              <section className="es-card">
                <h3>Mô tả</h3>

                <div className="es-fields two">
                  <Field label="Tiếng Việt">
                    <input
                      value={form.description_vi ?? ""}
                      onChange={(e) => set("description_vi", e.target.value)}
                    />
                  </Field>

                  <Field label="Tiếng Anh">
                    <input
                      value={form.description_en ?? ""}
                      onChange={(e) => set("description_en", e.target.value)}
                    />
                  </Field>

                  <Field label="Tiếng Hàn">
                    <input
                      value={form.description_ko ?? ""}
                      onChange={(e) => set("description_ko", e.target.value)}
                    />
                  </Field>

                  <Field label="Tiếng Trung">
                    <input
                      value={form.description_zh ?? ""}
                      onChange={(e) => set("description_zh", e.target.value)}
                    />
                  </Field>
                </div>
              </section>

              <section className="es-card">
                <div className="es-fields three">
                  <Field label="Giá quảng cáo" error={errors.pre_price}>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={form.pre_price ?? ""}
                      onChange={setNumber("pre_price")}
                    />
                  </Field>
                </div>
                <div className="es-switches mt-3">
                  <Switch
                    label="Đang hoạt động"
                    checked={!!form.status}
                    onChange={(v: any) => set("status", v)}
                  />

                  <Switch
                    label="Trong hệ thống"
                    checked={!!form.in_system}
                    onChange={(v: any) => set("in_system", v)}
                  />

                  <Switch
                    label="Mở bán cho đại lý"
                    checked={!!form.status_affilate}
                    onChange={(v: any) => set("status_affilate", v)}
                  />
                </div>
              </section>
            </div>

            {/* Image */}
            <section className="es-card es-image">
              <h3>Ảnh site</h3>

              <div className="es-image-row">
                <div
                  className={`es-drop ${dragOver ? "is-over" : ""} ${
                    form.link_image_site?.length ? "has-image" : ""
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  role="button"
                  tabIndex={0}
                >
                  {form.link_image_site?.length ? (
                    form.link_image_site.map((item: any, index: number) => (
                      <div key={index} className="es-image-item group">
                        <img src={item} alt={form.name} />

                        <button
                          type="button"
                          className="es-image-delete"
                          title="Xóa ảnh"
                          onClick={() => handleDeleteImage(item, index)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="es-drop-empty">
                      <span>+</span>
                      <span>Kéo thả ảnh</span>
                    </div>
                  )}

                  {uploading && <div className="es-loading">Đang tải…</div>}
                </div>
                <div className="es-image-side">
                  <p className="es-hint">JPG, PNG, WebP · tối đa {MAX_IMAGE_MB}MB</p>

                  <div className="es-actions-row">
                    <button
                      type="button"
                      className="es-btn sm ghost"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                    >
                      Chọn ảnh
                    </button>
                  </div>

                  {errors.link_image_site && <p className="es-error">{errors.link_image_site}</p>}
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="es-foot">
          {message && (
            <span className={`es-msg ${message.type}`} role="status">
              {message.text}
            </span>
          )}

          <button type="button" className="es-btn ghost" onClick={onClose} disabled={saving}>
            Hủy
          </button>

          <button
            type="button"
            className="es-btn primary"
            onClick={handleSubmit}
            disabled={saving || uploading}
          >
            {saving ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, hint, error, full, children }: any) {
  return (
    <label className={`es-field ${full ? "full" : ""} ${error ? "has-error" : ""}`}>
      <span className="es-label">{label}</span>
      {children}
      {error ? (
        <span className="es-error">{error}</span>
      ) : hint ? (
        <span className="es-hint">{hint}</span>
      ) : null}
    </label>
  );
}

function Switch({ label, checked, onChange }: any) {
  return (
    <label className="es-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="es-track" aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

const css = `
.es-root{
  --ink:#1c2b2a; --muted:#66757a; --line:#dfe6e5; --bg:#f4f7f6; --card:#fff;
  --brand:#0f766e; --brand-d:#0b5953; --danger:#b42318;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  color:var(--ink); background:var(--bg); padding:24px; border-radius:12px;
  max-width:1080px; margin:0 auto;
}
.es-root *{box-sizing:border-box}
.es-head{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:flex-start;margin-bottom:20px}
.es-head h2{margin:0;font-size:22px;font-weight:650}
.es-sub{margin:4px 0 0;color:var(--muted);font-size:13px}
.es-code{font-weight:600;color:var(--brand)}
.es-switches{display:flex;flex-wrap:wrap;gap:8px 18px}
.es-switch{display:flex;align-items:center;gap:8px;font-size:14px;cursor:pointer}
.es-switch input{position:absolute;opacity:0;width:0;height:0}
.es-track{width:36px;height:20px;border-radius:20px;background:#c3cecd;position:relative;transition:background .15s}
.es-track::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .15s}
.es-switch input:checked + .es-track{background:var(--brand)}
.es-switch input:checked + .es-track::after{transform:translateX(16px)}
.es-switch input:focus-visible + .es-track{outline:2px solid var(--brand);outline-offset:2px}

.es-grid{display:grid;grid-template-columns:1fr;gap:16px;align-items:start}
.es-col{display:flex;flex-direction:column;gap:16px}
.es-card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px}
.es-card h3{margin:0 0 14px;font-size:15px;font-weight:650}

.es-drop{position:relative;height:84px;    display: flex;
    justify-content: start;
    width: 100%;
    align-items: center;
    gap: 10px;
    border: none;
    border-radius: 0;}
.es-drop:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
.es-drop img{width:100px;height:50px;object-fit:cover;display:block}
.es-drop-empty{display:flex;flex-direction:column;align-items:center;gap:2px;text-align:center;color:var(--muted);padding:6px;font-size:12px}
.es-loading{position:absolute;inset:0;display:grid;place-items:center;background:rgba(255,255,255,.8);font-size:12px;font-weight:600}
.es-image{padding:14px 18px}
.es-image h3{margin-bottom:10px}
.es-image-row{}
.es-image-side{display:flex;flex-direction:column;gap:8px;min-width:0}
.es-image-side .es-hint{margin:0}
.es-actions-row{display:flex;gap:8px}

.es-fields{display:grid;gap:14px}
.es-fields.two{grid-template-columns:1fr 1fr}
.es-fields.three{grid-template-columns:repeat(3,1fr)}
.es-field{display:flex;flex-direction:column;gap:5px;min-width:0}
.es-field.full{grid-column:1/-1}
.es-label{font-size:13px;font-weight:600}
.es-field input{height:38px;padding:0 11px;border:1px solid #c7d3d1;border-radius:7px;font:inherit;font-size:14px;background:#fff;color:var(--ink);width:100%}
.es-field input:focus{outline:2px solid var(--brand);outline-offset:-1px;border-color:var(--brand)}
.es-field input:disabled{background:#eef2f1;color:var(--muted)}
.es-field.has-error input{border-color:var(--danger)}
.es-hint{font-size:12px;color:var(--muted)}
.es-error{font-size:12px;color:var(--danger);margin:6px 0 0}
.es-field .es-error{margin:0}

.es-foot{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin-top:20px}
.es-msg{margin-right:auto;font-size:14px}
.es-msg.ok{color:var(--brand-d)} .es-msg.error{color:var(--danger)}
.es-btn{height:38px;padding:0 16px;border-radius:7px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;border:1px solid transparent;transition:background .15s}
.es-btn:disabled{opacity:.55;cursor:not-allowed}
.es-btn.sm{height:30px;padding:0 12px;font-size:13px}
.es-btn.primary{background:var(--brand);color:#fff}
.es-btn.primary:hover:not(:disabled){background:var(--brand-d)}
.es-btn.ghost{background:#fff;border-color:#c7d3d1;color:var(--ink)}
.es-btn.ghost:hover:not(:disabled){background:#f0f4f3}
.es-btn.danger-ghost{background:#fff;border-color:#e6c4c0;color:var(--danger)}
.es-btn.danger-ghost:hover:not(:disabled){background:#fdf1f0}
.es-btn:focus-visible{outline:2px solid var(--brand);outline-offset:2px}

@media (max-width:820px){
  .es-grid{grid-template-columns:1fr}
  .es-fields.three{grid-template-columns:1fr}
}
@media (max-width:520px){
  .es-root{padding:14px}
  .es-fields.two{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){
  .es-root *{transition:none!important}
}

/* Dialog overlay */
.es-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
  animation: es-fade-in 0.2s ease;
}

/* Dialog */
.es-root {
  --ink: #1c2b2a;
  --muted: #66757a;
  --line: #dfe6e5;
  --bg: #f4f7f6;
  --card: #fff;
  --brand: #0f766e;
  --brand-d: #0b5953;
  --danger: #b42318;

  font-family: system-ui, sans-serif;
  color: var(--ink);
  background: var(--bg);

  width: 100%;
  max-width: 850px;
  max-height: 85vh;

  display: flex;
  flex-direction: column;

  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);

  overflow: hidden;
  animation: es-dialog-in 0.2s ease;
}

.es-root * {
  box-sizing: border-box;
}

/* Header */
.es-head {
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

/* Scroll content */
.es-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 16px 2px;
}

/* Footer */
.es-foot {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
  background: var(--bg);
}

/* Layout */
.es-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.es-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Animation */
@keyframes es-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes es-dialog-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile */
@media (max-width: 520px) {
  .es-overlay {
    padding: 8px;
  }

  .es-root {
    max-height: 92vh;
    padding: 14px;
    border-radius: 10px;
  }

  .es-fields.two {
    grid-template-columns: 1fr;
  }

  .es-foot {
    flex-wrap: wrap;
  }

  .es-msg {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .es-root,
  .es-overlay {
    animation: none;
  }
}

.es-drop {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  min-height: 100px;
  height: auto;
  padding: 8px;
  align-content: flex-start;
}

.es-image-item {
  position: relative;
  width: 100px;
  height: 84px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #dfe6e5;
}

.es-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.es-image-delete {
  position: absolute;
  top: 5px;
  right: 5px;
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border: none;
  border-radius: 6px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.es-image-item:hover .es-image-delete {
  opacity: 1;
}

.es-image-delete:hover {
  background: #b91c1c;
}

@media (max-width: 768px) {
  .es-image-delete {
    opacity: 1;
  }
}
`;
