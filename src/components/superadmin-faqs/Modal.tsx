import { X } from "lucide-react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  size?: string;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children, size="w-80" }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`bg-white rounded-lg shadow-lg p-4  ${size}`}>
        <div className="flex justify-end">
          <button className="text-red-600 text-sm mt-4" onClick={onClose}>
           <X/>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
