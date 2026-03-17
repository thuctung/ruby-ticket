import { BASIC_DATE_FORMAT } from "@/helpers/dateTime"
import dayjs from "dayjs"
import DatePicker from "react-datepicker"


type DatePickerCustomProps = {
    value: string,
    onChange: (value: string) => void
    minDate?: string,
    maxDate?: string
}

export default function DatePickerCustom({ value, maxDate, minDate, onChange }: DatePickerCustomProps) {
    const handleChange = (value: Date | null) => {
        if (value) {
            onChange(dayjs(value).format(BASIC_DATE_FORMAT))
        }
    }


    return <DatePicker
        value={value}
        onSelect={(value) => handleChange(value)}
        className="border p-1 rounded-sm"
        maxDate={maxDate ? new Date(maxDate) : undefined}
        minDate={minDate ? new Date(minDate) : undefined}
    />
}
