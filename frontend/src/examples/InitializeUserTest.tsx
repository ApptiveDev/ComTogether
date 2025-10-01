import React, { useState } from "react";
import { initializeUser } from "../api/userSetting/initializeUser";

function InitializeUserTest() {
  const [role, setRole] = useState<"BEGINNER" | "EXPERT">("BEGINNER");
  const [interestIds, setInterestIds] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customInterests, setCustomInterests] = useState<string[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await initializeUser({
        role,
        interest_ids: interestIds,
        custom_interests: customInterests,
      });
      setResult(res);
    } catch (err: any) {
      setError(err.message || "에러 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>InitializeUser API 테스트</h2>
      <div>
        <label>
          레벨:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "BEGINNER" | "EXPERT")}
          >
            <option value="BEGINNER">BEGINNER</option>
            <option value="EXPERT">EXPERT</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          관심사 ID (쉼표로 구분):
          <input
            type="text"
            value={interestIds.join(",")}
            onChange={(e) =>
              setInterestIds(
                e.target.value
                  .split(",")
                  .map((s) => Number(s.trim()))
                  .filter((n) => !isNaN(n))
              )
            }
          />
        </label>
      </div>
      <div>
        <label>
          맞춤 관심사 (쉼표로 구분):
          <input
            type="text"
            value={customInterests.join(",")}
            onChange={(e) =>
              setCustomInterests(e.target.value.split(",").map((s) => s.trim()))
            }
          />
        </label>
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "전송 중..." : "API 테스트"}
      </button>
      {error && <div style={{ color: "red" }}>에러: {error}</div>}
      {result && (
        <pre style={{ background: "#eee", padding: 10 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default InitializeUserTest;
