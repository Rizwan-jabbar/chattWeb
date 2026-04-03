import { useState } from "react";
import { useDispatch , useSelector } from "react-redux";
import { registerThunk, verifyOTPThunk } from "../../rtk/thunks/registerThunk/registerThunk";
import { Link, useNavigate } from "react-router-dom";

function IconSpark() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M12 2.5 14.756 9.244 21.5 12l-6.744 2.756L12 21.5l-2.756-6.744L2.5 12l6.744-2.756L12 2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M5 19c1.6-3.2 4.1-4.8 7-4.8s5.4 1.6 7 4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function IconEye({ open }) {
    return open ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M3 3 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10.585 10.586A2 2 0 0 0 13.414 13.415" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M6.53 6.53C4.144 8.133 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.9 9.9 0 0 0 4.2-.892" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.88 5.72A10.3 10.3 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.76 16.76 0 0 1-2.91 3.72" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function FeatureCard({ icon, text }) {
    return (
        <div className="rounded-[1.6rem] border border-white/10 bg-slate-900/70 p-5">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                {icon}
            </div>
            <p className="text-xs leading-6 text-slate-400">{text}</p>
        </div>
    );
}

function Register () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        loading,
        error,
        success,
        otpPendingVerification,
        registeredEmail,
        verificationSuccess
    } = useSelector((state) => state.register);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(registerThunk(formData)).unwrap();
        } catch (_error) {
            return;
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            await dispatch(
                verifyOTPThunk({
                    email: registeredEmail || formData.email,
                    otp
                })
            ).unwrap();

            setOtp("");
            setFormData({
                username: '',
                email: '',
                password: ''
            });
            navigate("/login");
        } catch (_error) {
            return;
        }
    };

    return (
        <>
            <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(145deg,_#020617_0%,_#111827_48%,_#0f172a_100%)]" />
                <div className="absolute right-10 top-16 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

                <div className="relative mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                        <section className="hidden rounded-[1.9rem] border border-white/10 bg-white/5 p-7 shadow-2xl shadow-emerald-950/20 backdrop-blur xl:block">
                            <div className="max-w-xl">
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-200">
                                    <IconSpark />
                                    Team Chat Platform
                                </span>
                                <h1 className="mt-6 text-[2.5rem] font-semibold leading-tight tracking-[-0.03em] text-white">
                                    Build your identity before the first message lands.
                                </h1>
                                <p className="mt-4 max-w-lg text-[13px] leading-7 text-slate-300">
                                    A polished onboarding surface tailored for messaging apps, with a strong dashboard feel and responsive layout that scales smoothly from mobile to desktop.
                                </p>

                                <div className="mt-10 space-y-4">
                                    <FeatureCard icon={<IconUser />} text="Private groups, direct chats, and shared spaces" />
                                    <FeatureCard icon={<IconMail />} text="Designed with calm contrast, smooth spacing, and app-like depth" />
                                    <FeatureCard icon={<IconLock />} text="Ready for future chat dashboards, sidebars, and conversation panels" />
                                </div>
                            </div>
                        </section>

                        <section className="mx-auto w-full max-w-lg lg:justify-self-end">
                            <div className="rounded-[1.9rem] border border-white/10 bg-slate-900/82 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur sm:p-7">
                                <div className="mb-7">
                                    <div className="mb-4 inline-flex h-13 w-13 items-center justify-center rounded-[1.15rem] bg-gradient-to-br from-emerald-300 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20">
                                        <IconSpark />
                                    </div>
                                    <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-emerald-200/80">
                                        Create Account
                                    </p>
                                    <h2 className="mt-3 text-[1.85rem] font-semibold tracking-[-0.03em] text-white">
                                        Join your chat workspace
                                    </h2>
                                    <p className="mt-3 text-[13px] leading-6 text-slate-400">
                                        Set up your profile and step into a messaging experience built for fast conversations and clean collaboration.
                                    </p>
                                </div>

                                <form onSubmit={otpPendingVerification ? handleVerifyOtp : handleSubmit} className="space-y-4.5">
                                    {otpPendingVerification ? (
                                        <>
                                            <div className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-200 sm:text-sm">
                                                Verification code sent to <span className="font-semibold">{registeredEmail || formData.email}</span>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">OTP Code</label>
                                                <div className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20">
                                                    <IconMail />
                                                    <input
                                                        className="w-full bg-transparent text-sm tracking-[0.35em] text-white outline-none placeholder:text-slate-500 selection:bg-emerald-300 selection:text-slate-950"
                                                        type="text"
                                                        inputMode="numeric"
                                                        maxLength={6}
                                                        placeholder="Enter OTP"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Username</label>
                                                <div className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20">
                                                    <IconUser />
                                                    <input 
                                                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 selection:bg-emerald-300 selection:text-slate-950"
                                                        type="text" 
                                                        placeholder="Choose a username" 
                                                        value={formData.username}
                                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Email Address</label>
                                                <div className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20">
                                                    <IconMail />
                                                    <input 
                                                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 selection:bg-emerald-300 selection:text-slate-950"
                                                        type="email" 
                                                        placeholder="you@example.com" 
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Password</label>
                                                <div className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-400 transition focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20">
                                                    <IconLock />
                                                    <input 
                                                        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 selection:bg-emerald-300 selection:text-slate-950"
                                                        type={showPassword ? "text" : "password"} 
                                                        placeholder="Minimum 6 characters" 
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((prev) => !prev)}
                                                        className="text-slate-400 transition hover:text-emerald-200"
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        <IconEye open={showPassword} />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {error && (
                                        <div className="rounded-[1.1rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs text-rose-200 sm:text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {success && !otpPendingVerification && (
                                        <div className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-200 sm:text-sm">
                                            Registration successful. Please verify your email.
                                        </div>
                                    )}

                                    {verificationSuccess && (
                                        <div className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-xs text-emerald-200 sm:text-sm">
                                            Email verified successfully.
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="flex w-full items-center justify-center gap-2 rounded-[1.1rem] bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:scale-[0.99] hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                                            disabled={loading}
                                        >
                                            <IconSpark />
                                            {loading ? (otpPendingVerification ? "Verifying..." : "Creating account...") : (otpPendingVerification ? "Verify OTP" : "Register")}
                                        </button>
                                    </div>
                                </form>

                                <p className="mt-6 text-center text-xs text-slate-400 sm:text-sm">
                                    Already have an account?{" "}
                                    <Link to="/login" className="font-semibold text-emerald-300 transition hover:text-emerald-200">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>

        </>
    )
}

export default Register;
