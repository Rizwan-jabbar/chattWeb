import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    forgetPasswordThunk,
    resetPasswordThunk
} from "../../rtk/thunks/registerThunk/registerThunk";

function IconKey() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <circle cx="8.5" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="M12 12h9m-3 0v3m-3-3v2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconMail() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M4 7.5 12 13l8-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    );
}

function IconLock() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <rect x="5" y="10" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function InfoCard({ title, text }) {
    return (
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm font-semibold text-white">{title}</p>
            <p className="mt-2 text-xs leading-6 text-slate-400">{text}</p>
        </div>
    );
}

function ForgetPasword () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        loading,
        error,
        forgotPasswordEmail,
        forgotPasswordOtpSent,
        resetPasswordSuccess
    } = useSelector((state) => state.register);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSendRecoveryEmail = async (e) => {
        e.preventDefault();

        try {
            await dispatch(forgetPasswordThunk({ email })).unwrap();
        } catch (_error) {
            return;
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            await dispatch(
                resetPasswordThunk({
                    email: forgotPasswordEmail || email,
                    otp,
                    newPassword
                })
            ).unwrap();
            navigate("/login");
        } catch (_error) {
            return;
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.16),_transparent_24%),linear-gradient(145deg,_#020617_0%,_#0f172a_48%,_#111827_100%)]" />
            <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-400/10 blur-3xl" />

            <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
                    <section className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-sky-950/20 backdrop-blur xl:block">
                        <div className="max-w-xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-sky-200">
                                <IconKey />
                                Recovery Flow
                            </span>
                            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.02em] text-white">
                                Reset access with a calm, secure recovery screen.
                            </h1>
                            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                                A polished recovery experience for your chat app, designed to feel simple, trustworthy, and easy to follow on both desktop and mobile.
                            </p>

                            <div className="mt-10 space-y-4">
                                <InfoCard
                                    title="Email Verification"
                                    text="Send a one-time code or secure reset link to the email connected with your account."
                                />
                                <InfoCard
                                    title="Password Recovery"
                                    text="Guide users through creating a stronger password and restoring access without confusion."
                                />
                                <InfoCard
                                    title="Safe Account Access"
                                    text="Keep recovery calm and minimal so the experience still feels like part of the same app."
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-xl">
                        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-8">
                            <div className="mb-8">
                                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-cyan-400 text-slate-950 shadow-lg shadow-sky-500/20">
                                    <IconKey />
                                </div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-sky-200/80">
                                    Forgot Password
                                </p>
                                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">
                                    Recover your account
                                </h2>
                                <p className="mt-3 text-xs leading-6 text-slate-400 sm:text-sm">
                                    Enter the email connected to your account. We&apos;ll help you reset your password and get back into your chats.
                                </p>
                            </div>

                            <form onSubmit={forgotPasswordOtpSent ? handleResetPassword : handleSendRecoveryEmail} className="space-y-5">
                                {forgotPasswordOtpSent ? (
                                    <>
                                        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-3 text-xs text-sky-100 sm:text-sm">
                                            Recovery OTP sent to <span className="font-semibold">{forgotPasswordEmail || email}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                                OTP Code
                                            </label>
                                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-sky-400/60 focus-within:ring-2 focus-within:ring-sky-400/20">
                                                <IconKey />
                                                <input
                                                    className="w-full bg-transparent text-sm tracking-[0.32em] text-white outline-none placeholder:text-slate-500"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    placeholder="Enter OTP"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                                New Password
                                            </label>
                                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-sky-400/60 focus-within:ring-2 focus-within:ring-sky-400/20">
                                                <IconLock />
                                                <input
                                                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                            Email Address
                                        </label>
                                        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-sky-400/60 focus-within:ring-2 focus-within:ring-sky-400/20">
                                            <IconMail />
                                            <input
                                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            Step 1
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-white">
                                            Verify email
                                        </p>
                                        <p className="mt-1 text-xs leading-6 text-slate-400">
                                            Receive a secure code or reset link.
                                        </p>
                                    </div>

                                    <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            Step 2
                                        </p>
                                        <p className="mt-2 text-sm font-medium text-white">
                                            Create new password
                                        </p>
                                        <p className="mt-1 text-xs leading-6 text-slate-400">
                                            Choose a stronger password for your account.
                                        </p>
                                    </div>
                                </div>

                                {error ? (
                                    <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs text-rose-200 sm:text-sm">
                                        {error}
                                    </div>
                                ) : null}

                                {resetPasswordSuccess ? (
                                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-200 sm:text-sm">
                                        Password reset successful.
                                    </div>
                                ) : null}

                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-[0.99] hover:shadow-lg hover:shadow-sky-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                                    disabled={loading}
                                >
                                    <IconKey />
                                    {loading
                                        ? (forgotPasswordOtpSent ? "Resetting Password..." : "Sending Recovery Email...")
                                        : (forgotPasswordOtpSent ? "Reset Password" : "Send Recovery Email")}
                                </button>
                            </form>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 sm:text-sm">
                                <Link to="/login" className="font-semibold text-sky-300 transition hover:text-sky-200">
                                    Back to Login
                                </Link>
                                <Link to="/register" className="font-semibold text-sky-300 transition hover:text-sky-200">
                                    Create New Account
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ForgetPasword;
