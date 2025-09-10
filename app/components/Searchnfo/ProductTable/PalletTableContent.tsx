import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageType, PalletTableContentProps } from "./types";
import PalletTable from "./PalletTable";
import { saveAllPalletsRequest } from "@/app/store/DBWorkSlice";
import Modal from "../../Modal/Modal";
import { MessageContent } from "../../Modal/Messages/types";
import PauseMessagePallet from "../../Modal/Messages/PauseMonitoringMessagePallet";
import DeleteMessage from "../../Modal/Messages/DeleteMessage";
import { printPallet } from "@/app/API/settingsApi";
import useMonitoringDispatch from "@/app/hooks/useMonitoringDispatch";
import useSearchDispatch from "@/app/hooks/useSearchDispatch";
import { RootState } from "@/app/store/store";
import BurgerButtonsPallet from "../../shared/BurgerButtons/BurgerButtonsPallet";

const PalletTableContent: React.FC<PalletTableContentProps> = ({
  allPallets,
  fetchData,
}) => {
  const [selectedPalletNumber, setSelectedPalletNumber] = useState<
    number | null
  >(null);
  const { selectedFileContent } = useSelector(
    (state: RootState) => state.taskJson
  );
  const { isPause, currentPalletNumber } = useSelector(
    (state: RootState) => state.monitoring
  );
  const { pauseMonitoring } = useMonitoringDispatch();
  const { deletePallet } = useSearchDispatch();
  const dispatch = useDispatch();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>(
    MessageType.Delete
  );

  const handleOpenMessageModal = (type: MessageType) => {
    setMessageType(type);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => setIsMessageModalOpen(false);

  useEffect(() => {
    fetchData();
  }, [isPause]);

  const changePalletHandler = (pallet: any) => {
    const { pallet_number } = pallet;
    setSelectedPalletNumber(+pallet_number);
  };

  const printPalletLabel = async (boxNumber: number, countInPallet: string) => {
    await printPallet(boxNumber, +countInPallet);
  };

  const handleLabelPrint = () => {
    if (selectedPalletNumber) {
      const selectedPallet = allPallets.find(
        (pallet) => pallet.pallet_number === selectedPalletNumber
      );
      printPalletLabel(selectedPalletNumber, selectedPallet.box_count);
    }
  };

  const handlePause = async () => {
    await pauseMonitoring();
    handleCloseMessageModal();
  };

  const performDelete = async () => {
    if (selectedPalletNumber) {
      await deletePallet(selectedPalletNumber);
      const newPallets = allPallets.filter(
        (el) => +el.pallet_number !== +selectedPalletNumber
      );
      dispatch(saveAllPalletsRequest(newPallets));
    }
  };

  const handleDeletePallet = () => {
    if (!isPause && currentPalletNumber === selectedPalletNumber) {
      handleOpenMessageModal(MessageType.Pause);
    } else {
      handleOpenMessageModal(MessageType.Delete);
    }
  };

  const deletePalletHandler = async () => {
    await performDelete();
    handleCloseMessageModal();
  };

  const dis = !selectedPalletNumber;

  return (
    <div className="tab-content">
      <Modal isOpen={isMessageModalOpen} onClose={handleCloseMessageModal}>
        {messageType === MessageType.Pause ? (
          <PauseMessagePallet
            pause={handlePause}
            cancel={handleCloseMessageModal}
          />
        ) : (
          <DeleteMessage
            content={MessageContent.Pallet}
            del={deletePalletHandler}
            cancel={handleCloseMessageModal}
          />
        )}
      </Modal>
      <PalletTable
        allPallets={allPallets}
        selectedPalletNumber={selectedPalletNumber}
        onPalletSelect={changePalletHandler}
      />
      <div className="button-group right">
        <BurgerButtonsPallet
          onDelete={handleDeletePallet}
          onPrint={handleLabelPrint}
          selectedPalletNumber={selectedPalletNumber}
        />
        {/* <button
          className={`action-button ${dis && "dis"}`}
          disabled={dis}
          onClick={handleDeletePallet}
        >
          Удалить паллету
        </button>
        <button
          className={`action-button ${
            (!selectedFileContent || !selectedPalletNumber) && "dis"
          }`}
          onClick={handleLabelPrint}
        >
          Печать
        </button> */}
      </div>
    </div>
  );
};

export default PalletTableContent;
