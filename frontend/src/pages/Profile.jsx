import {
  Alert,
  AlertIcon,
  Center,
  Container,
  Heading,
  Text
} from '@chakra-ui/react'
import useAuth from '../hooks/useAuth'

const Profile = () => {
  const { user } = useAuth()
  const { email, verified, createdAt } = user.user

  return (
    <Container mt={16} flexDir='column'>
      <Heading mb={2}>My Account</Heading>
      {!verified && (
        <Alert status='warning' my={4} w='fit-content' borderRadius={12} mb={3}>
          <AlertIcon />
          Please verify your email
        </Alert>
      )}
      <Text fontWeight={600} color='white' mb={2}>
        Email:{' '}
        <Text as='span' color='gray.300'>
          {email}
        </Text>
      </Text>
      <Text fontWeight={600} color='white'>
        Created:{' '}
        <Text as='span' color='gray.300'>
          {new Date(createdAt).toLocaleDateString('en-US')}
        </Text>
      </Text>
    </Container>
  )
}

export default Profile
