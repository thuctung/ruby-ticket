"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getListPricing, upsertPrice, getLocations, getTicketTypes, getProductsByTicketType } from "./apis";
import { PricingHeader } from "./components/pricing-header";
import { PricingForm } from "./components/pricing-form";
import { PaxType } from "@/lib/adminStore";

export default function PricingMgt() {
  const [tier, setTier] = useState<string>("customer");
  
  const [locations, setLocations] = useState<any[]>([]);
  const [locationCode, setLocationCode] = useState<string>("");

  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [ticketTypeCode, setTicketTypeCode] = useState<string>("");

  const [products, setProducts] = useState<any[]>([]);

  const [rows, setRows] = useState<any[]>([]);

  const [form, setForm] = useState<
    Record<string, { basePrice: number; promoPrice?: number; centralEligible: boolean }>
  >({});

  const handleGetListPricing = useCallback(async () => {
    const data = await getListPricing();
    setRows(data);
  }, []);

  const handleGetLocations = useCallback(async () => {
    const locs = await getLocations();
    setLocations(locs);
  }, []);

  const handleGetTicketTypes = useCallback(async (code: string) => {
    const types = await getTicketTypes(code);
    setTicketTypes(types);
    setTicketTypeCode("");
    setProducts([]);
  }, []);

  const handleGetProducts = useCallback(async (typeCode: string) => {
    const prods = await getProductsByTicketType(typeCode);
    setProducts(prods);
  }, []);

  useEffect(() => {
    handleGetListPricing();
    handleGetLocations();
  }, [handleGetListPricing, handleGetLocations]);

  useEffect(() => {
    if (locationCode) {
      handleGetTicketTypes(locationCode);
    } else {
      setTicketTypes([]);
      setTicketTypeCode("");
    }
  }, [locationCode, handleGetTicketTypes]);

  useEffect(() => {
    if (ticketTypeCode) {
      handleGetProducts(ticketTypeCode);
    } else {
      setProducts([]);
    }
  }, [ticketTypeCode, handleGetProducts]);

  useEffect(() => {
    const newForm: any = {};
    products.forEach((product) => {
      const existing = rows.find(
        (r) => r.product_key === product.code && r.tier === tier
      );
      newForm[product.code] = {
        basePrice: Number(existing?.base_price ?? 0),
        promoPrice: existing?.promo_price ? Number(existing?.promo_price) : undefined,
        centralEligible: existing?.central_eligible ?? true,
      };
    });
    setForm(newForm);
  }, [products, tier, rows]);

  const handleSave = async () => {
    if (products.length === 0) {
      alert("Không có sản phẩm để lưu!");
      return;
    }
    for (const product of products) {
      const productCode = product.code;
      const formData = form[productCode];
      const existing = rows.find(
        (r) => r.product_key === productCode && r.tier === tier
      );
      
      await upsertPrice({
        id: existing?.id,
        product_key: productCode,
        pax_type: product.pax_type || "LON", // Default to "LON" (Adult) if not specified
        tier,
        base_price: formData.basePrice,
        promo_price: formData.promoPrice,
        central_eligible: formData.centralEligible,
      });
    }
    handleGetListPricing();
  };

  return (    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Cấu hình bảng giá</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PricingHeader
          locations={locations}
          locationCode={locationCode}
          setLocationCode={setLocationCode}
          ticketTypes={ticketTypes}
          ticketTypeCode={ticketTypeCode}
          setTicketTypeCode={setTicketTypeCode}
          tier={tier}
          setTier={setTier}
        />
        <Separator />
        <PricingForm 
          products={products} 
          form={form} 
          setForm={setForm} 
          onSave={handleSave} 
        />
      </CardContent>
    </Card>
  );
}
