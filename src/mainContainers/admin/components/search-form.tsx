"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { ACC_STATUS } from "@/commons/constant"
import { SearchAffiType } from "@/types"
import { getStatusName } from "../constants"


type AffiliateSearch = {
    onSearch:(value: SearchAffiType) =>void
}

export function AffiliateSearch({ onSearch }: any) {
  const [filters, setFilters] = useState({
   username: "",
    email: "",
    status: "",
  })

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleReset = () => {
    const empty = { username: "", email: "", status: "" }
    setFilters(empty)
    onSearch(empty)
  }

  const listStatus = [
    {title:getStatusName(ACC_STATUS.APPROVED) , value:ACC_STATUS.APPROVED},
    {title:getStatusName(ACC_STATUS.PENDING) , value:ACC_STATUS.PENDING},
    {title:getStatusName(ACC_STATUS.SUSPENDED) , value:ACC_STATUS.SUSPENDED},
  ]

  return (
    <div className="mb-4 pl-4 flex flex-wrap items-center gap-3">
      <Input
        placeholder="Username"
        value={filters.username}
        onChange={(e) => handleChange("username", e.target.value)}
        className="w-[200px]"
      />

      <Input
        placeholder="Email"
        value={filters.email}
        onChange={(e) => handleChange("email", e.target.value)}
        className="w-[220px]"
      />

      <Select
        value={filters.status}
        onValueChange={(value) => handleChange("status", value)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
            {listStatus.map(item => <SelectItem key={item.value} value={item.value}>{item.title}</SelectItem>)}
        </SelectContent>
      </Select>

      <Button onClick={handleSearch}>Search</Button>

      <Button variant="outline" onClick={handleReset}>
        Reset
      </Button>
    </div>
  )
}