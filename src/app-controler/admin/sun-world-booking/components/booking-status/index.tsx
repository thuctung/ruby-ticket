"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { getProfileOrder, getStatusBooking } from "../../api";
import { toast } from "react-toastify";
import { SearchBookingStatus } from "./components/searchTicketForm";
import BookingDetailCard from "./components/bookingDetail";
import { TicketReponseType } from "@/types/ticket";

export default function AdminBookingStatus({ onFetchMoney }: { onFetchMoney: Function }) {
  const [bookingDetail, setBookingDetail] = useState<TicketReponseType>();

  const [orderCode, setOrderCode] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleSearch = async () => {
    if (!orderCode) {
      toast.error("Chưa nhập thông tin");
      return;
    }
    const [resBooking, resProfile] = await Promise.all([
      getStatusBooking(orderCode),
      getProfileOrder(orderCode),
    ]);
    setBookingDetail(resBooking);
    setUserEmail(resProfile?.user_email);
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Tra cứu thông tin order </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <SearchBookingStatus
            onSearch={handleSearch}
            setOrderCode={setOrderCode}
            orderCode={orderCode}
          />
          <Separator />
          {bookingDetail && (
            <BookingDetailCard
              booking={bookingDetail}
              userEmail={userEmail}
              onFetchMoney={onFetchMoney}
              onReloadData={handleSearch}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
