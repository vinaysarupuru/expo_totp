import CryptoJS from 'crypto-js';

// Helper function to generate HMAC-SHA1 hash
export const generateHMACSHA1 = (secretKey, message) => {
  const hmac = CryptoJS.HmacSHA1(message, secretKey);
  return hmac.toString(CryptoJS.enc.Hex);
};

// Helper function to generate a dynamic truncation (DT) string
export const dynamicTruncation = (hmacHash) => {
  const offset = parseInt(hmacHash.slice(-1), 16);
  const binary = ((parseInt(hmacHash.substr(offset * 2, 8), 16) & 0x7fffffff).toString());
  return binary.slice(-6); // Last 6 digits
};

// Generate HOTP code
export const generateHOTPCode = (secretKey, counter) => {
  const counterHex = counter.toString(16).padStart(16, '0'); // Convert counter to 8-byte hex
  const hmacHash = generateHMACSHA1(secretKey, counterHex);
  const otp = dynamicTruncation(hmacHash);
  return otp.padStart(6, '0'); // Ensure 6 digits
};

// Generate TOTP code
export const generateTOTPCode = (secretKey) => {
  const timeStep = 30; // 30-second time step
  const timestamp = Math.floor(Date.now() / 1000); // Current time in seconds
  const counter = Math.floor(timestamp / timeStep); // Counter based on time step
  return generateHOTPCode(secretKey, counter);
};

// Format code for readability
export const formatCode = (code) => {
  return `${code.substring(0, 3)} ${code.substring(3)}`;
}; 