"use client";

import { useCallback, useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {  SearchAffiType, SearchTableType, TopupMgtResponseType } from "@/types";
import { get } from "lodash";
import { AffiliateSearch } from "../affiliate-mgt/components/search-form";
import { listTopupMgtStatus } from "./components/constants";
import { TopupMgtList } from "./components/topupList";
import { getListTopupMgt, updateTopupMgtStatus } from "./apis";



export default function TopupMgtControl() {

    const [listTopupMgt, setListTopMgt] = useState<TopupMgtResponseType[]>([]);

    const [params, setParams] = useState<SearchTableType<SearchAffiType>>({
        searchValue: {
            email: '',
            username: '',
            status: '',
        },
        currentPage: 1
    })

    const handleUpdateSearch = useCallback((value: SearchAffiType) => {
        setParams(pre => ({
            ...pre,
            searchValue: value
        }))

    }, [setParams])

    const handleGetListAff = useCallback(async () => {
        const res = await getListTopupMgt(params);
        const data = get(res,'listTopup', [])
        setListTopMgt(data)
    }, [params])

    const handleUpdateStatus = useCallback(async (topup_id: string) => {
        
        const response = await updateTopupMgtStatus(topup_id);
        if (response?.data) {
            handleGetListAff()
        }
    }, [handleGetListAff])

    useEffect(() => {
        handleGetListAff()
    },[params])


    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>Quản lý Nạp tiền</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <AffiliateSearch onSearch={handleUpdateSearch} listStatus={listTopupMgtStatus} />
                </Card>
                <TopupMgtList history={listTopupMgt} onApproveTopup={handleUpdateStatus} />
            </CardContent>
        </Card>
    );
}
