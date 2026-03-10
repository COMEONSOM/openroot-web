import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./styles/CertificateModal.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface StudentRecord {
  "Certificate ID"?: string;
  "Student Name"?: string;
  "Course Name"?: string;
  "Result Status"?: string;
  "Instructor Name"?: string;
}

export default function CertificateModal({ isOpen, onClose }: Props) {

  const [certId, setCertId] = useState("");
  const [result, setResult] =
    useState<StudentRecord | "notfound" | null>(null);

  /* -----------------------------------------
     VERIFY FUNCTION
  ----------------------------------------- */

  const verify = async (manualId?: string) => {

    const id = manualId || certId;

    if (!id) return;

    const response = await fetch(
      "https://opensheet.elk.sh/1-m4ytLPXA1F7Dbw9SkgTARMjPVeh6wCO4UJhqBGyTuc/Certificate%20Database"
    );

    const data = await response.json();

    const student = data.find((row: any) => {

      const sheetId = row["Certificate ID"];

      if (!sheetId) return false;

      return sheetId.trim().toLowerCase() === id.trim().toLowerCase();

    });

    setResult(student || "notfound");

  };

  /* -----------------------------------------
     AUTO VERIFY FROM QR CODE URL
     Example:
     openroot.in/?cert=ORS-AI-2026-001
  ----------------------------------------- */

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);

    const certFromURL = params.get("cert");

    if (certFromURL) {

      setCertId(certFromURL);

      verify(certFromURL);

    }

  }, []);

  /* -----------------------------------------
     MODAL NOT OPEN → RETURN NULL
  ----------------------------------------- */

  if (!isOpen) return null;

  /* -----------------------------------------
     RENDER MODAL USING PORTAL
  ----------------------------------------- */

  return createPortal(

    <div className="cert-overlay">

      <div className="cert-modal">

        <button
          className="cert-close"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="cert-title">
          Certificate Verification
        </h2>

        {/* INPUT AREA */}

        <div className="cert-input-row">

          <input
            type="text"
            placeholder="Enter Certificate ID"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
          />

          <button
            onClick={() => verify()}
          >
            Verify
          </button>

        </div>

        {/* VERIFIED RESULT */}

        {result && result !== "notfound" && (

          <div className="cert-result-card">

            <div className="cert-badge">
              ✓ VERIFIED
            </div>

            <p>
              <b>Student Name:</b> {result["Student Name"]}
            </p>

            <p>
              <b>Course:</b> {result["Course Name"]}
            </p>

            <p>
              <b>Result:</b> {result["Result Status"]}
            </p>

            <p>
              <b>Instructor:</b> {result["Instructor Name"]}
            </p>

          </div>

        )}

        {/* NOT FOUND */}

        {result === "notfound" && (

          <p className="cert-error">
            Certificate not found
          </p>

        )}

      </div>

    </div>,

    document.body

  );

}