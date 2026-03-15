"use client";

import api from "@/axios";
import { FORGOR_PASSWORD } from "@/commons/apiURL";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useState } from "react";

export default function ForgotPassword({ openForgotPass , setOpen}: { openForgotPass: boolean, setOpen:any }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const supabaseClient= createSupabaseBrowserClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const { error }: any =   await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage("Check your email to reset password.");
        }
        setLoading(false);
    };

    return (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >

            <div className="flex items-center justify-center  bg-white p-6 rounded-lg w-[400px] shadow-lg"  onClick={(e) => e.stopPropagation()}>
                <div className="  p-6 ">
                    <Card className="rounded-2xl w-full max-w-md bg-white shadow rounded-lg p-6">
                        <CardHeader>
                            <CardTitle >Forgot Password {openForgotPass}</CardTitle>
                        </CardHeader>

                        <Label htmlFor="email">Enter your email and we will send you a reset link.</Label>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full border rounded px-3 py-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded"
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>

                        {message ? <p className="text-sm text-destructive  mt-4">{message}</p> : null}
                    </Card>
                </div>
          </div>
            </div>
    );
}