import { ethers } from 'ethers'
import abi from '../abi/AuthenticityVault.json'
export const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export const getContract = async () => {
  if (typeof window == 'undefined') return null

  await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer)
}
