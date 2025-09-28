import { useTokenStore } from "../stores/useTokenStore";

interface ExpertVerifyData {
    certification?: string;
    portfolio_url?: string;
    certification_file?: File;
}

export const expertVerify = async (verificationData: ExpertVerifyData) => {
    try {
        const { accessToken } = useTokenStore.getState(
            (state) => ({ accessToken: state.accessToken })
        );
        
        if (!accessToken) {
            throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
        }
        
        // 이미지 파일이 있는 경우 FormData 사용, 없으면 JSON 사용
        let body: FormData | string;
        let contentType: string | undefined;
        
        if (verificationData.certification_file) {
            // 파일이 있는 경우 FormData 사용
            const formData = new FormData();
            formData.append('certification_file', verificationData.certification_file);
            if (verificationData.certification) {
                formData.append('certification', verificationData.certification);
            }
            if (verificationData.portfolio_url) {
                formData.append('portfolio_url', verificationData.portfolio_url);
            }
            body = formData;
            // FormData 사용 시 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
        } else {
            // 파일이 없는 경우 JSON 사용
            body = JSON.stringify({
                certification: verificationData.certification,
                portfolio_url: verificationData.portfolio_url,
            });
            contentType = 'application/json';
        }
        
        const headers: Record<string, string> = {
            'Authorization': `Bearer ${accessToken}`,
        };
        
        if (contentType) {
            headers['Content-Type'] = contentType;
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/expert-verify`, {
            method: 'POST',
            headers,
            body,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("전문가 인증 API 에러 응답:", errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("전문가 인증 API 성공 응답:", result);
        
        return result;
    } catch (error) {
        console.error('전문가 인증 실패:', error);
        throw error;
    }
};