import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD, // Use Gmail App Password, not regular password
    },
});

export async function POST(request: NextRequest) {
    try {
        // Verify the request is from our Convex backend
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.EMAIL_API_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { email, token } = await request.json();

        if (!email || !token) {
            return NextResponse.json(
                { error: "Missing email or token" },
                { status: 400 },
            );
        }

        // Send the verification email
        await transporter.sendMail({
            from: `"Twitch Clone" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verify your email - Twitch Clone",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #9146FF; margin: 0;">Twitch Clone</h1>
                    </div>
                    <div style="background: linear-gradient(135deg, #9146FF 0%, #772CE8 100%); border-radius: 12px; padding: 30px; text-align: center;">
                        <h2 style="color: white; margin: 0 0 20px 0;">Verify Your Email</h2>
                        <p style="color: rgba(255,255,255,0.9); margin: 0 0 20px 0;">
                            Enter this code to complete your sign in:
                        </p>
                        <div style="background: white; border-radius: 8px; padding: 20px; display: inline-block;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #18181B;">
                                ${token}
                            </span>
                        </div>
                        <p style="color: rgba(255,255,255,0.7); margin: 20px 0 0 0; font-size: 14px;">
                            This code expires in 15 minutes.
                        </p>
                    </div>
                    <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
                        If you didn't request this code, you can safely ignore this email.
                    </p>
                </div>
            `,
            text: `Your verification code is: ${token}. This code expires in 15 minutes.`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to send email:", error);
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 },
        );
    }
}
