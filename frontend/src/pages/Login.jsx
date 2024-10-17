import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Button,
  Text,
  Center,
  Link as ChakraLink,
  Divider
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login } from '../lib/api'

import { FcGoogle } from 'react-icons/fc'
import { SiLinkedin } from 'react-icons/si'

const Login = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const redirectUrl = location.state?.redirectUrl || '/home'

  const {
    mutate: signIn,
    isPending,
    isError
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true
      })
    }
  })

  return (
    <Flex minH='100vh' align='center' justify='center'>
      <Container mx='auto' maxW='md' py={12} px={6} textAlign='center'>
        <Heading fontSize='4xl' mb={8}>
          Sign in to your account
        </Heading>
        <Box rounded='lg' bg='gray.700' boxShadow='lg' p={8}>
          {isError && (
            <Box mb={3} color='red.400'>
              Invalid email or password
            </Box>
          )}
          <Stack spacing={4}>
            <FormControl id='email'>
              <FormLabel>Email address</FormLabel>
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <Input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && signIn({ email, password })
                }
              />
            </FormControl>

            <ChakraLink
              as={Link}
              to='/password/forgot'
              fontSize='sm'
              textAlign={{
                base: 'center',
                sm: 'right'
              }}
            >
              Forgot password?
            </ChakraLink>
            <Button
              mt={2}
              isLoading={isPending}
              isDisabled={!email || password.length < 6}
              onClick={() => signIn({ email, password })}
            >
              Sign in
            </Button>

            <Divider />

            <Flex flexDir={'column'} gap={2}>
              <Button
                w={'full'}
                maxW={'md'}
                variant={'outline'}
                leftIcon={<FcGoogle />}
              >
                <Center>
                  <Text>Continute with Google</Text>
                </Center>
              </Button>

              <Button
                w={'full'}
                maxW={'md'}
                colorScheme={'messenger'}
                leftIcon={<SiLinkedin />}
              >
                <Center>
                  <Text>Contiue with Linkedin</Text>
                </Center>
              </Button>
            </Flex>

            <Divider />

            <Text align='center' fontSize='sm' color='text.muted'>
              Don&apos;t have an account?{' '}
              <ChakraLink as={Link} to='/register'>
                Sign up
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  )
}

export default Login
