import React from "react";
import { Flex, Avatar, AvatarBadge, Text, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";
import { useContext , useEffect , useState } from "react";
import { AppContext } from "../context";
import { ethers } from "ethers";

const Header = () => {
  const { userAddress } = useContext(AppContext);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [nftImages, setNftImages] = useState([]);
  const { selectedAvt, setSelectedAvt } = useContext(AppContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  function ipfsToHttp(url) {
    if (url.startsWith('ipfs://')) {
      const CID = url.split('ipfs://')[1];
      return `https://ipfs.io/ipfs/${CID}`;
    }
    return url;
  }

  const fetchNfts = async () => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = `${baseURL}/getNFTs/?owner=${userAddress}`;
    var requestOptions = {
      method: 'get',
      redirect: 'follow'
    };
    fetch(url, requestOptions)
    .then(response => response.json())
    .then((data) => {
      const imageUrls = data.ownedNfts
          .filter(nft => nft.metadata && nft.metadata.image) 
          .map(nft => ipfsToHttp(nft.metadata.image));
      setNftImages(imageUrls);
    })
    .catch(error => console.log('error', error));
  };

  useEffect(() => {
    if (userAddress) {
      fetchNfts();
    }
  }, [userAddress]);

  return (
    <Flex w="100%" align="center" justify="right">
      <Button onClick={onOpen} className="mx-16">Select Avatar</Button>
      <Avatar size="lg" name="Dan Abrahmov" src={selectedAvatar}>
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </Avatar>
      <Flex flexDirection="column" mx="5" justify="center">
        <Text fontSize="lg" fontWeight="bold">
          Kamal Singh
        </Text>
        <Text color="green.500">Online</Text>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select an Avatar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              nftImages.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  onClick={() => {
                    setSelectedAvatar(imageUrl);
                    setSelectedAvt(imageUrl);
                    onClose();
                  }}
                  style={{
                    cursor: 'pointer',
                    border: selectedAvatar === imageUrl ? '2px solid blue' : 'none'
                  }}
                />
              ))
            }
          </ModalBody>
        </ModalContent>
      </Modal>

    </Flex>
  );
};

export default Header;
