import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import Header from "../../components/Header";
import Messages from "../../components/Messages";
import { useRouter } from "next/router";

const Group = () => {
  const router = useRouter();
  const { address , topic } = router.query;

  return (
      <Flex w="100%" h="100%">
        <Flex w={["100%", "100%", "100%"]} h="100%" flexDir="column">
          <h1 className="text-center text-2xl my-8 text-white ">Agenda: {topic} </h1>
          <Header />
          <Divider />
          <Messages  collection_name={address}  />
        </Flex>
      </Flex>
  );
};

export default Group;
