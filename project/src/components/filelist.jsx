import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const FileList = () => {
  const handleLoginSuccess = (credentialResponse) => {
    const accessToken = credentialResponse.credential;
    localStorage.setItem("accessToken", accessToken);
    console.log("Login berhasil, token:", accessToken);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const accessToken = localStorage.getItem("accessToken");

    try {
      const metadata = {
        name: file.name,
        mimeType: file.type,
      };

      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
      );
      form.append("file", file);

      const res = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({
            Authorization: "Bearer " + accessToken,
          }),
          body: form,
        }
      );

      const result = await res.json();
      console.log("Upload success:", result);
      alert(`Berhasil upload: ${result.name}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload gagal!");
    }
  };

  return (
    <div>
      <h2>Google Drive Manager</h2>

      {/* Login Button */}
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Login Gagal")}
        useOneTap
        scope="https://www.googleapis.com/auth/drive.file"
      />

      {/* Upload Input */}
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
};

export default FileList;
