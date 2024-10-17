import { Box, Button, Flex, Text } from '@chakra-ui/react'

const PostCard = ({ title, content, votes, createdAt }) => {
  return (
    <Flex p={3} borderWidth='1px' borderRadius='md'>
      <Box flex={1}>
        <Text fontWeight='bold' fontSize='lg'>
          {title}
        </Text>
        <Text fontSize='sm' mb={1}>
          {content}
        </Text>
        <Flex
          flexDir='row'
          align='flex-end'
          mt={2}
          justify={'space-between'}
          gap={4}
        >
          <Flex flexDir='column'>
            <Text color='gray.500' fontSize='xs' mb={1}>
              Upvotes: {votes}
            </Text>
            <Text color='gray.500' fontSize='xs'>
              {new Date(createdAt).toLocaleString('en-US')}
            </Text>
          </Flex>

          <Flex align='center' gap={2}>
            <Button size='sm' variant='outline'>
              Edit
            </Button>
            <Button
              size='sm'
              bg='red.400'
              _hover={{ bg: 'red.500' }}
              _active={{ bg: 'red.600' }}
              color='white'
            >
              Remove
            </Button>
          </Flex>
        </Flex>
      </Box>
      {/* {!isCurrent && (
        <Button
          size='sm'
          variant='ghost'
          ml={4}
          alignSelf='center'
          fontSize='xl'
          color='red.400'
          title='Delete Session'
          onClick={deleteSession}
          isLoading={isPending}
        >
          &times;
        </Button>
      )} */}
    </Flex>
  )
}

export default PostCard
