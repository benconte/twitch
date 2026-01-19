"use client";

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const { signIn } = useAuthActions();
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters");
            return false;
        }
        if (formData.username.length < 3) {
            setError("Username must be at least 3 characters");
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            setError("Username can only contain letters, numbers, and underscores");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const data = new FormData();
            data.set("email", formData.email);
            data.set("password", formData.password);
            data.set("name", formData.username);
            data.set("flow", "signUp");

            await signIn("password", data);

            // Redirect to verification page
            // router.push(`/login`);
        } catch (err) {
            setError("Failed to create account. Email may already be in use.");
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
                <h2 className="text-3xl font-bold text-foreground">Create account</h2>
                <p className="text-foreground-secondary mt-3">
                    Join the Twitch Clone community
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="input"
                        placeholder="coolstreamer123"
                        required
                    />
                    <p className="mt-2 text-xs text-foreground-secondary">
                        This will be your public username
                    </p>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input"
                        placeholder="••••••••"
                        required
                    />
                    <p className="mt-2 text-xs text-foreground-secondary">
                        Must be at least 8 characters
                    </p>
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <div className="flex items-start mb-4">
                    <input
                        type="checkbox"
                        id="terms"
                        className="w-4 h-4 mt-0.5 rounded border-border text-twitch-purple focus:ring-twitch-purple"
                        required
                    />
                    <label
                        htmlFor="terms"
                        className="ml-3 text-sm text-foreground-secondary"
                    >
                        I agree to the{" "}
                        <Link
                            href="/terms"
                            className="text-twitch-purple hover:text-accent-hover"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="text-twitch-purple hover:text-accent-hover"
                        >
                            Privacy Policy
                        </Link>
                    </label>
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
                            Creating account...
                        </span>
                    ) : (
                        "Create account"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-foreground-secondary">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-twitch-purple hover:text-accent-hover font-semibold"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
