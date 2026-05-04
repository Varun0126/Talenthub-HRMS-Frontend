import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { employeeAPI } from "../api/api";

function EmployeeDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef();

  const fetchDocs = () => {
    employeeAPI
      .getDocuments()
      .then((res) => setDocuments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMsg("");
    try {
      await employeeAPI.uploadDocument(file);
      setMsg("Document uploaded successfully!");
      fetchDocs();
    } catch (err) {
      setMsg(err.response?.data || "Failed to upload document");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes("pdf")) return "📄";
    if (type?.includes("image")) return "🖼️";
    if (type?.includes("word") || type?.includes("doc")) return "📝";
    if (type?.includes("sheet") || type?.includes("excel") || type?.includes("csv")) return "📊";
    return "📎";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Documents</h1>
        <label className="btn-primary cursor-pointer">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {uploading ? "Uploading..." : "Upload Document"}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
            ref={fileRef}
            disabled={uploading}
          />
        </label>
      </div>

      {msg && (
        <div
          className={`mb-6 p-3 rounded-xl text-sm ${String(msg).includes("success")
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
        >
          {String(msg)}
        </div>
      )}


      {documents.length === 0 ? (
        <div className="section-card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-slate-500">No documents uploaded</p>
          <p className="text-slate-600 text-sm mt-1">Upload your first document above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="glass-card p-5 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{getFileIcon(doc.fileType)}</div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white truncate" title={doc.fileName}>
                    {doc.fileName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{doc.fileType || "Unknown type"}</p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{doc.filePath}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default EmployeeDocuments;
