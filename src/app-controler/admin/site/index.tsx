"use client";

import { useEffect, useState } from "react";
import { SearchSite } from "./components/search-site";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { SearchSiteType, SiteType } from "./type";
import { getAllSiteMgt, getCompanyAndLoaction, rebuildSerVer, updateSite } from "./api";
import FormSite from "./components/form-site";
import { ButtonCommon } from "@/components/ui/customs/buttonCommon";
import { toast } from "react-toastify";
import { useCommonStore } from "@/stores/useCommonStore";
import { CommonType, CompanyType, LocationType } from "@/types";

const EMPTY_FORM: SiteType = {
  id: "",
  code: "",
  name: "",
  status: true,
  in_system: false,
  status_affilate: true,
  order: 1,
  pre_price: 100000,
  en: "",
  ko: "",
  zh: "",
  company_code: "",
  location_code: "",
  link_image_site: [],
};

const initValue = {
  status: undefined,
  name: "",
  in_system: undefined,
};

export default function SitesPageController() {
  const { showConfirm }: CommonType | any = useCommonStore.getState();
  const [openForm, setOpenForm] = useState(false);

  const [listSite, setListSite] = useState<SiteType[]>([]);
  const [form, setForm] = useState<SiteType>(EMPTY_FORM);

  const [companys, setCompany] = useState<CompanyType[]>([]);
  const [locations, setLoaction] = useState<LocationType[]>([]);

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
      align: "center",
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
      align: "center",
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
      align: "center",
      title: "Khu vực",
      render: (row) =>
        row.in_system ? (
          <span className="text-[green]">Trong hệ thống</span>
        ) : (
          <span className="text-[blue]">Ngoài hệ thống</span>
        ),
    },
    {
      key: "order",
      align: "center",
      title: "Thứ tự hiển thị",
    },
    {
      key: "",
      title: "Thao tác",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenForm(row)}
            className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-blue-500 transition hover:border-emerald-500 hover:text-emerald-400"
          >
            Sửa
          </button>
          {/* <button
              onClick={() => setDeleteTarget(row)}
              className="rounded-md border border-slate-700 px-2.5 py-1.5 text-xs font-medium text-red-500 transition hover:border-rose-500 hover:text-amber-400"
            >
              Xóa
            </button> */}
        </div>
      ),
    },
  ];

  const handleOpenForm = async (site: SiteType) => {
    await fetchCompanyLocation();
    if (site) {
      setForm(site);
    }
    setOpenForm(true);
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
    const { link_image_site, ...payload } = value;
    const data = await updateSite(payload);
    if (data) {
      handleCloseModal();
      onReset();
    }
  };

  const handleCloseModal = () => {
    setOpenForm(false);
  };

  const handleBuilServer = () => {
    showConfirm({
      message: `Quá trình ước tính tầm 5 phút. Xác nhận build`,
      okFunc: rebuildServer,
    });
  };

  const fetchCompanyLocation = async () => {
    if (!locations.length || !companys.length) {
      const { companysData, loactionsData }: any = await getCompanyAndLoaction();
      setLoaction(loactionsData);
      setCompany(companysData);
    }
  };

  const rebuildServer = async () => {
    const data = await rebuildSerVer();
    if (data) {
      toast.success("Server đang build lại!");
    }
  };

  useEffect(() => {
    getListSite();
  }, [params]);

  return (
    <div className="min-h-screen ">
      <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => handleOpenForm(EMPTY_FORM)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            <PlusIcon />
            Tạo site mới
          </button>
          <ButtonCommon title="Build lại server" onClick={handleBuilServer} />
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

      {openForm ? (
        <FormSite
          currentSite={form}
          onClose={handleCloseModal}
          onSave={handleSubmitForm}
          locations={locations}
          companys={companys}
        />
      ) : null}
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
