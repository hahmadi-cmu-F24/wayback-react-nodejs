interface PopupProps {
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Popup({
  message,
  onClose,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}: PopupProps) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup-message">{message}</div>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 10 }}>
          {onConfirm && onCancel ? (
            <>
              <button onClick={onConfirm}>{confirmText}</button>
              <button onClick={onCancel}>{cancelText}</button>
            </>
          ) : (
            <button onClick={onClose}>{confirmText}</button>
          )}
        </div>
      </div>
    </div>
  );
}
