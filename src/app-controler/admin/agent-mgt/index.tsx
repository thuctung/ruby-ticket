"use client";
import { useEffect, useState } from "react";
import { initAgent } from "./constant";
import { createEditAgent, deleteAgent, getListAgent } from "./api";
import { AgentType, CommonType, SearchTableType } from "@/types";

import { Input } from "@/components/ui/customs/input";
import { ButtonCommon } from "@/components/ui/customs/buttonCommon";
import { CustomTable, TableColumn } from "@/components/ui/customs/table";
import { Button } from "@/components/ui/button";
import { useCommonStore } from "@/stores/useCommonStore";

export default function AgentMamagement() {
  const { setToastMessage, showConfirm }: CommonType | any = useCommonStore.getState();

  const [totalPages, setTotalPage] = useState(0);

  const [params, setParams] = useState<SearchTableType<any>>({
    searchValue: {},
    currentPage: 1,
  });

  const [agentList, setAgentList] = useState<AgentType[]>([]);
  const [agentItem, setAgentItem] = useState<AgentType>(initAgent);

  const onSelectAgentEdit = (item: AgentType) => {
    setAgentItem({ ...item });
  };

  const onDeleteAgent = (item: AgentType) => {
    showConfirm({
      message: `Xác nhận xóa`,
      okFunc: async () => {
        const data = await deleteAgent(item.id);
        if (data) {
          fetchListAgent();
        }
      },
    });
  };

  const colAgent: TableColumn<any>[] = [
    {
      key: "name",
      title: "Tên đại lí",
    },
    {
      key: "code",
      title: "Mã đại lí",
    },
    {
      key: "action",
      title: "Action",
      render: (row, index) => (
        <div>
          <Button className="p-4" onClick={() => onSelectAgentEdit(row)}>
            Sửa
          </Button>
          <Button className="ml-5 p-4 bg-[red]" onClick={() => onDeleteAgent(row)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const onChangeAgent = (key: string, value: string) => {
    setAgentItem((pre) => ({ ...pre, [key]: value }));
  };

  const onSubmitAgent = async () => {
    if (!agentItem.code || !agentItem.name) {
      setToastMessage("Vui lòng nhập đủ thông tin");
      return;
    }
    const data = await createEditAgent(agentItem);
    if (data) {
      fetchListAgent();
      onResetForm();
    }
  };

  const onResetForm = () => {
    setAgentItem(initAgent);
  };

  const fetchListAgent = async () => {
    const { data, totalPages } = await getListAgent(params);
    if (data?.length) {
      setAgentList(data);
    }
    setTotalPage(totalPages);
  };

  useEffect(() => {
    fetchListAgent();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 text-slate-800">
          <h2 className="font-bold text-xl">Agents</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Chọn Location */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Tên đại lí</label>
            <div className="relative">
              <Input
                type="text"
                className=""
                placeholder=""
                value={agentItem.name}
                onChange={(value: string) => onChangeAgent("name", value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-600">Mã đại lí</label>
            <div className="relative">
              <Input
                type="text"
                className=""
                placeholder=""
                value={agentItem.code}
                onChange={(value: string) => onChangeAgent("code", value)}
              />
            </div>
          </div>
        </div>
        <div className=" flex flex-wrap justify-end  pr-3">
          <div className="flex justify-end gap-3 mt-6">
            <ButtonCommon title={agentItem.id ? "Sửa" : "Thêm"} onClick={onSubmitAgent} />
            <ButtonCommon title="Reset" onClick={onResetForm} />
          </div>
        </div>
      </div>

      <CustomTable
        columns={colAgent}
        data={agentList}
        onChangePage={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
        currentPage={params.currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
