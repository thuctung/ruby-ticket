
'use-client'

import { Button } from "@/components/ui/button";

import { ProfileType } from "@/types";
import { ACC_STATUS } from "@/commons/constant";
import { getStatusName } from "../constants";

type AffiTableProps = {
    profiles: ProfileType[],
    onResetPass: (user_id:string) => void,
    onUpdateStatus: (status:string, user_id:string) => void
}

export function AffiTable({ profiles, onResetPass, onUpdateStatus }: AffiTableProps) {

    const statusClass: Record<string, string> = {
  [ACC_STATUS.PENDING]: "text-yellow-600 bg-yellow-100",
  [ACC_STATUS.APPROVED]: "text-green-600 bg-green-100",
  [ACC_STATUS.SUSPENDED]: "text-red-600 bg-red-100",
}


    return (<div className="overflow-auto rounded-2xl border">
        <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
                <tr>
                    <th className="p-3">Tên</th>
                    <th className="p-3">UserName</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Trạng thái</th>
                    <th className="p-3">Ngày đăng ký</th>
                    <th className="p-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {profiles.length === 0 ? (
                    <tr>
                        <td className="p-3 text-muted-foreground" colSpan={5}>
                            Chưa có affiliate
                        </td>
                    </tr>
                ) : (
                    profiles.map((profile: ProfileType) => (
                        <tr key={profile.user_id} className="border-t">
                            <td className="p-3 font-medium">{profile.full_name}</td>
                            <td className="p-3">{profile.username}</td>
                            <td className="p-3">{profile.email}</td>
                            <td className="p-3">
                                <span className={`rounded-full border px-2 py-1 text-xs  ${statusClass[profile.status]}`}>
                                    {getStatusName(profile.status)}
                                </span>
                            </td>
                            <td className="p-3">{profile.created_at?.slice(0, 10)}</td>
                            <td className="p-3">
                                <div className="flex flex-wrap gap-2">
                                    {profile.status === ACC_STATUS.PENDING ? (
                                        <Button
                                            size="sm"
                                             onClick={() =>onUpdateStatus(ACC_STATUS.APPROVED , profile.user_id)}
                                        >
                                            Chấp nhận
                                        </Button>
                                    ) : null}
                                    {profile.status === ACC_STATUS.APPROVED ? (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                             onClick={() =>onUpdateStatus(ACC_STATUS.SUSPENDED,  profile.user_id)}
                                        >
                                            Dừng làm aff
                                        </Button>
                                    ) : null}
                                    {profile.status === ACC_STATUS.SUSPENDED ? (
                                        <Button
                                        onClick={() =>onUpdateStatus(ACC_STATUS.APPROVED, profile.user_id)}
                                            size="sm"
                                            variant="secondary"
                                        >
                                            Mở lại
                                        </Button>
                                    ) : null}

                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={()=>onResetPass(profile.user_id)}
                                    >
                                        Reset password
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>)
}