import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Icon,
    Stack,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
  import {
    FcDatabase,
    FcLock,
    FcBusinessman,
    FcLineChart,
    FcCheckmark,
  } from 'react-icons/fc';
  import { ReactElement } from 'react';
  import {
    FcAbout,
    FcAssistant,
    FcCollaboration,
    FcDonate,
    FcManager,
  } from 'react-icons/fc';
  
  interface CardProps {
    heading: string;
    description: string;
    icon: ReactElement;
    href: string;
  }
  
  const Card = ({ heading, description, icon, href }: CardProps) => {
    return (
      <Box
        maxW={{ base: 'full', md: '275px' }}
        w={'full'}
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={5}>
        <Stack align={'start'} spacing={2}>
          <Flex
            w={16}
            h={16}
            align={'center'}
            justify={'center'}
            color={'white'}
            rounded={'full'}
            bg={useColorModeValue('gray.100', 'gray.700')}>
            {icon}
          </Flex>
          <Box mt={2}>
            <Heading size="md">{heading}</Heading>
            <Text mt={1} fontSize={'sm'}>
              {description}
            </Text>
          </Box>
        </Stack>
      </Box>
    );
  };
  
  export default function Grid () {
    return (
      <Box p={4} className='text-white'>
        <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
          <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
            Features
          </Heading>
          <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
            Amazing features that will make you fall in love with our product ❤️
          </Text>
        </Stack>
  
        <Container maxW={'5xl'} mt={12}>
          <Flex flexWrap="wrap" gridGap={6} justify="center">
            <Card
              heading={'Group NFT Chat'}
              icon={<Icon as={FcCollaboration} w={10} h={10} />}
              description={
                'Engage and interact with your NFTs in dedicated social groups.'
              }
              href={'#'}
            />
            <Card
              heading={'Cross-Chain Messaging'}
              icon={<Icon as={FcLineChart} w={10} h={10} />}
              description={
                'Seamlessly communicate across different blockchain networks.'
              }
              href={'#'}
            />
            <Card
              heading={'Decentralized Database'}
              icon={<Icon as={FcDatabase} w={10} h={10} />}
              description={
                "Safeguard user data and conversations with Weave DB's decentralized capabilities."
              }
              href={'#'}
            />
            <Card
              heading={'Secure Chat Environment'}
              icon={<Icon as={FcLock} w={10} h={10} />}
              description={
                'Foster a secure chat environment with robust access control using the Lit Protocol.'
              }
              href={'#'}
            />
            <Card
              heading={'Simplified User Onboarding'}
              icon={<Icon as={FcBusinessman} w={10} h={10} />}
              description={
                'Use popular authentication methods like Google OAuth and WebAuth for easy sign-up.'
              }
              href={'#'}
            />
            <Card
              heading={'Comprehensive Social Graph'}
              icon={<Icon as={FcCheckmark} w={10} h={10} />}
              description={
                'Explore your social interactions within the NFT landscape with the Lens social graph protocol.'
              }
              href={'#'}
            />
            <Card
              heading={'Immutable Message Storage'}
              icon={<Icon as={FcDonate} w={10} h={10} />}
              description={
                'Ensure the durability and permanence of user messages with Arweave integration.'
              }
              href={'#'}
            />
          </Flex>
        </Container>
      </Box>
    );
  };