import CryptoJS from "crypto-js";

const secret = "8gBm/:&EnhH.1/q";

export const generateEsewaSignature = (params: {
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
}) => {
  const hashString = `total_amount=${params.total_amount},transaction_uuid=${params.transaction_uuid},product_code=${params.product_code}`;
  const hash = CryptoJS.HmacSHA256(hashString, secret);
  return CryptoJS.enc.Base64.stringify(hash);
};
