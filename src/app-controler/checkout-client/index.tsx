'use client'

import { useLang } from "@/lib/useLang";
import { CheckoutForm } from "./components/CheckoutForm";
import { t } from "@/lib/i18n/t";
import { useEffect, useState } from "react";
import { getLocationClient } from "./components/api";
import { LocationType } from "@/types/ticket";
import { useSearchParams } from 'next/navigation'



export default  function CheckoutControlerPage() {
    const lang = useLang();

    const searchParams = useSearchParams()
    const product = searchParams.get('product')|| 'BANA'

    const [locationList, setLocationList] = useState<LocationType[]>([]);
    const [loactionKey, setLocationKey] = useState(product) 

    const fetchLoction =  async() => {
       const data:any = await getLocationClient();
       setLocationList(data)
    }

    const onChangeLocation = (value:string) => {
        setLocationKey(value)
    }

    useEffect(() => {
        fetchLoction()
    },[])
    
    return <main className="min-h-screen flex flex-col bg-background text-foreground">
        <section className="relative bg-gradient-to-b from-blue-50/70 to-background">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                            {t(lang, "checkout.title")}
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                             {t(lang,"checkout.subtitle")}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="mx-auto w-full max-w-6xl flex-1 p-6">
            <CheckoutForm location={loactionKey} productKey={loactionKey} locations={locationList} onChangeLocation={onChangeLocation}/>
        </section>
    </main>
}
