import { notifySuccess } from '../utils/notify'

/**
 * 
 * @param {string} text 
 */
export default function copy (text) {
    navigator.clipboard.writeText(text);
    notifySuccess("Copy made with success!");
}