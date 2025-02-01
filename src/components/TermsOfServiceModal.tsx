import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfServiceModal = ({ isOpen, onClose }: TermsOfServiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            서비스 이용약관
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-gray-600 py-4">
          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              제1조 (목적)
            </h2>
            <p>
              이 약관은 Ankimozzi(이하 "회사")가 제공하는 서비스의 이용조건 및
              절차, 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로
              합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              제2조 (용어의 정의)
            </h2>
            <ul className="list-disc ml-6">
              <li>회원: 회사와 서비스 이용계약을 체결한 자</li>
              <li>
                아이디(ID): 회원 식별과 회원의 서비스 이용을 위해 사용되는
                이메일 주소
              </li>
              <li>콘텐츠: 회원이 서비스 내에서 생성한 모든 형태의 데이터</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              제3조 (서비스의 제공)
            </h2>
            <p>회사는 다음과 같은 서비스를 제공합니다:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>동영상 자료의 학습 자료 변환 서비스</li>
              <li>학습 자료 관리 및 공유 기능</li>
              <li>기타 회사가 정하는 서비스</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              제4조 (서비스 이용)
            </h2>
            <p>
              서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한
              연중무휴, 1일 24시간 운영을 원칙으로 합니다. 단, 회사는 서비스의
              운영상 필요한 경우 예고 후 서비스를 일시 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              제5조 (회원의 의무)
            </h2>
            <ul className="list-disc ml-6">
              <li>회원은 관계법령 및 이 약관의 규정을 준수해야 합니다.</li>
              <li>
                회원은 공공질서나 미풍양속을 해치는 행위를 하지 않아야 합니다.
              </li>
              <li>회원은 타인의 지적재산권을 침해하지 않아야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              제6조 (책임제한)
            </h2>
            <p>
              회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를
              제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 text-gray-900">
              제7조 (약관의 변경)
            </h2>
            <p>
              회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스
              내 공지사항을 통해 공지합니다. 변경된 약관은 공지 후 7일이 경과한
              날부터 효력이 발생합니다.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfServiceModal;
