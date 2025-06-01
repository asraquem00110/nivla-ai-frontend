import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string | number;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, width }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          minWidth: 500,
          maxWidth: 1500,
          ...(width ? { width } : {}),
          padding: 24,
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'transparent',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
