import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">개인정보처리방침</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-gray-600 py-4">
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">1. 수집하는 개인정보 항목</h2>
            <p>Ankimozzi는 Google 로그인을 통해 다음과 같은 정보를 수집합니다:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>이메일 주소</li>
              <li>이름</li>
              <li>프로필 사진 (선택적)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">2. 개인정보의 수집 및 이용목적</h2>
            <ul className="list-disc ml-6">
              <li>서비스 제공을 위한 계정 식별 및 인증</li>
              <li>서비스 이용 기록 저장</li>
              <li>서비스 관련 공지사항 전달</li>
            </ul>
          </section>

          {/* ... 나머지 섹션들 ... */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
