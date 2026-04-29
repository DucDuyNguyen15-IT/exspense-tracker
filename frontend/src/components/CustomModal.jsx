import React from "react";
import { useAppContext } from "../context/AppContext";

export default function CustomModal() {
  const { modal, closeModal, t } = useAppContext();

  if (!modal.isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          textAlign: "center",
          animation: "modalFadeIn 0.3s ease-out"
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          {modal.type === "confirm" ? "❓" : "ℹ️"}
        </div>
        
        <h3 style={{ color: "var(--text)", marginBottom: "0.8rem", fontSize: "1.3rem" }}>
          {modal.title || (modal.type === "confirm" ? t("Xác nhận") : t("Thông báo"))}
        </h3>
        
        <p style={{ color: "var(--dim)", marginBottom: "2rem", lineHeight: "1.6" }}>
          {modal.message}
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {modal.type === "confirm" && (
            <button 
              onClick={closeModal}
              style={{
                padding: "0.8rem 1.5rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "var(--surface2)"}
              onMouseOut={(e) => e.target.style.background = "transparent"}
            >
              {t("Hủy")}
            </button>
          )}
          
          <button 
            onClick={() => {
              if (modal.onConfirm) modal.onConfirm();
              closeModal();
            }}
            style={{
              padding: "0.8rem 2rem",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, var(--indigo), #818cf8)",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
          >
            {modal.type === "confirm" ? t("Đồng ý") : "OK"}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  );
}
