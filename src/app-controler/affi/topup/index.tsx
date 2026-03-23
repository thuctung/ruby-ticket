"use client";

import { useProfileStore } from "@/stores/useProfileStore";
import AddMoeny from "./components/addMoeny";
import { TopupHistory } from "./components/topupHistory";
import { CommonType, ProfileType, QRBankResponseType, TopupHistoryResponseType } from "@/types";
import { creteNewTopup, getListTopupByAff } from "./apis";
import { useEffect, useState } from "react";
import BankTransferQR from "./components/qrToBank";
import { getBankInfo } from "@/helpers/getQRBank";
import { getCodeTopup } from "@/helpers/genCode";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { DB_TABLE_NAME, PAYMENT_STATUS } from "@/commons/constant";
import { useCommonStore } from "@/stores/useCommonStore";
import { sv_getCurrentProfile } from "@/app-controler/login/api";
import Pagination from "@/components/ui/pagination";

export default function AffiliateTopupPageControl() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);
  const clientSupbase = createSupabaseBrowserClient();
  const { setToastMessage }: CommonType | any = useCommonStore.getState();

  const [history, setHistory] = useState<TopupHistoryResponseType[]>([]);
  const [urlQR, setQR] = useState<QRBankResponseType | null>();

  const [isShowPopup, setIsShowPopup] = useState(false);
  const [curentPage, setCurentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleAfterCreateTopup = () => {
    handleGetHistory();
  };

  const handleSubmitTopup = () => {
    if (urlQR) {
      creteNewTopup(urlQR.amount, profile.user_id, urlQR.code, handleAfterCreateTopup);
      setIsShowPopup(false);
    }
  };

  const handleGetHistory = async () => {
    const { data, totalPages }: any = await getListTopupByAff(profile.user_id, curentPage);
    if (data?.length) {
      setHistory(data);
      setTotalPages(totalPages);
    }
  };

  const openTopup = (amount: number) => {
    const code = getCodeTopup();
    const qrLink = getBankInfo(amount, code);
    setQR({
      qr: qrLink,
      code,
      amount,
    });
    setIsShowPopup(true);
  };

  useEffect(() => {
    if (profile.user_id) {
      handleGetHistory();
    }
  }, [profile.user_id, curentPage]);

  useEffect(() => {
    if (urlQR?.code) {
      const channel = clientSupbase
        .channel("check-payment-aff")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: DB_TABLE_NAME.TOPUPS,
            filter: `payment_code=eq.${urlQR.code}`,
          },
          (payload) => {
            if (payload.new.status === PAYMENT_STATUS.COMPLETED) {
              handleGetHistory();
              sv_getCurrentProfile(profile.user_id);
            } else if (payload.new.status === PAYMENT_STATUS.FAILED) {
              setToastMessage("Thanh toán thất bại! Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ");
            }
          }
        )
        .subscribe();

      return () => {
        clientSupbase.removeChannel(channel);
      };
    }
  }, [urlQR?.code]);

  return (
    <div className="space-y-4">
      <AddMoeny onSubmitTopup={openTopup} curentBalance={profile.balance} />
      {urlQR && isShowPopup && (
        <BankTransferQR
          dataQR={urlQR}
          isOpen={isShowPopup}
          onDone={handleSubmitTopup}
          mesage="Vui lòng không thay đổi nội dung chuyển khoản"
        />
      )}
      <TopupHistory history={history} />
      <Pagination
        onChangePage={(page) =>  setCurentPage(page)}
        page={curentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
