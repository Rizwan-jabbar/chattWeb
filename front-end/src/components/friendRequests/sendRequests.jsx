function SendRequests() {
    return (
        <section
            className="rounded-[1.5rem] border p-4 shadow-2xl sm:rounded-[2rem] sm:p-5"
            style={{
                borderColor: "var(--panel-border)",
                background: "var(--panel-bg)",
                boxShadow: "0 22px 60px rgba(51,65,85,0.14)",
            }}
        >
            <div className="border-b pb-4" style={{ borderColor: "var(--panel-border)" }}>
                <h1 className="text-lg font-semibold sm:text-xl" style={{ color: "var(--app-text)" }}>Sent Requests</h1>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
                    Requests you have sent will appear here.
                </p>
            </div>

            <div
                className="mt-4 rounded-[1.25rem] border border-dashed px-4 py-10 text-center sm:mt-5 sm:rounded-[1.5rem]"
                style={{
                    borderColor: "var(--panel-border)",
                    background: "rgba(255,255,255,0.02)",
                }}
            >
                <p className="text-sm" style={{ color: "var(--muted-text)" }}>No sent requests to show yet.</p>
            </div>
        </section>
    )
}

export default SendRequests;
