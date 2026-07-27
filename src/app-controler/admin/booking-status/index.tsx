"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { BASIC_DATE_FORMAT, dayjsEx } from "@/helpers/dateTime";

import { CustomTable, TableColumn } from "@/components/ui/customs/table";

import { get } from "lodash";
import { getStatusBooking } from "./api";
import { toast } from "react-toastify";
import { TicketStatusType } from "@/app-controler/affi/ticket-statatus/type";
import { statusClass } from "../affiliate-mgt/constants";
import { StatusData } from "@/app-controler/affi/stats/contants";
import { SearchBookingStatus } from "./components/searchTicketForm";
import { AdminBookingStatusResponseType } from "./type";
import BookingDetailCard from "./components/bookingDetail";

export default function AdminBookingStatusPageControler() {
  const [bookingDetail, setBookingDetail] = useState<AdminBookingStatusResponseType>();

  const handleSearch = async (value: string) => {
    if (!value) {
      toast.error("Chưa nhập thông tin");
      return;
    }
    const data = await getStatusBooking(value);
    setBookingDetail(data);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Tra cứu thông order </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <SearchBookingStatus onSearch={handleSearch} />

          <Separator />
          {bookingDetail && <BookingDetailCard booking={bookingDetail} />}
        </CardContent>
      </Card>
    </div>
  );
}
