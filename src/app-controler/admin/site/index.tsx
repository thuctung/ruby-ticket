"use client";

import { useEffect, useState } from "react";
import { SearchSite } from "./components/search-site";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { SearchSiteType, SiteType } from "./type";
import { getAllSiteMgt, updateSite } from "./api";
import FormSite from "./components/form-site";
import { isEmpty } from "lodash";

const EMPTY_FORM: SiteType = {
  id: "",
  code: "",
  name: "",
  status: false,
  in_system: false,
  status_affilate: false,
};

const initValue = {
  status: undefined,
  name: "",
  in_system: undefined,
};

export default function SitesPageController() {
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [listSite, setListSite] = useState<SiteType[]>([]);
  const [form, setForm] = useState<SiteType | null>(null);

  const [params, setParams] = useState<SearchSiteType>(initValue);

  const columnAdminReport: TableColumn<SiteType>[] = [
    {
      key: "code",
      title: "Mã",
    },
    {
      key: "name",
      title: "Tên site",
    },
    {
      key: "status",
      title: "Mở cho khách lẻ",
      render: (row) =>
        row.status ? (
          <span className="text-[green]">Mở</span>
        ) : (
          <span className="text-[red]">Đóng</span>
        ),
    },
    {
      key: "status",
      title: "Mở cho đại lý",
      render: (row) =>
        row.status_affilate ? (
          <span className="text-[green]">Mở</span>
        ) : (
          <span className="text-[red]">Đóng</span>
        ),
    },
    {
      key: "in_system",
      title: "Khu vực",
      render: (row) =>
        row.in_system ? (
          <span className="text-[green]">Trong hệ thống</span>
        ) : (
          <span className="text-[blue]">Ngoài hệ thống</span>
        ),
    },
    {
      key: "",
      title: "Thao tác",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openEditModal(row)}
            className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-blue-500 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            Sửa
          </button>
          {/* <button
              onClick={() => setDeleteTarget(row)}
              className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:border-rose-500 hover:text-rose-400"
            >
              Xóa
            </button> */}
        </div>
      ),
    },
  ];

  const openCreateModal = () => {
    setModalMode("create");
    setForm(EMPTY_FORM);
  };

  const openEditModal = (site: SiteType) => {
    if (site && site.id) {
      setModalMode("edit");
      setForm(site);
    }
  };

  const getListSite = async () => {
    const data = await getAllSiteMgt({
      currentPage: 1,
      searchValue: params,
    });
    setListSite(data);
  };

  const onReset = () => {
    setParams({ ...initValue });
  };

  const handleChangeForm = (value: SearchSiteType) => {
    setParams(value);
  };

  const handleSubmitForm = async (value: SiteType) => {
    const data = await updateSite(value);
    if (data) {
      handleCloseModal();
      onReset();
    }
  };

  const handleCloseModal = () => {
    setForm(null);
  };

  useEffect(() => {
    getListSite();
  }, [params]);

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <PlusIcon />
            Tạo site mới
          </button>
        </div>

        <SearchSite searchValue={params} onReset={onReset} onChangeForm={handleChangeForm} />

        <CustomTable
          currentPage={1}
          columns={columnAdminReport}
          data={listSite}
          totalPages={1}
          onChangePage={(value) => setParams((pre) => ({ ...pre, currentPage: value }))}
        />
      </div>

      {!isEmpty(form) && (
        <FormSite
          currentSite={form}
          onClose={handleCloseModal}
          onSubmit={handleSubmitForm}
          mode={modalMode}
        />
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
