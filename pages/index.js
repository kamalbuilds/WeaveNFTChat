import SDK from "weavedb-sdk"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import {
  reverse,
  compose,
  sortBy,
  values,
  assoc,
  map,
  indexBy,
  prop,
} from "ramda"
import { Button, Box, Flex, Input, ChakraProvider } from "@chakra-ui/react"

export default function Home() {
  const nftContractAddr = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
  const contractTxId = process.env.NEXT_PUBLIC_WEAVEDB_CONTRACT_TX_ID
  const explorerBaseUrl = "https://mumbai.polygonscan.com/token/"
  const explorerLink = `${explorerBaseUrl}${nftContractAddr}#writeContract`
  const sonarLink = `https://sonar.warp.cc/?#/app/contract/${contractTxId}`
  const [db, setDb] = useState(null)
  const [initDB, setInitDB] = useState(false)

  const [nfts, setNFTs] = useState([])
  const [posting, setPosting] = useState(false)

  const setupWeaveDB = async () => {
    const _db = new SDK({
      contractTxId,
    })
    await _db.init()
    setDb(_db)
    setInitDB(true)
  }

  const getNFTs = async () => {
    const _nfts = await db.get("nft", ["tokenID", "desc"])
    setNFTs(_nfts)
  }

  useEffect(() => {
    setupWeaveDB()
  }, [])

  useEffect(() => {
    if (initDB) {
      getNFTs()
    }
  }, [initDB])

  const Header = () => (
    <Flex justify="center" width="500px" p={3}>
      <Box flex={1}>
        {posting
          ? "posting..."
          : "Mint NFT and post a Message with your tokenID!"}
      </Box>
      <Box
        as="a"
        target="_blank"
        sx={{ textDecoration: "underline" }}
        href={explorerLink}
      >
        mint
      </Box>
    </Flex>
  )

  const Footer = () => (
    <Flex justify="center" width="500px" p={3}>
      <Box
        as="a"
        target="_blank"
        sx={{ textDecoration: "underline" }}
        href={sonarLink}
      >
        Contract Transactions
      </Box>
    </Flex>
  )

  const Post = () => {
    const [message, setMessage] = useState("")
    const [tokenID, setTokenID] = useState("")
    return (
      <Flex justify="center" width="500px" mb={5}>
        <Input
          disabled={posting}
          w="100px"
          placeholder="tokenID"
          sx={{ borderRadius: "3px 0 0 3px" }}
          value={tokenID}
          onChange={(e) => {
            if (!Number.isNaN(+e.target.value)) {
              setTokenID(e.target.value)
            }
          }}
        />
        <Input
          disabled={posting}
          flex={1}
          placeholder="Message"
          sx={{ borderRadius: "0" }}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
          }}
        />
        <Button
          sx={{ borderRadius: "0 3px 3px 0" }}
          onClick={async () => {
            if (!posting) {
              if (tokenID === "") {
                alert("enter your tokenID")
                return
              }
              if (/^\s*$/.test(message)) {
                alert("enter message")
                return
              }
              setPosting(true)
              try {
                const provider = new ethers.BrowserProvider(
                  window.ethereum,
                  "any"
                )
                const signer = await provider.getSigner()
                await provider.send("eth_requestAccounts", [])
                const wallet_address = await signer.getAddress()

                const params = await db.sign(
                  "set",
                  { tokenID: Number(tokenID), text: message },
                  "nft",
                  tokenID,
                  {
                    wallet: wallet_address,
                    jobID: "nft",
                  }
                )

                const response = await fetch("/api/ownerOf", {
                  method: "POST",
                  body: JSON.stringify(params),
                })
                const responseJson = await response.json()
                console.log("responseJson", responseJson)

                const { error, result } = responseJson
                if (error) {
                  throw new Error(error)
                }

                setMessage("")
                setTokenID("")
                setNFTs(
                  compose(
                    reverse,
                    sortBy(prop("tokenID")),
                    values,
                    assoc(result.docID, result.doc),
                    indexBy(prop("tokenID"))
                  )(nfts)
                )
              } catch (e) {
                console.error(e)
                alert("something went wrong")
              }
              setPosting(false)
            }
          }}
        >
          Post
        </Button>
      </Flex>
    )
  }

  const Messages = () => (
    <Box>
      <Flex bg="#EDF2F7" w="500px">
        <Flex justify="center" p={2} w="75px">
          tokenID
        </Flex>
        <Flex justify="center" p={2} w="100px">
          Owner
        </Flex>
        <Box p={2} flex={1}>
          Message
        </Box>
      </Flex>
      {map((v) => (
        <Flex
          sx={{ ":hover": { bg: "#EDF2F7" } }}
          w="500px"
          as="a"
          target="_blank"
          href={`${explorerBaseUrl}${nftContractAddr}?a=${v.owner}`}
        >
          <Flex justify="center" p={2} w="75px">
            {v.tokenID}
          </Flex>
          <Flex justify="center" p={2} w="100px">
            {v.owner.slice(0, 5)}...{v.owner.slice(-3)}
          </Flex>
          <Box p={2} flex={1}>
            {v.text}
          </Box>
        </Flex>
      ))(nfts)}
    </Box>
  )

  return (
    <ChakraProvider>
      <Flex direction="column" align="center" fontSize="12px">
        <Header />
        <Post />
        <Messages />
        <Footer />
      </Flex>
    </ChakraProvider>
  )
}
