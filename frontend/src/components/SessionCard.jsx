import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react'
import useDeleteSession from '../hooks/useDeleteSession'

const SessionCard = ({ session }) => {
  const { _id, createdAt, userAgent, isCurrent } = session

  const { deleteSession, isPending } = useDeleteSession(_id)

  return (
    <Flex p={4} borderWidth='1px' borderRadius='md'>
      <Box flex={1}>
        <Text fontWeight='bold' fontSize='sm' mb={1}>
          {new Date(createdAt).toLocaleString('en-US')}
          <Badge mx={'4'} variant={'subtle'}>
            {isCurrent && 'current session'}
          </Badge>
        </Text>
        <Text color='gray.500' fontSize='xs'>
          {userAgent}
        </Text>
      </Box>
      {!isCurrent && (
        <Button
          size='sm'
          alignSelf={'center'}
          color={'red.400'}
          variant='ghost'
          onClick={deleteSession}
          isLoading={isPending}
        >
          <Text fontSize={'xl'} mb={'1'}>
            &times;
          </Text>
        </Button>
      )}
    </Flex>
  )
}

export default SessionCard
