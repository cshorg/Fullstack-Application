import {
  Box,
  Flex,
  Button,
  Stack,
  useColorModeValue,
  useBreakpointValue
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import UserMenu from './UserMenu'

export default function WithSubnavigation() {
  const { user } = useAuth()

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
          <Link to={'/'}>
            <Button
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              fontSize={'18px'}
              color={useColorModeValue('gray.800', 'white')}
              fontWeight={'600'}
              variant={'ghost'}
            >
              Mern App
            </Button>
          </Link>
        </Flex>
        {user ? (
          <UserMenu />
        ) : (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            <Button
              as={'a'}
              fontSize={'sm'}
              fontWeight={600}
              variant={'ghost'}
              href={'/login'}
            >
              Sign In
            </Button>

            <Button
              as={'a'}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              href={'/register'}
            >
              Sign Up
            </Button>
          </Stack>
        )}
      </Flex>
    </Box>
  )
}
