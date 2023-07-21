import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Messages from "../../components/Messages";
import { useRouter } from "next/router";

const Group = () => {
  const router = useRouter();
  const { address } = router.query;

  const [messages, setMessages] = useState([
    { from: "computer", text: "Hi, My Name is Bot" },
    { from: "me", text: "Hey there" },
    { from: "me", text: "Myself Kamal Singh" },
    {
      from: "computer",
      text:
        "Nice to meet you. You can send me message and i'll reply you with same message."
    }
  ]);

  return (
      <Flex w="100%" h="100%">
        <Flex w={["100%", "100%", "100%"]} h="100%" flexDir="column">
          <Header />
          <Divider />
          <Messages  collection_name={address}/>
        </Flex>
      </Flex>
  );
};

export default Group;
