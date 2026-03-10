import { useState } from "react";

interface StudentRecord {
  "Certificate ID"?: string;
  "Student Name"?: string;
  "Course Name"?: string;
  "Result Status"?: string;
  "Instructor Name"?: string;
}

export default function CertificateVerification() {

  const [certId, setCertId] = useState<string>("");
  const [result, setResult] = useState<StudentRecord | "notfound" | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCertificate = async () => {

    if (!certId.trim()) {
      setResult("notfound");
      return;
    }

    try {

      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://opensheet.elk.sh/1-m4ytLPXA1F7Dbw9SkgTARMjPVeh6wCO4UJhqBGyTuc/Certificate%20Database"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch certificate database");
      }

      const data: StudentRecord[] = await response.json();

      // Debugging (optional)
      // console.log(data);

      const student = data.find((row) => {

        const id = row["Certificate ID"];

        if (!id) return false;

        return id.toLowerCase().trim() === certId.toLowerCase().trim();

      });

      setResult(student || "notfound");

    } catch (err) {

      console.error("Verification error:", err);
      setError("Unable to verify certificate. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div style={{ padding: "60px", textAlign: "center" }}>

      <h2>Certificate Verification</h2>

      <input
        type="text"
        placeholder="Enter Certificate ID"
        value={certId}
        onChange={(e) => setCertId(e.target.value)}
        style={{
          padding: "10px",
          marginRight: "10px",
          width: "260px"
        }}
      />

      <button
        onClick={verifyCertificate}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        Verify
      </button>

      {loading && (
        <p style={{ marginTop: "20px" }}>Checking certificate...</p>
      )}

      {error && (
        <p style={{ marginTop: "20px", color: "orange" }}>
          {error}
        </p>
      )}

      {result && result !== "notfound" && (

        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "inline-block",
            textAlign: "left"
          }}
        >

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

      {result === "notfound" && !loading && (

        <p style={{ marginTop: "20px", color: "red" }}>
          Certificate not found
        </p>

      )}

    </div>

  );

}