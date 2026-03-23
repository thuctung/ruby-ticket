"use client";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { countTicketSale, getAffHistory, getLocation } from "./api";
import {
  CountTicketSaleResponse,
  ProfileType,
  SearchTableType,
  SearchTicketSale,
  TicketSalteResponseType,
} from "@/types";
import { useProfileStore } from "@/stores/useProfileStore";
import dayjs from "dayjs";
import { BASIC_DATE_FORMAT } from "@/helpers/dateTime";
import { LocationType } from "@/types/ticket";
import { SearchTicketForm } from "./components/searchTicketForm";
import Pagination from "@/components/ui/pagination";
import { TicketSaleTable } from "./components/TicketSalteTable";
import { Revenue } from "./components/Revenue";

const df_From = dayjs(new Date()).add(-30, "day").format(BASIC_DATE_FORMAT);
const df_To = dayjs(new Date()).format(BASIC_DATE_FORMAT);

const intForm: SearchTicketSale = {
  location: "",
  from: df_From,
  to: df_To,
};

export default function AffiliateStatsControler() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const [totalPages, setTotalPage] = useState(0);
  const [locationList, setLocationList] = useState<LocationType[]>([]);

  const [ticketSale, setTicketSale] = useState<TicketSalteResponseType[]>([]);

  const [countTicket, setCountTicket] = useState({ quantity: 0, total: 0 });

  const [params, setParams] = useState<SearchTableType<SearchTicketSale>>({
    searchValue: intForm,
    currentPage: 1,
  });

  const handleChangeForm = (value: SearchTicketSale) => {
    setParams((pre) => ({
      ...pre,
      searchValue: { ...value },
    }));
  };

  const handleResetForm = () => {
    setParams((pre) => ({
      ...pre,
      searchValue: intForm,
    }));
  };

  const fetchTicketSale = async () => {
    const { data, totalPages } = await getAffHistory(params, profile.user_id);
    if (data) {
      setTicketSale(data);
    }
    setTotalPage(totalPages);
  };

  const handleGetLocation = useCallback(async () => {
    const resLocation = await getLocation();
    if (resLocation) {
      setLocationList(resLocation);
    }
  }, []);

  const handleCountTicketSale = async () => {
    const { data } = await countTicketSale(
      params.searchValue.from,
      params.searchValue.to,
      profile.user_id
    );
    if (data) {
      const result = data.reduce(
        (acc: { quantity: number; total: number }, item: CountTicketSaleResponse) => {
          return {
            quantity: acc.quantity + item.quantity,
            total: acc.total + item.total,
          };
        },
        { quantity: 0, total: 0 }
      );
      console.log(result);
      setCountTicket(result);
    }
  };

  useEffect(() => {
    handleGetLocation();
  }, []);

  useEffect(() => {
    if (profile.user_id) {
      fetchTicketSale();
    }
  }, [params, profile.user_id]);

  useEffect(() => {
    if (profile.user_id) {
      handleCountTicketSale();
    }
  }, [params.searchValue.from, params.searchValue.to, profile.user_id]);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Thống kê </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <SearchTicketForm
            locations={locationList}
            onChangeForm={handleChangeForm}
            onReset={handleResetForm}
            searchValue={params.searchValue}
          />

          <Revenue
            total={countTicket.total}
            ticket={countTicket.quantity}
            from={params.searchValue.from}
            to={params.searchValue.to}
          />
          <Separator />
          <TicketSaleTable ticketSale={ticketSale} />
        </CardContent>
      </Card>
      <Pagination
        onChange={(page) => setParams((pre) => ({ ...pre, currentPage: page }))}
        page={params.currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
