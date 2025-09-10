/**
 * 
 * @param {string} text 
 */
export default function copy (text) {
navigator.clipboard.writeText(text);
}