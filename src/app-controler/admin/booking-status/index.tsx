"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getStatusBooking } from "./api";
import { toast } from "react-toastify";
import { SearchBookingStatus } from "./components/searchTicketForm";
import BookingDetailCard from "./components/bookingDetail";
import { TicketReponseType } from "@/types/ticket";

export default function AdminBookingStatusPageControler() {
  const [bookingDetail, setBookingDetail] = useState<TicketReponseType>();

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
