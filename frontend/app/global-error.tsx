"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          background: "#F8F7F4",
          color: "#374151",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <h1 style={{ color: "#172554", fontSize: "20px", fontWeight: 600 }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: "14px", color: "#6B7280", maxWidth: "24rem" }}>
          A critical error occurred. Please reload the page.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "8px",
            background: "#18305F",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
        {error?.digest && (
          <p style={{ fontSize: "11px", color: "#9CA3AF" }}>Ref: {error.digest}</p>
        )}
      </body>
    </html>
  );
}
