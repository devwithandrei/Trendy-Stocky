"use client";

import { MouseEventHandler, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface BuyNowButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  isBuying: boolean;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({ onClick, isBuying }) => {
  return (
    <button
      onClick={onClick}
      disabled={isBuying}
      className={`px-3 py-1 bg-blue-500 text-white rounded-md focus:outline-none ${
        isBuying ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {isBuying ? "Processing..." : "Buy Now"}
    </button>
  );
};

export default BuyNowButton;