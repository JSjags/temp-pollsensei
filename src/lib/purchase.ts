// // lib/api/purchase.ts
// export async function purchasePollcoins({ amount }: { amount: number }) {
//     const res = await fetch("/api/v1/purchases/pollcoins/purchase", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ amount }),
//     });

import axiosInstance from "./axios-instance";
import axiosInstanceWithoutToken from "./axios-instance-without-token";

  
//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message || "Failed to initiate purchase");
//     }
  
//     return res.json();
//   }
  // lib/api/purchase.ts


export async function purchasePollcoins({ amount }: { amount: number }) {
  const response = await axiosInstanceWithoutToken.post("/purchases/pollcoins/purchase", {
    amount,
  });

  // axios interceptor already unwraps .data
  return response;
}
