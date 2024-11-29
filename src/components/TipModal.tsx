'use client'

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TipModal({ isOpen, onClose }: TipModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="tip-modal active">
        <h3 className="text-xl font-bold mb-4">문단 나누기 Tips!</h3>
        <ul className="space-y-2">
          <li>✍️ 하나의 문단에는 하나의 중심 생각만 담아요.</li>
          <li>✍️ 새로운 내용이 시작되면 새로운 문단으로 나눠요.</li>
          <li>✍️ 문단의 첫 문장에 중심 내용을 담아요.</li>
          <li>✍️ 보통 3~5문장이 한 문단이 되어요.</li>
          <li>✍️ 들여쓰기로 문단의 시작을 표시해요.</li>
        </ul>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          알겠어요!
        </button>
      </div>
      <div className="modal-overlay active" onClick={onClose}></div>
    </>
  );
}
