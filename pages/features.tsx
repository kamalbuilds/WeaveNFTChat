import { Box, Grid, chakra, Text, Flex } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';

const ResponsiveLogo = chakra('img', {
  baseStyle: {
    width: '100px',
    height: '100px',
    rounded: 'full', // Make the logos rounded
  },
  sizes: {
    md: {
      width: '150px',
      height: '150px',
    },
  },
});

export default function ThreeLogosGrid() {0
  return (

    <Box p={4} textColor={'white'}>
     <Flex direction="column" alignItems="center" mb={4}> {/* Add margin-bottom to create distance */}
        <Text fontSize="lg" mt={5}>Powered by</Text>
      </Flex>
      <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={8}>
        <Flex direction="column" alignItems="center">
          <ResponsiveLogo
            src="https://assets-global.website-files.com/6364e65656ab107e465325d2/63f6948a05c1410a41c86cf6_0Sqbm5PxjFpSYWRPsnbdsO4zHmLnlVUcu218_rUy100.png"
            alt="WeaveDB"
          />
          <Text mt={5}>WeaveDB takes your messages cross-chain and stores them in an unhackable decentralized database 💎</Text>
        </Flex>

        <Flex direction="column" alignItems="center">
          <ResponsiveLogo
            src="https://storage.googleapis.com/ethglobal-api-production/organizations%2Fvxwti%2Flogo%2F1678645512720_Screen%20Shot%202023-03-12%20at%2011.25.01%20AM.png"
            alt="Lens protocol"
          />
          <Text mt={5}>Lens Protocol&apos;s social graph is giving you a bird&apos;s-eye view of your community. 🌏 </Text>
        </Flex>

        <Flex direction="column" alignItems="center">
          <ResponsiveLogo
            src="https://101-user-uploads.s3.us-east-1.amazonaws.com/a9dfa84d-b9ed-4ae3-802f-5c4dc66c8bd5.png"
            alt="Lit protocol"
          />
          <Text mt={5}>Lit Protocol provides access control logic and fosters a secure chat environment.✅</Text>
        </Flex>

        <Flex direction="column" alignItems="center">
          <Avatar size="xl" src="https://cryptocurrencyjobs.co/startups/assets/logos/fleek.png" />
          <Text mt={5}>Fleek suite of tools made this ship fly. 🛸</Text>
        </Flex>

        <Flex direction="column" alignItems="center">
          <Avatar size="xl" src="https://breakorbit.vc/wp-content/uploads/2021/11/intmax_logo.png" />
          <Text mt={5}>IntMax gives the power of Transactions 💵</Text>
        </Flex>
        
        <Flex direction="column" alignItems="center">
          <Avatar size="xl" src="https://d31ygswzsyecnt.cloudfront.net/arweavelogo.png" />
          <Text mt={5}>Arweave ensures the permanance of your data 👌🏻</Text>
        </Flex>
      </Grid>
    </Box>
  );
}
