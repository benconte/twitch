"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyForm() {
    const { signIn } = useAuthActions();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only keep the last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split("").forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit;
        });
        setOtp(newOtp);

        // Focus the last filled input or the next empty one
        const focusIndex = Math.min(pastedData.length, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const code = otp.join("");
        if (code.length !== 6) {
            setError("Please enter the complete 6-digit code");
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.set("email", email);
            formData.set("code", code);
            formData.set("flow", "email-verification");

            await signIn("password", formData);
            router.push("/");
        } catch (err) {
            setError("Invalid or expired code. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        try {
            const formData = new FormData();
            formData.set("email", email);
            formData.set("flow", "signUp");

            await signIn("password", formData);
            setResendTimer(60);
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError("Failed to resend code. Please try again.");
            console.error(err);
        }
    };

    return (
        <div>
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
                <svg
                    className="w-16 h-16 mx-auto text-twitch-purple"
                    viewBox="0 0 256 268"
                    fill="currentColor"
                >
                    <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263h192.02v128.029l-40.739 40.741H128L93.098 226.935v-34.902H40.717V23.263zm64.008 116.405h23.275V69.803H104.725v69.865zm63.997 0h23.27V69.803h-23.27v69.865z" />
                </svg>
                <h1 className="text-2xl font-bold mt-4">Twitch Clone</h1>
            </div>

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-twitch-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-foreground">Check your email</h2>
                <p className="text-foreground-secondary mt-2">
                    We sent a verification code to
                </p>
                <p className="text-foreground font-medium">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-foreground mb-4 text-center">
                        Enter your verification code
                    </label>
                    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold input focus:border-twitch-purple"
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || otp.join("").length !== 6}
                    className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        "Verify email"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center space-y-4">
                <p className="text-foreground-secondary">
                    Didn&apos;t receive the code?{" "}
                    <button
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                        className={`font-semibold ${resendTimer > 0
                                ? "text-foreground-secondary cursor-not-allowed"
                                : "text-twitch-purple hover:text-accent-hover cursor-pointer"
                            }`}
                    >
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                    </button>
                </p>

                <p className="text-foreground-secondary">
                    <Link
                        href="/login"
                        className="text-twitch-purple hover:text-accent-hover font-semibold"
                    >
                        ← Back to sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

// Loading fallback
function VerifyFormLoading() {
    return (
        <div className="text-center">
            <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse" />
            <div className="h-8 bg-background-secondary rounded w-48 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-background-secondary rounded w-64 mx-auto animate-pulse" />
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<VerifyFormLoading />}>
            <VerifyForm />
        </Suspense>
    );
}
