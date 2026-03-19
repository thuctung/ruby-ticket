"use client";

import { useProfileStore } from "@/stores/useProfileStore";
import AddMoeny from "./components/addMoeny";
import { TopupHistory } from "./components/topupHistory";
import { ProfileType, QRBankResponseType, TopupHistoryResponseType } from "@/types";
import { creteNewTopup, getListTopupByAff } from "./apis";
import { useEffect, useState } from "react";
import BankTransferQR from "./components/qrToBank";
import { getBankInfo } from "@/helpers/getQRBank";
import { getCodeTopup } from "@/helpers/genCode";

export default function AffiliateTopupPageControl() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);

  const [history, setHistory] = useState<TopupHistoryResponseType[]>([]);
  const [urlQR, setQR] = useState<QRBankResponseType | null>();

  const [isShowPopup, setIsShowPopup] = useState(false);

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
    const data: [] | null = await getListTopupByAff(profile.user_id);
    if (data?.length) {
      setHistory(data);
    }
  };

  const openTopup = (amount: number) => {
    const code = getCodeTopup();
    const qrLink = getBankInfo(amount, getCodeTopup());
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
  }, [profile.user_id]);

  return (
    <div className="space-y-4">
      <AddMoeny onSubmitTopup={openTopup} curentBalance={profile.balance} />
      {urlQR && isShowPopup && (
        <BankTransferQR dataQR={urlQR} isOpen={isShowPopup} onDone={handleSubmitTopup} />
      )}
      <TopupHistory history={history} />
    </div>
  );
}
