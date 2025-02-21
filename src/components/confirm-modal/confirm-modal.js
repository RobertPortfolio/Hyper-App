import React from "react";
import { Modal } from "react-bootstrap";

const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose(); // Закрываем модалку после подтверждения
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton closeVariant='white' className='bg-component border-0'>
        <Modal.Title>{title || "Подтверждение"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-component'>{message || "Вы уверены, что хотите выполнить это действие?"}</Modal.Body>
      <Modal.Footer className='bg-component border-0'>
        <button className="btn-secondary" onClick={onClose}>
          Отмена
        </button>
        <button className="btn-main" onClick={handleConfirm}>
          Подтвердить
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;