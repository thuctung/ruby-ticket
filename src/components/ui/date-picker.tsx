import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

type DatePickerCustomProps = {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
};

export default function DatePickerCustom({
  value,
  maxDate,
  minDate,
  onChange,
  ...props
}: DatePickerCustomProps | any) {
  const handleChange = (value: Date | null) => {
    if (value) {
      onChange(dayjs(value).format(BASIC_DATE_FORMAT));
    }
  };
  const minDateForm = dayjs(maxDate).format(SERVER_DATE_FORMAT);
  const maxDateForm = dayjs(maxDate).format(SERVER_DATE_FORMAT);
  return (
    <DatePicker
      {...props}
      value={value}
      onSelect={(value) => handleChange(value)}
      className="border p-1 rounded-sm"
      maxDate={maxDate ? new Date(maxDateForm) : undefined}
      minDate={minDate ? new Date(minDateForm) : undefined}
    />
  );
}
