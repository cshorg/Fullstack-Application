import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { getTimeDifference } from '../lib/time'
import { FaRegComment, FaRegHeart, FaHeart } from 'react-icons/fa'

const PostCard = ({ id, postId, title, content, votes, createdAt, owner }) => {
  const createdAtFormated = getTimeDifference(createdAt)

  return (
    <Flex p={3} borderWidth='1px' borderRadius='md'>
      <Box flex={1}>
        <Flex gap={2} mb={1}>
          <Text color='gray.500' fontSize='xs' width='80px' isTruncated>
            {id}
          </Text>
          <Text color='gray.500' fontSize='xs'>
            {createdAtFormated}
          </Text>
        </Flex>
        <Flex align={'center'} gap={3}>
          <Text fontWeight='bold' fontSize='lg'>
            {title}
          </Text>
        </Flex>
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
          <Flex
            flexDir='row'
            gap={4}
            color='gray.500'
            fontSize='sm'
            align={'center'}
          >
            <Flex align={'center'} gap={1.5}>
              <FaRegHeart />
              <Text>{votes}</Text>
            </Flex>
            <Flex align={'center'} gap={1.5}>
              <FaRegComment />
              <Text>0</Text>
            </Flex>
          </Flex>

          <Flex align='center' gap={2}>
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_API_URL}/post/${postId}`
                )
              }
              size='sm'
              variant='outline'
            >
              Share
            </Button>
            {owner && (
              <>
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
              </>
            )}
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
