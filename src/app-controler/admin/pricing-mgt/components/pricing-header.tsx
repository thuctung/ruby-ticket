import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PricingHeaderProps {
  locations: any[];
  locationCode: string;
  setLocationCode: (code: string) => void;
  ticketTypes: any[];
  ticketTypeCode: string;
  setTicketTypeCode: (code: string) => void;
  tier: string;
  setTier: (tier: any) => void;
}

export function PricingHeader({
  locations,
  locationCode,
  setLocationCode,
  ticketTypes,
  ticketTypeCode,
  setTicketTypeCode,
  tier,
  setTier,
}: PricingHeaderProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Chọn địa điểm</Label>
          <select
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={locationCode}
            onChange={(e) => setLocationCode(e.target.value)}
          >
            <option value="">-- Chọn địa điểm --</option>
            {locations.map((loc) => (
              <option key={loc.code} value={loc.code}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {locationCode && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">Chọn loại vé</Label>
            <select
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={ticketTypeCode}
              onChange={(e) => setTicketTypeCode(e.target.value)}
            >
              <option value="">-- Chọn loại vé --</option>
              {ticketTypes.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-muted-foreground">Nhóm khách hàng (Tier)</Label>
        <Tabs value={tier} onValueChange={setTier} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customer">Khách lẻ</TabsTrigger>
            <TabsTrigger value="agent1">Đại lý cấp 1</TabsTrigger>
            <TabsTrigger value="agent2">Đại lý cấp 2</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
