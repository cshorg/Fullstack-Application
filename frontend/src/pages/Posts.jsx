import {
  Container,
  Heading,
  VStack,
  Text,
  Alert,
  AlertIcon,
  FormControl,
  Input,
  Button,
  Flex,
  Link as ChakraLink
} from '@chakra-ui/react'
import { Link } from '@chakra-ui/react'
import { RiSortDesc, RiSortAsc } from 'react-icons/ri'
import { RiFireFill, RiFireLine } from 'react-icons/ri'
import useAuth from '../hooks/useAuth'
import PostCard from '../components/PostCard'

const Posts = () => {
  const { user, isPending, isError, isSuccess } = useAuth()
  const posts = user?.posts

  return (
    <Container mt={'16'}>
      <Heading mb={'4'}>My Posts</Heading>
      <FormControl mb={'3'}>
        <Flex gap={3}>
          <Input
            size={'sm'}
            placeholder='Search your posts by title..'
            borderRadius='md'
          />
          <Button variant={'outline'} fontSize='xl' size={'sm'}>
            <RiSortAsc />
          </Button>
          <Button variant={'outline'} fontSize='xl' size={'sm'}>
            <RiFireLine />
          </Button>
        </Flex>
      </FormControl>
      {isPending && <Spinner />}
      {isError && <Text color={'red.400'}>Failed to get posts.</Text>}
      {isSuccess && (
        <VStack spacing={'3'} align={'flex-start'}>
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard
                id={user.user._id}
                postId={post._id}
                key={index}
                title={post.title}
                content={post.content}
                votes={post.votes}
                createdAt={post.createdAt}
                owner={true}
              />
            ))
          ) : (
            <Alert status={'info'} borderRadius={12} w='fit-content'>
              <AlertIcon />
              You have no posts,
              <ChakraLink as={Link} to={'/'} mx={1}>
                create
              </ChakraLink>
              your first post.
            </Alert>
          )}
        </VStack>
      )}
    </Container>
  )
}

export default Posts
