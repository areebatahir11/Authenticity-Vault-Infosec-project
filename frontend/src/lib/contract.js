import { ethers } from 'ethers'
import abi from '../abi/AuthenticityVault.json'
export const CONTRACT_ADDRESS = '0x8464135c8F25Da09e49BC8782676a84730C318bC'

export const getContract = async () => {
  if (typeof window == 'undefined') return null

  await window.ethereum.request({ method: 'eth_requestAccounts' })
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer)

  return { contract, signer }
}
