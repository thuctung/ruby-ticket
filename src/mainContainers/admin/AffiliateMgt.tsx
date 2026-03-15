"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    listAffiliates,
    resetAffiliatePassword,
    seedAffiliateIfMissing,
    setAffiliateStatus,
    type AffiliateAccount,
} from "@/lib/adminStore";
import { AdminAffiResponseType, CommonType, ProfileUpdateStatusType, SearchAffiType, SearchTableType } from "@/types";
import api from "@/axios";
import { GET_LIST_AFFILIATE } from "@/commons/apiURL";
import { ProfileType } from "@/types"
import { useCommonStore } from "@/stores/useCommonStore";
import { getListAffi, updateRole, updateStatus } from "./apis";
import { get } from "lodash";
import { AffiTable } from "./components/afffi-table";
import { AffiliateSearch } from "./components/search-form";
import { supabaseAdmin } from "@/lib/supabase/server";



export default function AffiliateMgt() {

    const [response, setRespose] = useState<AdminAffiResponseType>();

    const profiles = useMemo(() => get(response, 'profiles'), [response]) || []

    const [params, setParams] = useState<SearchTableType<SearchAffiType>>({
        searchValue: {
            email: '',
            username: '',
            status: '',
        },
        currentPage: 1
    })

    const handleGetListAff = useCallback(async () => {
        const data = await getListAffi(params);
        setRespose(data)
    }, [params])

    const handleUpdateStatus = useCallback(async (status: string, user_id: string) => {
        const paramUpdate: ProfileUpdateStatusType = {
            status,
            user_id
        }
        const response = await updateStatus(paramUpdate);
        if (response?.data) {
            handleGetListAff()
        }
    }, [handleGetListAff])

    const handleUpdateSearch = useCallback((value: SearchAffiType) => {
        setParams(pre => ({
            ...pre,
            searchValue: value
        }))

    }, [setParams])

    const handleResetPass = useCallback( () => {
        updateRole()
    }, [])

    useEffect(() => {
        handleGetListAff()
    }, [handleGetListAff]);


    return (
        <Card className="rounded-2xl">
            <CardHeader>
                <CardTitle>Quản lý Affiliate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Card>
                    <AffiliateSearch onSearch={handleUpdateSearch} />
                </Card>
                <AffiTable profiles={profiles} onUpdateStatus={handleUpdateStatus} onResetPass={handleResetPass} />
            </CardContent>
        </Card>
    );
}
