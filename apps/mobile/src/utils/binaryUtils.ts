/**
 * Converts a base64 string to a Uint8Array.
 * Uses a manual implementation if atob is not available (React Native).
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = (typeof atob !== 'undefined') 
    ? atob(base64) 
    : decodeBase64(base64);
    
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts a Uint8Array to a base64 string.
 * Uses a manual implementation if btoa is not available (React Native).
 */
export function uint8ArrayToBase64(array: Uint8Array): string {
  let binary = '';
  const len = array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(array[i]);
  }
  
  return (typeof btoa !== 'undefined') 
    ? btoa(binary) 
    : encodeBase64(binary);
}

// Minimal polyfills for atob/btoa
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function decodeBase64(input: string): string {
  const str = input.replace(/=+$/, '');
  let output = '';
  for (let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      bc++ % 4) ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)))) : 0
  ) {
    buffer = CHARS.indexOf(buffer);
  }
  return output;
}

function encodeBase64(input: string): string {
  const str = input;
  let output = '';
  for (let block = 0, charCode, i = 0, map = CHARS;
    str.charAt(i | 0) || (map = '=', i % 1);
    output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
  ) {
    charCode = str.charCodeAt(i += 3 / 4);
    block = (block << 8) | charCode;
  }
  return output;
}
