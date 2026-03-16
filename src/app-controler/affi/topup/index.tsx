"use client";

import { useProfileStore } from "@/stores/useProfileStore";
import AddMoeny from "./components/addMoeny";
import { TopupHistory } from "./components/topupHistory";
import { ProfileType, QRBankResponseType, TopupHistoryResponseType } from "@/types";
import { creteNewTopup, getListTopupByAff, getQRCodeBank } from "./apis";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import BankTransferQR from "./components/qrToBank";

export default function AffiliateTopupPageControl() {
  const profile: ProfileType = useProfileStore((state: any) => state.profile);

  const [history, setHistory] = useState<TopupHistoryResponseType[]>([]);
  const [urlQR, setQR] = useState<QRBankResponseType | null>()

  const [isShowPopup, setIsShowPopup] = useState(false)


  const handleAfterCreateTopup = () => {
    handleGetHistory();
  }

  const handleSubmitTopup = () => {
    if(urlQR){
      creteNewTopup(urlQR.amount, profile.user_id, urlQR.code, handleAfterCreateTopup);
      setIsShowPopup(false)
    }
  }

  const handleGetHistory = async () => {
    const data: [] | null = await getListTopupByAff(profile.user_id);
    if (data?.length) {
      setHistory(data)
    }
  }

  const openTopup = async (amount: number) => {
    const data = await getQRCodeBank(amount);
    if (!isEmpty(data)) {
      setQR(data)
      setIsShowPopup(true)
    }
  }

  useEffect(() => {
    if (profile.user_id) {
      handleGetHistory()
    }
  }, [profile.user_id])

  return (
    <div className="space-y-4">
      <AddMoeny onSubmitTopup={openTopup} curentBalance={profile.balance}/>
      {urlQR && isShowPopup && <BankTransferQR dataQR={urlQR} isOpen={isShowPopup} onDone={handleSubmitTopup}/>}
      <TopupHistory history={history} />
    </div>
  );
}
