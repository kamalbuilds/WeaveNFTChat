
import * as React from "react"
import { Box, Button, Collapse, Text, useDisclosure, createIcon } from '@chakra-ui/react'

export default function HowItWorks() {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Box mt={8}>
      <Button 
        onClick={onToggle}
        rounded={'full'}
        size={'lg'}
        fontWeight={'bold'}
        px={6}
        leftIcon={<PlayIcon h={4} w={4} color={'blue.100'} />}
      >
        How It Works
      </Button>
      <Collapse in={isOpen} animateOpacity>
        <Box
          p='40px'
          color='gray.700'
          mt='4'
          bg='gray.100'
          rounded='lg'
          shadow='md'
        >
          <Text>
            1) Click on &quot;Sign In&quot; to connect your Ethereum wallet
            <br/> 
            <br/> 
            2) Copy and Paste your NFT Collection smartcontract address (you can find it on Etherscan or OpenSea)
            <br/> <br/> 
            3) Type the Topic name (example: Health , Airdrop)
            <br/>
            <br/> 
            4) Click on &quot;Join Chat&quot;
            <br/> <br/> 
            5) Enjoy! 
            </Text> 
        </Box>
      </Collapse>
    </Box>
  )
}

  const PlayIcon = createIcon({
    displayName: 'PlayIcon',
    viewBox: '0 0 58 58',
    d:
      'M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z',
  });