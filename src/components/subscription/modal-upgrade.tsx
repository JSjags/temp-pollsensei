import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { RootState } from "@/redux/store";
import { hideModal } from "@/redux/slices/modal.slice";
import Modal from "./modal";

const UpgradeModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, feature } = useSelector(
    (state: RootState) => state.upgradeModal
  );

  const handleUpgrade = () => {
    // Implement the logic to redirect to the subscription page
    console.log("Redirecting to subscription page...");
    dispatch(hideModal());
  };

  return (
    <Modal isOpen={isOpen}>
      <div className="p-6 text-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Star className="mx-auto text-yellow-400" size={48} />
        </motion.div>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-2xl font-bold text-gray-900"
        >
          Upgrade Your Plan
        </motion.h2>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-sm text-gray-500"
        >
          To access the {feature} feature, you need to upgrade your current
          plan.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 space-y-3"
        >
          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Upgrade Now
            <ArrowRight className="ml-2" size={16} />
          </Button>
          <Button
            variant="outline"
            onClick={() => dispatch(hideModal())}
            className="w-full"
          >
            Maybe Later
          </Button>
        </motion.div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xs text-gray-400"
        >
          Upgrade now and unlock all premium features!
        </motion.p>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
