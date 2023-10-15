import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ModalComponent = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    props.setConfirmThirdOption("")
    props.doTransaction();
  };

  const handleCancel = () => {
    props.setConfirmThirdOption("")
    props.closeModal();
  };
  console.log(props.transaction)

  return (
    <>
      <Modal 
        title="Please confirm the below transactions!" 
        open={props.isModalOpen} 
        onOk={handleOk} 
        onCancel={() => props.closeModal()}
        footer={[
          <>
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
            <Button key="submit" type="primary" onClick={handleOk}>
              Ok
            </Button>
            {props.footerThirdOption.length !== 0 && 
            <Button key="back" onClick={handleCancel}>
              {props.footerThirdOption}
            </Button>
            }
          </>
        ]}
      >
        <h3>{props.intentContext}</h3>
         {/* {props.transaction && props.transaction.map(txn => {
            return (
                <p>
                    {JSON.stringify(txn)}
                </p>
            )
         })} */}
      </Modal>
    </>
  );
};
export default ModalComponent;