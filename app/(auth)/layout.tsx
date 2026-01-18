import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In - Twitch Clone",
    description: "Sign in to your Twitch Clone account",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - branding */}
            <div className="hidden lg:flex lg:w-1/2 gradient-bg items-center justify-center p-12">
                <div className="text-center text-white max-w-md">
                    <div className="mb-8">
                        <svg
                            className="w-24 h-24 mx-auto"
                            viewBox="0 0 256 268"
                            fill="currentColor"
                        >
                            <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263h192.02v128.029l-40.739 40.741H128L93.098 226.935v-34.902H40.717V23.263zm64.008 116.405h23.275V69.803H104.725v69.865zm63.997 0h23.27V69.803h-23.27v69.865z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Twitch Clone</h1>
                    <p className="text-xl opacity-90">
                        Stream, watch, and connect with creators worldwide
                    </p>
                </div>
            </div>

            {/* Right side - auth form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16 bg-background">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
