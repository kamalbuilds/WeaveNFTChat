import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import Divider from "../../components/Divider";
import Header from "../../components/Header";
import Messages from "../../components/Messages";
import { useRouter } from "next/router";

const Group = () => {
  const router = useRouter();
  const { address } = router.query;

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
