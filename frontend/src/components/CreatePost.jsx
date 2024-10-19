import {
  FormControl,
  Input,
  Stack,
  Button,
  Textarea,
  Box
} from '@chakra-ui/react'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../lib/api'
import useAuth from '../hooks/useAuth'
import { POSTS } from '../hooks/usePosts'

const CreatePost = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const {
    mutate: handleCreatePost,
    isPending,
    isError,
    error
  } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.setQueryData([POSTS], (cache) => {
        return [data.post, ...(cache || [])]
      })

      setTitle('')
      setContent('')
    }
  })

  return (
    <>
      {user ? (
        <Stack spacing={3} mb={5}>
          {isError && (
            <Box mb={2} color='red.400'>
              {error.message}
            </Box>
          )}
          <FormControl id='title'>
            <Input
              type='text'
              placeholder='Title your post'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl id='content'>
            <Textarea
              value={content}
              placeholder='Write your message here..'
              onChange={(e) => setContent(e.target.value)}
              maxH={'200px'}
            />
          </FormControl>

          <Button
            isLoading={isPending}
            isDisabled={title.length < 4 || content.length < 2}
            onClick={() => handleCreatePost({ title, content })}
          >
            Create Post
          </Button>
        </Stack>
      ) : (
        <Stack spacing={2} mb={2}>
          <Button
            my={2}
            // Uncomment and set loading and disabled states as needed
            // isLoading={isPending}
            // isDisabled={!title || content.length < 6}
            // onClick={() => handleCreatePost({ title, content })}
          >
            Sign in to create post
          </Button>
        </Stack>
      )}
    </>
  )
}

export default CreatePost
