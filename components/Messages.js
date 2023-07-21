import React, { useContext, useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import SDK from "weavedb-sdk";
import { isNil } from "ramda";
import { ethers } from "ethers";
import lf from "localforage";
import { AppContext } from "../context";
import { Avatar } from "@chakra-ui/react";
import Divider from "../components/Divider";
import Footer from "../components/Footer";
import LitJsSdk from "@lit-protocol/lit-js-sdk";

const Messages = ({ collection_name }) => {
  const contractTxId = "87ff-LsWUZPUV8oXaEOetybPvEifRjqn1zbzXlNw7CQ";
  const COLLECTION_NAME = "messages";
  const { userAddress } = useContext(AppContext);
  console.log( userAddress,'profile')
  const [db, setDb] = useState(null);
  const [initDb, setInitDb] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const [messages, setMessages] = useState([]); // State to store messages

  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (!inputMessage.trim().length) {
      return;
    }

    try {
      // Add the message to the database
      await addMessageToDB(inputMessage);

      // Clear the input field after sending the message
      setInputMessage("");
    } catch (error) {
      console.error("handleSendMessage", error);
    }
  };


  // Function to check if the user is logged in
  const checkUser = async () => {
    const wallet_address = await lf.getItem(`temp_address:current`);
    if (!isNil(wallet_address)) {
      const identity = await lf.getItem(
        `temp_address:${contractTxId}:${wallet_address}`
      );
      if (!isNil(identity)) {
        setUser({
          wallet: wallet_address,
          privateKey: identity.privateKey,
        });
      }
    }
  };

  const addMessageToDB = async () => {
    try {
      const lit = new LitJsSdk.LitNodeClient()
      await lit.connect()

      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "polygon",
      })

      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        msg
      )

      // more examples at: https://developer.litprotocol.com/accessControl/EVM/basicExamples#a-specific-wallet-address
      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: user.wallet,
          },
        },
      ]

      const encryptedSymmetricKey = await lit.saveEncryptionKey({
        accessControlConditions,
        authSig,
        chain: "polygon",
        symmetricKey,
      })
      const blobToDataURI = (blob) => {
        return new Promise((resolve, reject) => {
          var reader = new FileReader()

          reader.onload = (e) => {
            var data = e.target.result
            resolve(data)
          }
          reader.readAsDataURL(blob)
        })
      }
      const encryptedData = await blobToDataURI(encryptedString)

      // store encryption info in weavedb
      const tx = await db.add(
        {
          date: db.ts(),
          user_address: db.signer(),
          encryptedData: encryptedData,
          encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
            encryptedSymmetricKey,
            "base16"
          ),
          accessControlConditions: accessControlConditions,
        },
        COLLECTION_NAME,
        user
      )
      console.log("tx", tx)

      console.log("result", await tx.getResult())
      getMessages()
    } catch (e) {
      console.error("addMsg", e)
    }
  }


  // Function to log in the user
  const login = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = await provider.getSigner();
    await provider.send("eth_requestAccounts", []);
    const wallet_address = await signer.getAddress();
    let identity = await lf.getItem(
      `temp_address:${contractTxId}:${wallet_address}`
    );

    let tx;
    let err;
    if (isNil(identity)) {
      ({ tx, identity, err } = await db.createTempAddress(wallet_address));
      const linked = await db.getAddressLink(identity.address);
      if (isNil(linked)) {
        alert("something went wrong");
        return;
      }
    } else {
      await lf.setItem("temp_address:current", wallet_address);

      setUser({
        wallet: wallet_address,
        privateKey: identity.privateKey,
      });
      return;
    }
    if (!isNil(tx) && isNil(tx.err)) {
      identity.tx = tx;
      identity.linked_address = wallet_address;
      await lf.setItem("temp_address:current", wallet_address);
      await lf.setItem(
        `temp_address:${contractTxId}:${wallet_address}`,
        JSON.parse(JSON.stringify(identity))
      );
      setUser({
        wallet: wallet_address,
        privateKey: identity.privateKey,
      });
    }
  };

  // Function to log out the user
  const logout = async () => {
    await lf.removeItem("temp_address:current");
    setUser(null); // Clear the user state
    console.log("<<logout()");
  };

  const setupWeaveDB = async () => {
    try {
      const _db = new SDK({
        contractTxId: contractTxId,
      });
      console.log(_db)
      await _db.init();
      setDb(_db);
      setInitDb(true);
    } catch (e) {
      console.error("setupWeaveDB", e);
    }
  };

  const getMessages = async () => {
    try {
      const _messages = await db.cget(COLLECTION_NAME);
      console.log("getMessages", _messages);
      setMessages(_messages);
    } catch (e) {
      console.error(e);
    }
  };

  const decryptMsg = async () => {
    // retrieve specific document from your collection, then lit protocol will validate your encryption key and accessControlConditions to decrypt the data requested

    try {
      const document = await db.get(COLLECTION_NAME, docId)
      console.log("document", document)

      const lit = new LitJsSdk.LitNodeClient()
      await lit.connect()

      const { encryptedData, encryptedSymmetricKey, accessControlConditions } =
        document

      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "polygon",
      })

      const symmetricKey = await lit.getEncryptionKey({
        accessControlConditions,
        toDecrypt: encryptedSymmetricKey,
        chain: "polygon",
        authSig,
      })

      const dataURItoBlob = (dataURI) => {
        var byteString = window.atob(dataURI.split(",")[1])
        var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
        var ab = new ArrayBuffer(byteString.length)
        var ia = new Uint8Array(ab)
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i)
        }

        var blob = new Blob([ab], { type: mimeString })

        return blob
      }

      const decryptedString = await LitJsSdk.decryptString(
        dataURItoBlob(encryptedData),
        symmetricKey
      )
      console.log("decryptedString", decryptedString)
      setDecryptedMsg(decryptedString)
    } catch (e) {
      console.error("decryptMsg", e)
    }
  }

  console.log(messages,'f')
  useEffect(() => {
    checkUser();
    console.log(user,'user') 
    setupWeaveDB();
  }, []);

  useEffect(() => {
    if (initDb) {
      getMessages();
    }
  }, [initDb]);

  return (
    <>
    <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
      {messages.map((item, index) => {
        const isUserMessage = item.data.user_address === userAddress;
        const messageStyle = {
          justifyContent: isUserMessage ? "flex-end" : "flex-start",
          alignSelf: isUserMessage ? "flex-end" : "flex-start",
          maxWidth: "350px",
          marginY: "1",
          padding: "3",
          background: isUserMessage ? "black" : "gray.100",
          color: isUserMessage ? "white" : "black",
        };

        return (
          <Flex key={index} w="100%" {...messageStyle}>
            {!isUserMessage && (
              <Avatar
                name="Computer"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="blue.300"
              />
            )}
            <Flex
              flex="1"
              alignSelf="center"
              p="2"
            >
              <Text>{item.data.date} by {item.data.user_address}</Text>
            </Flex>
          </Flex>
        );
      })}
    </Flex>
    <Divider />
    <Footer
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      handleSendMessage={handleSendMessage}
    />
    </>
  );
};

export default Messages;
