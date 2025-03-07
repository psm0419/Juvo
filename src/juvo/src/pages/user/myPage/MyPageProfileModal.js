import '../../assets/css/user/myPage/MyPageProfileModal.css';

function MyPageModal({ isOpen, onClose, title, children, onSubmit }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">{title}</h2>
                {children}
                <div className="modal-buttons">
                    <button className="modal-submit-btn" onClick={onSubmit}>
                        확인
                    </button>
                    <button className="modal-cancel-btn" onClick={onClose}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MyPageModal;