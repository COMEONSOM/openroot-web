import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./styles/CertificateVerification.css";

interface StudentRecord {
  "Certificate ID"?: string;
  "Student Name"?: string;
  "Course Name"?: string;
  "Result Status"?: string;
  "Instructor Name"?: string;
}

type VerifyResult = StudentRecord | "notfound" | null;

const SHEET_URL =
  "https://opensheet.elk.sh/1-m4ytLPXA1F7Dbw9SkgTARMjPVeh6wCO4UJhqBGyTuc/Certificate%20Database";

export default function CertificateVerification() {
  const [searchParams] = useSearchParams();
  const [certId, setCertId] = useState("");
  const [result, setResult] = useState<VerifyResult>(null);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const verify = async (manualId?: string) => {
    const id = (manualId ?? certId).trim();

    if (!id) {
      setResult(null);
      return;
    }

    setLoading(true);
    setTouched(true);

    try {
      const response = await fetch(SHEET_URL);

      if (!response.ok) {
        throw new Error("Failed to load certificate database");
      }

      const data: StudentRecord[] = await response.json();

      const student =
        data.find((row) => {
          const sheetId = row["Certificate ID"];
          if (!sheetId) return false;

          return sheetId.trim().toLowerCase() === id.toLowerCase();
        }) ?? null;

      setResult(student || "notfound");
    } catch (error) {
      console.error("Certificate verification failed:", error);
      setResult("notfound");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const certFromURL = searchParams.get("cert");

    if (certFromURL) {
      setCertId(certFromURL);
      void verify(certFromURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main className="cert-page">
      <section className="cert-shell">
        <div className="cert-card">
          <div className="cert-header">
            <div>
              <p className="cert-kicker">Openroot Systems</p>
              <h1 className="cert-title">Certificate Verification</h1>
              <p className="cert-subtitle">
                Enter your Certificate ID or scan the QR code printed on your certificate to verify its authenticity instantly.
              </p>
            </div>

            <div className="cert-brand-chip" aria-label="Official verification page">
              Official Verification
            </div>
          </div>

          <div className="cert-input-row">
            <input
              type="text"
              placeholder="Enter Certificate ID"
              value={certId}
              onChange={(e) => {
                setCertId(e.target.value);
                if (result) setResult(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") void verify();
              }}
              autoComplete="off"
              spellCheck={false}
            />

            <button type="button" onClick={() => void verify()} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>

          {!touched && (
            <p className="cert-helper">
              Example: <strong>ORS-XX-20XX-00XX</strong>
            </p>
          )}

          {loading && (
            <div className="cert-state">
              <p className="cert-state-heading">Checking database…</p>
              <p className="cert-state-msg">Please wait a moment.</p>
            </div>
          )}

          {result && result !== "notfound" && (
            <div className="cert-result-card">
              <div className="cert-badge">✓ VERIFIED</div>

              <div className="cert-result-grid">
                <p><b>Student Name:</b> {result["Student Name"]}</p>
                <p><b>Course:</b> {result["Course Name"]}</p>
                <p><b>Result:</b> {result["Result Status"]}</p>
                <p><b>Instructor:</b> {result["Instructor Name"]}</p>
              </div>
            </div>
          )}

          {result === "notfound" && (
            <p className="cert-error">Certificate not found</p>
          )}
        </div>
      </section>
    </main>
  );
}