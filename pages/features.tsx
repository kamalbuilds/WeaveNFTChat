
import { ReactElement } from 'react';
import { Box, SimpleGrid, Icon, Text, Stack, Flex, Avatar } from '@chakra-ui/react';
import lens from '/public/lens.png'
import lit from '/public/lit.png'
import weavedb from '/public/weave.png'

interface FeatureProps {
  title: string;
  text: string;
  icon: ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default function SimpleThreeColumns() {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
      <Avatar
          src="https://assets-global.website-files.com/6364e65656ab107e465325d2/63f6948a05c1410a41c86cf6_0Sqbm5PxjFpSYWRPsnbdsO4zHmLnlVUcu218_rUy100.png"
          size="100px"
          position="relative"
          top={0}
        />
            <Avatar
          src="https://storage.googleapis.com/ethglobal-api-production/organizations%2Fvxwti%2Flogo%2F1678645512720_Screen%20Shot%202023-03-12%20at%2011.25.01%20AM.png"
          size="100px"
          position="relative"
          top={0}
        />
            <Avatar
          src="https://101-user-uploads.s3.us-east-1.amazonaws.com/a9dfa84d-b9ed-4ae3-802f-5c4dc66c8bd5.png"
          size="100px"
          position="relative"
          top={0}
        />
      </SimpleGrid>
    </Box>
  );
}