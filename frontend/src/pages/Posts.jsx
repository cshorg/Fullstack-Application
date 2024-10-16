import { Alert, AlertIcon, Center, Heading, Text, Flex } from '@chakra-ui/react'
import useAuth from '../hooks/useAuth'
import PostCard from '../components/PostCard'

const Posts = () => {
  const { user } = useAuth()
  const posts = user.posts

  return (
    <Center mt={16} flexDir='column'>
      <Heading my={4}>My Posts</Heading>
      {posts.length > 0 ? (
        <Flex flexDir={'column'} gap={4}>
          {posts.map((post, index) => (
            <PostCard
              key={index}
              title={post.title}
              content={post.content}
              votes={post.votes}
              createdAt={post.createdAt}
            />
          ))}
        </Flex>
      ) : (
        <Alert status='info' w='fit-content' borderRadius={12} mb={3}>
          <AlertIcon />
          You have no posts
        </Alert>
      )}
    </Center>
  )
}

export default Posts
