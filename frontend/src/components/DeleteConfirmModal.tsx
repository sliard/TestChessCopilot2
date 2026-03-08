interface DeleteConfirmModalProps {
  isOpen: boolean;
  openingName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  openingName,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-label="Confirm deletion">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal__title">Delete Opening</h3>
        <p className="modal__message">
          Are you sure you want to delete <strong>{openingName}</strong>? This action cannot be undone.
        </p>
        <div className="modal__actions">
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
