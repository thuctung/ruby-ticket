"use client"

import { jsPDF } from "jspdf"
import QRCodePDF from "qrcode"
import QRCode from "react-qr-code"
import { getFontBase64 } from "./getFont"
import { TicketResultQRType } from "@/types/ticket"
import dayjs from "dayjs"
import { LOCATIONS } from "@/commons/constant"
import { useMemo } from "react"

type TicketResultQRProps = {
    tickets: TicketResultQRType[]
    onClose: () => void,
    location:string,
    dateUse?:Date
}
export default function TicketResultQR({
    tickets,
    onClose,
    location,
    dateUse
}: TicketResultQRProps) {

    const dateUseFormat = dayjs(dateUse).format('DD/MM/YYYY')

   


    const downloadPDF = async () => {
        const pdf = new jsPDF({
            unit: "px",
            format: [350, 360],
        })
        const fontBase64 = await getFontBase64()

        pdf.addFileToVFS("Roboto.ttf", fontBase64)
        pdf.addFont("Roboto.ttf", "Roboto", "normal")
        pdf.setFont("Roboto")

        for (let i = 0; i < tickets.length; i++) {
            const t = tickets[i]

            if (i > 0) pdf.addPage([350, 360])

            // ===== HEADER =====
            pdf.setFillColor(37, 99, 235)
            pdf.rect(0, 0, 350, 40, "F")

            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(18)
            pdf.text(location, 16, 25)

            // ===== CONTENT =====
            pdf.setTextColor(0, 0, 0)

            pdf.setFontSize(16)
            pdf.text(t.ticket_name, 175, 100, { align: "center" })

            pdf.setFontSize(14)
            pdf.text(t.ticket_code, 175, 125, { align: "center" })

            pdf.setFontSize(12)
            pdf.text(dateUseFormat, 175, 145, { align: "center" })

            // ===== QR =====
            const qr = await QRCodePDF.toDataURL(t.ticket_code)
            pdf.addImage(qr, "PNG", 125, 160, 100, 100)

            // ===== FOOTER =====
            pdf.setFontSize(12)
            pdf.text("Đại lý: Ruby Travel", 175, 300, { align: "center" })
            pdf.text("Hotline: 0705 551 668", 175, 320, { align: "center" })

            // ===== NOTE =====
            pdf.setTextColor(120, 120, 120)
            pdf.setFontSize(10)
            pdf.text(
                "Vé chỉ sử dụng 1 lần - Không hoàn trả",
                175,
                340,
                { align: "center" }
            )
        }

        pdf.save("tickets.pdf")
    }

     const handleClose = () => {
        onClose();
        downloadPDF();
    }

    if (!tickets?.length) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-[420px] max-h-[80vh] flex flex-col">

                {/* HEADER */}
                <div className="p-4 border-b text-center font-bold">
                    Vé của bạn
                </div>

                {/* LIST */}
                <div className="flex-1 overflow-y-auto p-4">

                    {tickets.map((t, i) => (
                        <div
                            key={i}
                            className="rounded-xl mb-4 overflow-hidden shadow"
                            style={{ background: "#f0f9ff" }}
                        >

                            {/* HEADER vé */}
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 text-lg font-bold">
                                {location}
                            </div>

                            {/* BODY */}
                            <div className="p-3 text-center">

                                <p className="font-semibold">
                                    {t.ticket_name}
                                </p>

                                <p className="text-sm mt-3">
                                    {t.ticket_code}
                                </p>

                                {dateUse && (
                                    <p className="text-xs text-gray-500 mt-3">
                                        {dateUseFormat}
                                    </p>
                                )}

                                {/* QR */}
                                <div className="flex justify-center mt-3">
                                    <QRCode
                                        value={`${t.ticket_code}|${dateUseFormat || ""}`}
                                        size={110}
                                    />
                                </div>

                                {/* Đại lý */}
                                <div className="p-4 flex flex-col h-[130px] text-sm">

                                    <div className="mt-auto">
                                        <p>Đại lý: Ruby Travel</p>
                                        <p>Hotline: 0705 551 668</p>
                                    </div>
                                    <p className="text-center text-gray-500 text-xs mt-3">
                                        Vé chỉ sử dụng 1 lần - Không hoàn trả
                                    </p>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>

                {/* FOOTER */}
                <div className="p-4 border-t flex gap-2">

                    <button
                        onClick={downloadPDF}
                        className="flex-1 bg-blue-500 text-white py-2 rounded"
                    >
                        Tải PDF
                    </button>

                    <button
                        onClick={handleClose}
                        className="flex-1 bg-gray-300 py-2 rounded"
                    >
                        Đóng
                    </button>

                </div>

            </div>

        </div>
    )
}