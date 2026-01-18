"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { signIn } = useAuthActions();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.set("email", email);
            formData.set("password", password);
            formData.set("flow", "signIn");

            await signIn("password", formData);
            router.push("/");
        } catch (err) {
            setError("Invalid email or password. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-10">
                <svg
                    className="w-16 h-16 mx-auto text-twitch-purple"
                    viewBox="0 0 256 268"
                    fill="currentColor"
                >
                    <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263h192.02v128.029l-40.739 40.741H128L93.098 226.935v-34.902H40.717V23.263zm64.008 116.405h23.275V69.803H104.725v69.865zm63.997 0h23.27V69.803h-23.27v69.865z" />
                </svg>
                <h1 className="text-2xl font-bold mt-4">Twitch Clone</h1>
            </div>

            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
                <p className="text-foreground-secondary mt-3">
                    Sign in to continue to Twitch Clone
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div className="flex items-center justify-between mb-8">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-border text-twitch-purple focus:ring-twitch-purple"
                        />
                        <span className="ml-2 text-sm text-foreground-secondary">
                            Remember me
                        </span>
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-sm text-twitch-purple hover:text-accent-hover"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full py-3.5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
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
                            Signing in...
                        </span>
                    ) : (
                        "Sign in"
                    )}
                </button>
            </form>

            <div className="mt-10 text-center">
                <p className="text-foreground-secondary">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-twitch-purple hover:text-accent-hover font-semibold"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
