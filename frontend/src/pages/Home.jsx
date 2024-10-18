import { Container, Heading, VStack, Spinner } from '@chakra-ui/react'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'
import usePosts from '../hooks/usePosts'

const Home = () => {
  const { posts, isPending, isError, isSuccess } = usePosts()

  return (
    <Container mt={'16'}>
      <Heading mb={3}>Your Active Feed</Heading>

      <CreatePost />
      {isPending && <Spinner />}
      {isError && <Text color={'red.400'}>Failed to get posts.</Text>}
      {isSuccess && (
        <VStack spacing={'2'} align={'flex-start'}>
          {posts.map((post, index) => (
            <PostCard
              key={index}
              id={post.userId}
              postId={post._id}
              title={post.title}
              content={post.content}
              votes={post.votes}
              createdAt={post.createdAt}
              owner={false}
            />
          ))}
        </VStack>
      )}
    </Container>
  )
}

export default Home
