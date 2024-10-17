import { Container, Heading, VStack } from '@chakra-ui/react'
import useAuth from '../hooks/useAuth'
import PostCard from '../components/PostCard'

const Posts = () => {
  const { user, isPending, isError, isSuccess } = useAuth()
  const posts = user.posts

  return (
    <Container mt={'16'}>
      <Heading mb={'6'}>My Posts</Heading>
      {isPending && <Spinner />}
      {isError && <Text color={'red.400'}>Failed to get posts.</Text>}
      {isSuccess && (
        <VStack spacing={'3'} align={'flex-start'}>
          {posts.map((post, index) => (
            <PostCard
              key={index}
              title={post.title}
              content={post.content}
              votes={post.votes}
              createdAt={post.createdAt}
            />
          ))}
        </VStack>
      )}
    </Container>
  )
}

export default Posts
