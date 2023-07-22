import { useState } from "react";
import {
  Box,
  Flex,
  Grid,
  HStack,
  Image,
  Link as ChakraLink,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  theme,
  useColorModeValue,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { Connect } from "../components/webmax/Connect";
// import logo from "./logo.png";
import { SendTransaction } from "../components/webmax/SendTransaction";
import { SignTransaction } from "../components/webmax/SignTransaction";

const links = {
  github: "https://github.com/InternetMaximalism/webmax.js",
  intmaxWallet: "https://www.intmaxwallet.io/",
};

export default function App () {
  const [tabIndex, setTabIndex] = useState(0);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Function to handle tab changes
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const handleConnectModalOpen = () => {
    setIsConnectModalOpen(true);
  };

  const handleConnectModalClose = () => {
    setIsConnectModalOpen(false);
  };

  return (
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <Flex flexDirection="column">
            <VStack pb={8} spacing={6}>
              <Text as="h1">
                <Text
                  as="span"
                  color={useColorModeValue("purple.400", "purple.700")}
                  display="inline-block"
                  fontFamily="Lexend"
                  fontWeight="extrabold"
                  pr={3}
                >
                  Powered by IntMax
                </Text>
              </Text>
              <HStack spacing={10}>
                <ChakraLink isExternal href={links.github}>
                  <Box h="2rem" w="2rem">
                    {/* <Image src={logo.src} alt="logo" /> */}
                  </Box>
                </ChakraLink>
              </HStack>
              <Text className="text-white text-4xl">Send Transactions Walletless</Text>
            </VStack>
            <Button onClick={handleConnectModalOpen}>Connect</Button>
            <Tabs variant="soft-rounded" index={tabIndex} onChange={handleTabsChange} className="my-4">
              <TabList justifyContent="center" flexWrap="wrap">
                <Tab p={{ base: 4, sm: "auto" }}>Sign Transaction</Tab>
                <Tab p={{ base: 4, sm: "auto" }}>Send Transaction</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SignTransaction />
                </TabPanel>
                <TabPanel>
                  <SendTransaction />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Flex>
        </Grid>
        <Modal isOpen={isConnectModalOpen} onClose={handleConnectModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Connect />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleConnectModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>
  );
};
