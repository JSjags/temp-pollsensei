// import { useMutation } from "@tanstack/react-query";
// import rawAxiosInstance from "./rawAxiosInstance";
// import { fetchUserBalance } from "@/services/api/getUserBalance";

// // type PurchasePayload = {
// //   paymentGateway: "paystack" | "stripe";
// //   currency: "NGN" | "USD";
// //   amount: number;
// //   pollcoins: number;
// //   orderReferenceId: string;
// //   redirect_url: string;
// //   orderSummaryId?:string
// // };
// export type PurchasePayload = {
//   paymentGateway: "paystack" | "stripe";
//   currency: "NGN" | "USD";
//   orderReferenceId: string;
//   redirect_url: string;
//   // Optional fields
//   amount?: number;
//   pollcoins?: number;
//   orderSummaryId?: string;
// };

// type PurchaseResponse = {
//   success: boolean;
//   message: string;
//   data: {
//     purchase: {
//       id: string;
//       amount: number;
//       pollcoins: number;
//       bonusCoins: number;
//       status: string;
//     };
//     payment: {
//       authorization_url?: string; 
//       client_secret?: string;
//       access_code?: string;
//       reference: string;
//     };
//   };
// };
// export const usePollcoinPurchase = () => {
//   return useMutation({
//     mutationFn: async (payload: PurchasePayload) => {
//       const res = await rawAxiosInstance.post<PurchaseResponse>(
//         "/purchases/pollcoins/purchase",
//         {
//           ...payload,
//           amount: Number(payload.amount),
//           pollcoins: Number(payload.pollcoins),
//         }
//       );

//       return res.data;
//     },
//     onSuccess: (data) => {
//       if (data.success) {
//         // Refetch the user balance after a successful purchase
//         fetchUserBalance();
//       }
//     },
//   });
// };


import { useMutation } from "@tanstack/react-query";
import rawAxiosInstance from "./rawAxiosInstance";
import { fetchUserBalance } from "@/services/api/getUserBalance";

export type PurchasePayload = {
  paymentGateway: "paystack" | "stripe";
  currency: "NGN" | "USD";
  orderReferenceId: string;
  redirect_url?: string;
  // Optional fields
  amount?: number;
  pollcoins?: number;
  orderSummaryId?: string;
};

type PurchaseResponse = {
  success: boolean;
  message: string;
  data: {
    purchase: {
      id: string;
      amount: number;
      pollcoins: number;
      bonusCoins: number;
      status: string;
    };
    payment: {
      authorization_url?: string; 
      client_secret?: string;
      access_code?: string;
      reference: string;
    };
  };
};

export const usePollcoinPurchase = () => {
  return useMutation({
    mutationFn: async (payload: PurchasePayload) => {
      let requestPayload: Record<string, any>;
      
      if (payload.paymentGateway === 'stripe') {
        // For Stripe, only include these specific fields
        requestPayload = {
          paymentGateway: payload.paymentGateway,
          currency: payload.currency,
          orderReferenceId: payload.orderReferenceId,
          pollcoins: payload.pollcoins
          // redirect_url: payload.redirect_url,
        };
        
        // Only add orderSummaryId if it exists
        if (payload.orderSummaryId) {
          requestPayload.orderSummaryId = payload.orderSummaryId;
        }
      } else {
        // For other payment gateways (like Paystack), include amount and pollcoins
        requestPayload = {
          paymentGateway: payload.paymentGateway,
          currency: payload.currency,
          orderReferenceId: payload.orderReferenceId,
          redirect_url: payload.redirect_url,
        };
        
        // Add amount and pollcoins if they exist
        if (payload.amount !== undefined) {
          requestPayload.amount = Number(payload.amount);
        }
        
        if (payload.pollcoins !== undefined) {
          requestPayload.pollcoins = Number(payload.pollcoins);
        }
        
        // Add orderSummaryId if it exists
        if (payload.orderSummaryId) {
          requestPayload.orderSummaryId = payload.orderSummaryId;
        }
      }

      const res = await rawAxiosInstance.post<PurchaseResponse>(
        "/purchases/pollcoins/purchase",
        requestPayload
      );

      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        // Refetch the user balance after a successful purchase
        fetchUserBalance();
      }
    },
  });
};