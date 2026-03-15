
import Link from "next/link";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MenuMgtType } from "@/types";


type SideBarManagerProps = {
    menuList: MenuMgtType[]
}
export default function SideBarManager({ menuList }: SideBarManagerProps) {
    return (
        <Card className="rounded-2xl">
            <CardContent className="space-y-2">
                {menuList.map(item => <Button key={item.link} variant="outline" className="w-full justify-start" asChild>
                    <Link href={item.link}>{item.lable}</Link>
                </Button>)}
            </CardContent>
        </Card>
    )
}