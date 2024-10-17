import { Container, Heading, VStack } from '@chakra-ui/react'
import useAuth from '../hooks/useAuth'
import PostCard from '../components/PostCard'
import CreatePost from '../components/CreatePost'

const Home = () => {
  const { user, isPending, isError, isSuccess } = useAuth()
  const posts = user.posts

  return (
    <Container mt={'16'}>
      <Heading mb={'6'}>Feed</Heading>
      <CreatePost />
      {isPending && <Spinner />}
      {isError && <Text color={'red.400'}>Failed to get posts.</Text>}
      {isSuccess && (
        <VStack spacing={'3'} align={'flex-start'}>
          {posts.map((post, index) => (
            <PostCard
              key={index}
              id={user.user._id}
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
