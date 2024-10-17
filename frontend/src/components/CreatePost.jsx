import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Textarea
} from '@chakra-ui/react'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { user } = useAuth()

  return (
    <>
      {user ? (
        <Stack spacing={2} mb={2}>
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
            />
          </FormControl>

          <Button
            my={2}
            // Uncomment and set loading and disabled states as needed
            // isLoading={isPending}
            // isDisabled={!title || content.length < 6}
            // onClick={() => handleCreatePost()}
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
            // onClick={() => handleCreatePost()}
          >
            Sign in to create post
          </Button>
        </Stack>
      )}
    </>
  )
}

export default CreatePost
