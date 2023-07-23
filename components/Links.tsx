import {
    Box,
    chakra,
    Container,
    Stack,
    Text,
    useColorModeValue,
    VisuallyHidden,
  } from '@chakra-ui/react';
  import { FaGithub, FaTwitter,  } from 'react-icons/fa';
  import { ReactNode } from 'react';
  import Link from 'next/link';
  import { css } from '@emotion/css';

  const SocialButton = ({
    children,
    label,
    href,
  }: {
    children: ReactNode;
    label: string;
    href: string;
  }) => {
    return (
      <chakra.button
        bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
        rounded={'full'}
        w={10}
        h={10}
        cursor={'pointer'}
        as={'a'}
        href={href}
        display={'inline-flex'}
        alignItems={'center'}
        justifyContent={'center'}
        transition={'background 0.3s ease'}
        _hover={{
          bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
        }}>
        <VisuallyHidden>{label}</VisuallyHidden>
        {children}
      </chakra.button>
    );
  };

  const logo = css`
  margin-right: 40px;
  font-weight: 600;
  font-size: 30px;
  color: white;
`;
  
  export default function Links() {
    return (
      <Box
      bg={useColorModeValue('black', 'black')}
      color={useColorModeValue('white', 'white')}
      position="fixed"
      bottom="0"
      right="0"
      left="0">
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}>
          <Link href='/'>
              <p className={logo}>💬 <span className='text-xl'>WeaveNFTChat</span></p>
          </Link>
          <Text>© 2023 Made with ❤️ @Weavedb Fellowship</Text>
          <Stack direction={'row'} spacing={6}>
            <SocialButton label={'Twitter'} href={'https://twitter.com/weavenftchat'}>
              <FaTwitter />
            </SocialButton>
            <SocialButton label={'Github'} href={'https://github.com/legendarykamal/WeaveNFTChat'}>
              <FaGithub />
            </SocialButton>
          </Stack>
        </Container>
      </Box>
    );
  }