import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import ModalCancel from "components/Icons/ModalCancelIcon";

Modal.setAppElement("#root-modal");

export default function ReactModal({
  isModalVisible,
  handleCancel,
  modalTitle,
  modalBody,
  modalFooter,
  customStyles = {},
}) {
  return (
    <Modal
      isOpen={isModalVisible}
      onRequestClose={handleCancel}
      style={customStyles}
      className="ant-modal reservation-modal"
    >
      <div className="ant-modal-content">
        <ModalCancel Close={handleCancel} />
        <div className="ant-modal-header">
          <div className="ant-modal-title" id="rcDialogTitle0">
            {modalTitle}
          </div>
        </div>
        <div className="ant-modal-body">{modalBody}</div>
        <div className="ant-modal-footer">{modalFooter}</div>
      </div>
    </Modal>
  );
}

ReactModal.propTypes = {
  isModalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  modalTitle: PropTypes.string,
  modalBody: PropTypes.any,
  modalFooter: PropTypes.any,
  customStyles: PropTypes.object,
};
