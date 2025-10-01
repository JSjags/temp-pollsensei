"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/InputEdit";
import { Label } from "@/components/ui/label";
import { BsMegaphone } from "react-icons/bs";
import { Coins } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import { Pollcoin } from "@/assets/images";

interface EchoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEcho: (amount: number) => void;
  isLoading?: boolean;
  userBalance: number;
}

const EchoModal: React.FC<EchoModalProps> = ({
  isOpen,
  onClose,
  onEcho,
  isLoading,
  userBalance,
}) => {
  const [echoAmount, setEchoAmount] = useState<string>("1");
  const [error, setError] = useState<string>("");

  const user = useSelector((state: RootState) => state.user?.user);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setError("");
    if (value === "" || /^\d+$/.test(value)) {
      setEchoAmount(value);

      const amount = parseInt(value);
      if (amount > userBalance) {
        setError(`Insufficient balance. You have ${userBalance} pollcoin(s).`);
      }
    }
  };

  const handleEcho = () => {
    const amount = parseInt(echoAmount);

    if (!amount || amount < 1) {
      setError("Please enter a valid amount (minimum 1 echo).");
      return;
    }

    if (amount > userBalance) {
      setError(`Insufficient balance. You have ${userBalance} pollcoin(s).`);
      return;
    }

    onEcho(amount);
  };

  const handleClose = () => {
    if (!isLoading) {
      setEchoAmount("1");
      setError("");
      onClose();
    }
  };

  const totalCost = parseInt(echoAmount) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BsMegaphone className="w-5 h-5 text-purple-600" />
            Echo this Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-900">
                Your Balance
              </span>
              <div className="flex items-center gap-1">
                <Image src={Pollcoin} alt="icons" className="size-5" />
                <span className="font-bold text-purple-900">
                  {userBalance || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-5">
              <Label htmlFor="echo-amount">Number of Echoes</Label>
              <input
                id="echo-amount"
                type="text"
                value={echoAmount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                disabled={isLoading}
                className={
                  error
                    ? "border-red-500 focus:border-red-500"
                    : "border border-gray-300 focus:border-purple-500 rounded-l-md p-2"
                }
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          {echoAmount && !error && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cost per echo:</span>
                <div className="flex items-center gap-1">
                  <Image src={Pollcoin} alt="icons" className="size-4" />
                  <span>1</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Number of echoes:</span>
                <span>{totalCost}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total cost:</span>
                <div className="flex items-center gap-1">
                  <Image src={Pollcoin} alt="icons" className="size-5" />
                  <span>{totalCost}</span>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p>
              Echoing shows your support for this report and helps boost its
              visibility. Each echo costs 1 pollcoin and 80% of the pollcoin
              goes directly to the report author.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEcho}
            disabled={
              isLoading || !!error || !echoAmount || parseInt(echoAmount) < 1
            }
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Echoing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <BsMegaphone className="w-4 h-4" />
                Echo ({totalCost} pollcoin{totalCost !== 1 ? "s" : ""})
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EchoModal;
