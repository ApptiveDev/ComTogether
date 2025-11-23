import {
  useCertificationGetAll,
  useCertificationApprove,
  useCertificationReject,
  useCertificationDelete,
} from "@/api/Certification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTokenStore } from "@/stores/useTokenStore";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Admin() {
  const [rejectReason, setRejectReason] = useState<{ [key: number]: string }>(
    {}
  );
  const navigate = useNavigate();
  const { clearTokens } = useTokenStore();
  const { clearUser, setAuthenticated } = useAuthStore();

  const { data: certifications, isLoading } = useCertificationGetAll();

  const { mutate: approve } = useCertificationApprove({
    onSuccess: () => {
      alert("승인되었습니다.");
    },
    onError: () => {
      alert("승인에 실패했습니다.");
    },
  });

  const { mutate: reject } = useCertificationReject({
    onSuccess: () => {
      alert("거절되었습니다.");
      setRejectReason({});
    },
    onError: () => {
      alert("거절에 실패했습니다.");
    },
  });

  const handleApprove = (certId: number) => {
    if (confirm("이 인증을 승인하시겠습니까?")) {
      approve({ certId });
    }
  };

  const handleReject = (certId: number) => {
    const reason = rejectReason[certId];
    if (!reason?.trim()) {
      alert("거절 사유를 입력해주세요.");
      return;
    }
    if (confirm("이 인증을 거절하시겠습니까?")) {
      reject({ certId, reason });
    }
  };

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      clearTokens();
      clearUser();
      setAuthenticated(false);
      navigate("/signIn");
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>관리자 페이지</h1>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ margin: 0 }}>관리자 페이지 - 전문가 인증 관리</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          로그아웃
        </button>
      </div>

      {!certifications || certifications.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          인증 요청이 없습니다.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {certifications.map((cert) => (
            <div
              key={cert.cert_id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "20px",
                backgroundColor:
                  cert.status === "PENDING"
                    ? "#fff9f0"
                    : cert.status === "APPROVED"
                    ? "#f0fff4"
                    : "#fff0f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>인증 ID:</strong> {cert.cert_id}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>사용자 ID:</strong> {cert.user_id}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>상태:</strong>{" "}
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "4px",
                        backgroundColor:
                          cert.status === "PENDING"
                            ? "#ff8c42"
                            : cert.status === "APPROVED"
                            ? "#28a745"
                            : "#dc3545",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {cert.status === "PENDING"
                        ? "대기 중"
                        : cert.status === "APPROVED"
                        ? "승인됨"
                        : "거절됨"}
                    </span>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <strong>요청일:</strong>{" "}
                    {new Date(cert.requested_at).toLocaleString("ko-KR")}
                  </div>
                  {cert.reason && (
                    <div style={{ marginBottom: "10px", color: "#dc3545" }}>
                      <strong>거절 사유:</strong> {cert.reason}
                    </div>
                  )}
                  <div style={{ marginBottom: "10px" }}>
                    <strong>파일:</strong>{" "}
                    <a
                      href={cert.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      인증서 보기
                    </a>
                  </div>
                </div>

                {cert.status === "PENDING" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      minWidth: "300px",
                    }}
                  >
                    <button
                      onClick={() => handleApprove(cert.cert_id)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      승인
                    </button>
                    <input
                      type="text"
                      placeholder="거절 사유 입력"
                      value={rejectReason[cert.cert_id] || ""}
                      onChange={(e) =>
                        setRejectReason({
                          ...rejectReason,
                          [cert.cert_id]: e.target.value,
                        })
                      }
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                      }}
                    />
                    <button
                      onClick={() => handleReject(cert.cert_id)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
