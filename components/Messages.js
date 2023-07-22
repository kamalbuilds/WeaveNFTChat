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
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Button } from "@chakra-ui/react";
import { decryptString } from "@lit-protocol/lit-node-client/src";

const Messages = ({ collection_address }) => {

  const contractTxId = "87ff-LsWUZPUV8oXaEOetybPvEifRjqn1zbzXlNw7CQ";
  const COLLECTION_NAME = "test";
  // default use "messages for testing"
  const { userAddress } = useContext(AppContext);
  console.log( userAddress,'profile')
  const [db, setDb] = useState(null);
  const [initDb, setInitDb] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const [messages, setMessages] = useState([]); // State to store messages
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [decryptedMsg, setDecryptedMsg] = useState("");
  const [nftImages, setNftImages] = useState([]);
  console.log(inputMessage,"ui")
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

  const addMessageToDB = async (msg) => {
    try {
      const lit = new LitJsSdk.LitNodeClient()
      await lit.connect();

      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "polygon",
      })

      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        msg
      )
      console.log(encryptedString ,"encstrung")

      // more examples at: https://developer.litprotocol.com/accessControl/EVM/basicExamples#a-specific-wallet-address
      const accessControlConditions = [
        {
          contractAddress: '',
          standardContractType: '',
          chain: 'polygon',
          method: 'eth_getBalance',
          parameters: [
            ':userAddress',
            'latest'
          ],
          returnValueTest: {
            comparator: '>=',
            value: '10000000000000'
          }
        }
      ]

      const encryptedSymmetricKey = await lit.saveEncryptionKey({
        accessControlConditions,
        authSig,
        chain: "polygon",
        symmetricKey,
      });

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
          collection_address: COLLECTION_NAME,
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
    if (!window.ethereum) {
      alert("Please install or enable a Web3-enabled browser extension like MetaMask.");
      return;
    }
  
    try {
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
          alert("Something went wrong");
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
    } catch (error) {
      console.error("login", error);
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
      await _db.init();
      setDb(_db);
      setInitDb(true);
    } catch (e) {
      console.error("setupWeaveDB", e);
    }
  };
  console.log(db,"db")
  const getMessages = async () => {
    try {
      // const _messages = await db.cget(COLLECTION_NAME);
      const _messages = await db.get(COLLECTION_NAME, ["collection_address"], [ "collection_address", "==", COLLECTION_NAME ]);
      console.log("getMessages", _messages);
      setMessages(_messages);
    } catch (e) {
      console.error(e);
    }
  };

  const decryptMsg = async (docId) => {
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
      setDecryptedMsg((prevDecryptedMsg) => ({
        ...prevDecryptedMsg,
        [docId]: decryptedString,
      }));
      console.log("decryptedString", decryptedMsg)
    } catch (e) {
      console.error("decryptMsg", e)
    }
  }

  const singleDecryptMsg = async (docId) => {
    // retrieve specific document from your collection, then lit protocol will validate your encryption key and accessControlConditions to decrypt the data requested
      await decryptMsg(docId);
  };

  const handledecryptMsg = () => {
    messages?.map((item, index) => {
      decryptMsg(item.id);
    });
  };

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
          {/* Render the login and logout buttons based on the user's login status */}
      {user ? (
        <Flex justify="center" mt="2">
          <Button onClick={logout} colorScheme="red" variant="outline">
            Logout
          </Button>
        </Flex>
      ) : (
        <Flex justify="center" mt="2">
          <Button onClick={login} colorScheme="teal">
            Login
          </Button>
        </Flex>
      )}

      {/* Add the "Decrypt Msg" button */}
      <Flex justify="center" mt="2">
        <Button onClick={handledecryptMsg} colorScheme="blue">
          Decrypt All Msges
        </Button>
      </Flex>
      
      {/*  */}
      <Flex w="100%" h="80%" overflowY="scroll" flexDirection="column" p="3">
        {/* Render decrypted messages */}
          {
          messages.slice().reverse().map((item, index) => {
            const isUserMessage = item.user_address === userAddress.toLowerCase();
            console.log(isUserMessage,userAddress,"lets count")
            const messageStyle = {
              justifyContent: isUserMessage ? "flex-end" : "flex-start",
              alignSelf: isUserMessage ? "flex-end" : "flex-start",
              maxWidth: "350px",
              marginY: "1",
              padding: "3",
              background: isUserMessage ? "black" : "gray.100",
              color: isUserMessage ? "white" : "black",
            };
            const trimmedAddress = `${item.user_address.slice(0, 6)}...${item.user_address.slice(-4)}`;
            return (
              <Flex key={index} w="100%" {...messageStyle}>
                {!isUserMessage && (
                  <Avatar
                    name="Computer"
                    src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                    bg="blue.300"
                  />
                )}
                <Flex flex="1" alignSelf="center" p="3">
                  <Text> By {trimmedAddress}</Text>
                </Flex>

                {/* Conditionally render the "Decrypt Msg" button */}
                {!decryptedMsg[item.id] && (
                      <Flex justify="right" mt="2">
                        <Button onClick={() => singleDecryptMsg(item.id)} colorScheme="blue">
                          Decrypt Msg
                        </Button>
                      </Flex>
                    )}

                {decryptedMsg[item.id] && (
                <Flex flex="1" alignSelf="center" p="3">
                  <Text> {decryptedMsg[item.id]} </Text>
                </Flex>
              )}
              </Flex>
            );
          })
        }
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
