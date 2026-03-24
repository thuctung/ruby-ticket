import { BASIC_DATE_FORMAT, SERVER_DATE_FORMAT } from "@/helpers/dateTime";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

type DatePickerCustomProps = {
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  maxDate?: string;
  className?: string;
};

export default function DatePickerCustom({
  value,
  maxDate,
  minDate,
  onChange,
  className,
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
    <div className="relative w-full ">
      <DatePicker
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        wrapperClassName="w-full"
        className={`w-full bg-white border border-gray-100 shadow-sm rounded-2xl p-3 px-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 font-medium ${className}`}
        placeholderText="DD/MM/YYYY"
        popperPlacement="top-start"
        popperModifiers={[
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
            },
          },
        ]}
        {...props}
        value={value}
        onSelect={(value) => handleChange(value)}
        maxDate={maxDate ? new Date(maxDateForm) : undefined}
        minDate={minDate ? new Date(minDateForm) : undefined}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
}
