import SDK_NODE from "weavedb-sdk-node"
import { Contract, ethers } from "ethers"
import abi from "@/abi/NFT.json"
const provider = new ethers.JsonRpcProvider(process.env.EVM_RPC_URL)
const contractTxId = process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID
const nftContractAddr = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS

export default async function handler(req, res) {
  try {
    const params = JSON.parse(req.body)
    const tokenID = params.query[0].tokenID
    const owner = await new Contract(nftContractAddr, abi, provider).ownerOf(
      tokenID
    )

    const sdk = new SDK_NODE({
      contractTxId,
    })
    await sdk.init()

    const tx = await sdk.relay(params.jobID, params, owner, {
      jobID: params.jobID,
      privateKey: process.env.RELAYER_PRIVATEKEY,
    })
    const result = await tx.getResult()
    res.status(200).json({ success: true, result })
  } catch (error) {
    res.status(200).json({
      success: false,
      error,
    })
  }
}
