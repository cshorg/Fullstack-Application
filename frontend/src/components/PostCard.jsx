import { Box, Button, Flex, Text } from '@chakra-ui/react'

const PostCard = ({ title, content, votes, createdAt }) => {
  return (
    <Flex p={4} borderWidth='1px' maxWidth={'600px'} borderRadius='md'>
      <Box flex={1}>
        <Text fontWeight='bold' fontSize='sm' mb={1}>
          {title}
        </Text>
        <Text color='gray.500' fontSize='xs'>
          {content}
        </Text>
        <Text fontWeight='bold' fontSize='sm' mt={1}>
          Votes: {votes}
        </Text>
      </Box>

      <Button
        mx={2}
        size='sm'
        alignSelf={'center'}
        color={'red.400'}
        variant='ghost'
      >
        <Text fontSize={'xl'} mb={'1'}>
          &times;
        </Text>
      </Button>
    </Flex>
  )
}

export default PostCard
