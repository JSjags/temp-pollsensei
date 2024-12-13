import { showModal } from "@/redux/slices/modal.slice";
import { useDispatch } from "react-redux";

const useUpgradeModal = () => {
  const dispatch = useDispatch();

  const triggerUpgradeModal = (feature: string) => {
    dispatch(showModal(feature));
  };

  return triggerUpgradeModal;
};

export default useUpgradeModal;
