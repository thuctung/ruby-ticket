"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatVND } from "@/lib/money";
import { getWallet, issueTicketFromWallet, calcTotal } from "@/lib/affiliateStore";
import { getSessionUser } from "@/lib/sessionUser";
import type { ProductKey } from "@/lib/products";
import { listProducts, getProduct } from "@/lib/products";
import { useLang } from "@/lib/useLang";
import { t } from "@/lib/i18n/t";
import { useProfileStore } from "@/stores/useProfileStore";
import { CommonType, ProfileType } from "@/types";
import { LOCATIONS, PERSONS } from "@/commons/constant";
import { LocationType, PersonType, TicketType, TicketByLocationType, ProductType, ResultTicketSlectedType, ItemSelectType } from "@/types/ticket";
import { createOrderTicket, getProducts, getTicletByLocation } from "./api";
import { get, result } from "lodash";
import { sv_getCurrentProfile } from "@/app-controler/login/api";
import { useCommonStore } from "@/stores/useCommonStore";

const todayISO = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
};

export default function GetTicketPageControler() {
    const lang = useLang();
    const products = listProducts();


    const profile: ProfileType = useProfileStore((state: any) => state.profile);


    const [balance, setBalance] = useState(0);

    const [productKey, setProductKey] = useState<ProductKey>("bana");
    const product = getProduct(productKey);

    const [ticketOption, setTicketOption] = useState<string>("cap");

    const [travelDate, setTravelDate] = useState(todayISO());
    const [isCentralRegion, setIsCentralRegion] = useState(false);

    const [qtyAdult, setQtyAdult] = useState(1);
    const [qtySenior, setQtySenior] = useState(0);
    const [qtyChild, setQtyChild] = useState(0);

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        const load = () => setBalance(getWallet().balance);
        load();

        const onStorage = () => load();
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    // sync fields when switching product
    useEffect(() => {
        const p = getProduct(productKey);
        if (!p.showCentralRegionCheckbox) setIsCentralRegion(false);

        if (!p.paxTypes.includes("adult")) setQtyAdult(0);
        if (!p.paxTypes.includes("senior")) setQtySenior(0);
        if (!p.paxTypes.includes("child")) setQtyChild(0);

        if (p.ticketOptions?.length) {
            const first = p.ticketOptions[0]?.key;
            setTicketOption((prev) => {
                if (prev === "combo" || prev === "cap") return prev;
                return first === "combo" || first === "cap" ? first : "cap";
            });
        }

        // ensure at least 1
        setTimeout(() => {
            const totalQty =
                (p.paxTypes.includes("adult") ? qtyAdult : 0) +
                (p.paxTypes.includes("senior") ? qtySenior : 0) +
                (p.paxTypes.includes("child") ? qtyChild : 0);
            if (totalQty === 0) {
                if (p.paxTypes.includes("adult")) setQtyAdult(1);
                else if (p.paxTypes.includes("child")) setQtyChild(1);
            }
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productKey]);

    const totals = useMemo(() => {
        return calcTotal({
            productKey,
            ticketOption: productKey === "bana" ? ticketOption : undefined,
            isCentralRegion,
            qtyAdult,
            qtySenior,
            qtyChild,
        });
    }, [productKey, ticketOption, isCentralRegion, qtyAdult, qtySenior, qtyChild]);

    const canIssue = useMemo(() => {
        const totalQty = qtyAdult + qtySenior + qtyChild;
        return travelDate >= todayISO() && totalQty > 0 && email.includes("@");
    }, [travelDate, qtyAdult, qtySenior, qtyChild, email]);

    const { setGlobalLoading, setIsShowToast, setToastMessage }: CommonType | any = useCommonStore.getState();
    const { logout, setProfile }: any = useProfileStore.getState();

    const [discount, setDiscount] = useState(0)
    const [location, setLocation] = useState('BANA');

    const [dateUse, setDateUse] = useState('');

    const [ticketLocation, setTicketLocation] = useState<TicketByLocationType[]>([])

    const [productFilter, setProductFilter] = useState([]); // lay thong tin gia ve

    const [ticketType, setTicetType] = useState<string>(''); // cap or combo

    const [ticketCategory, setTicketCategory] = useState<any>({
    })


    const fetchTicketType = async () => {
        const data: TicketByLocationType[] | any = await getTicletByLocation(location);
        if (data?.length) {
            setTicketLocation(data)
            setTicetType(data[0].code)
        }
    }

    const fetchProduct = async (ticketType: string) => {
        const data: TicketType[] | any = await getProducts(ticketType);
        if (data?.length) {
            setProductFilter(data)
        }
    }

    const updateCategoryNum = (key: string, value: number) => {
        setTicketCategory((pre: any) => ({ ...pre, [key]: value }));
        
    }

    const handleChangeLocation = (locationCode: string) => {
        setLocation(locationCode);
        setTicketCategory({})
    }

    const sumMoneyTicket = (): ResultTicketSlectedType => {

        const result: ResultTicketSlectedType = {
            listItemSelect: [],
            total: 0,
        }
        const listKey = Object.keys(ticketCategory);
        listKey.forEach((keyCategory: string) => {
            const count = ticketCategory[keyCategory] || 0;
            if (count > 0) {
                const productPrice: ProductType | any = productFilter.find((item: ProductType) => item.category_code === keyCategory);
                if (productPrice) {
                    const money = productPrice?.price * count;
                    result.listItemSelect.push({
                        name: productPrice.ticket_name,
                        total: money,
                        quantity: count,
                        id: productPrice?.id,
                        code: productPrice?.code
                    })
                    result.total += money
                }
            }
        })
        return result
    }

    const resultTicketSelect: ResultTicketSlectedType = useMemo(() => sumMoneyTicket(), [ticketCategory]);

    const finalMoenyToPay = useMemo(() => {
        if (discount) {
            return resultTicketSelect.total - resultTicketSelect.total * discount
        }
        return resultTicketSelect.total
    }, [resultTicketSelect])

    const checkBalance = async () => {
        const { profile: data, error }: any = await sv_getCurrentProfile(profile.user_id);
        if (error) {
            setToastMessage(error);
            return false;
        }
        if (data) {
            setProfile(data);
            if (data?.balance < finalMoenyToPay) {
                setToastMessage('Số dư hiện tại không đủ !');
                return false;
            }
            return true
        }
        setToastMessage('Có lỗi xảy ra!');
        return false
    }

    const handlPayment = async () => {
        if (!finalMoenyToPay) return;
        const resultBalance = await checkBalance();
        if (resultBalance) {
            const data = await createOrderTicket(profile.user_id, resultTicketSelect.listItemSelect)
            console.log("data", data)
        }
    }

    useEffect(() => {
        if (ticketType) {
            fetchProduct(ticketType)
        }
        setTicketCategory({})
    }, [ticketType])

    useEffect(() => {
        if (location) {
            fetchTicketType()
        }
    }, [location])



    return (
        <div className="space-y-4">
            <Card className="rounded-2xl">
                <CardHeader>
                    <CardTitle>Rút vé / Xuất vé (trừ tiền ví)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">Số dư ví</div>
                        <div className="text-lg font-semibold">{profile.balance ? formatVND(profile.balance) : 0}</div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Điểm đến</Label>
                            <Select
                                value={location}
                                onValueChange={(v) => handleChangeLocation(v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t(lang, "checkout.switcher.title")} />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOCATIONS.map((location: LocationType) => (
                                        <SelectItem key={location.code} value={location.code}>
                                            {location.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">{t(lang, product.taglineKey)}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>{t(lang, "checkout.form.date")}</Label>
                            <Input
                                type="date"
                                min={todayISO()}
                                value={dateUse}
                                onChange={(e) => setDateUse(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>{t(lang, "checkout.form.ticketType")}</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {ticketLocation.map((item: TicketByLocationType) => (
                                <Button
                                    key={item.code}
                                    type="button"
                                    variant={ticketType === item.code ? "default" : "outline"}
                                    onClick={() => {
                                        setTicetType(item.code)
                                    }}
                                >
                                    {item.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {product.showCentralRegionCheckbox ? (
                        <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-4">
                            <div>
                                <div className="font-medium">{t(lang, "checkout.form.centralTitle")}</div>
                                <div className="text-sm text-muted-foreground">
                                    {t(lang, "checkout.form.centralDesc")}
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="h-5 w-5"
                                checked={isCentralRegion}
                                onChange={(e) => setIsCentralRegion(e.target.checked)}
                            />
                        </div>
                    ) : null}

                    <div className="space-y-3">
                        <div>
                            <div className="font-medium">{t(lang, "checkout.form.qtyTitle")}</div>
                            <div className="text-sm text-muted-foreground">{t(lang, "checkout.form.qtyDesc")}</div>
                        </div>

                        <div className={`grid grid-cols-1 gap-4 ${product.paxTypes.length >= 3 ? "sm:grid-cols-3" : product.paxTypes.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
                            {
                                productFilter.map((item: ProductType) => <div key={item.id} className="space-y-2">
                                    <Label>{item.category_name}</Label>
                                    <Input name={item.category_code} type="number" min={0} max={200} value={get(ticketCategory, item.category_code, 0)} onChange={(e) => updateCategoryNum(item.category_code, Number(e.target.value))} />
                                </div>)
                            }

                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <Label>{t(lang, "checkout.form.note")}</Label>
                        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={t(lang, "checkout.form.notePlaceholder")} />
                    </div>

                    <Card className="rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-base">Tóm tắt</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Tạm tính</span>
                                <span className="font-medium">{formatVND(resultTicketSelect.total)}</span>
                            </div>
                            {
                                resultTicketSelect.listItemSelect.map((item: ItemSelectType, index) => <div key={index} className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                                    <span className="font-medium">{formatVND(item.total)}</span>
                                </div>)
                            }

                            {discount ? <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Khuyến mãi : {discount * 100}%</span>
                                <span className="font-medium">{formatVND(resultTicketSelect.total - (resultTicketSelect.total * discount))}</span>
                            </div> : null}

                            <div className="flex items-center justify-between border-t pt-2">
                                <span className="font-semibold">Tổng</span>
                                <span className="font-semibold">{formatVND(finalMoenyToPay)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-end">
                        <Button
                            disabled={profile?.balance < finalMoenyToPay}
                            onClick={handlPayment}
                        >
                            {profile?.balance > finalMoenyToPay ? 'Xuất vé' : 'Số dư không đủ'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
