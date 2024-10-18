import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react'
import { IoClose } from 'react-icons/io5'
import useDeleteSession from '../hooks/useDeleteSession'

const SessionCard = ({ session }) => {
  const { _id, createdAt, userAgent, isCurrent } = session

  const { deleteSession, isPending } = useDeleteSession(_id)

  return (
    <Flex p={3} borderWidth='1px' minW={'full'} borderRadius='md'>
      <Box flex={1}>
        <Text fontWeight='bold' fontSize='sm' mb={1}>
          {new Date(createdAt).toLocaleString('en-US')}
          {isCurrent && ' (current session)'}
        </Text>
        <Text color='gray.500' fontSize='xs'>
          {userAgent}
        </Text>
      </Box>
      {!isCurrent && (
        <Button
          size='sm'
          variant='ghost'
          ml={4}
          alignSelf='center'
          fontSize='sm'
          color='red.400'
          title='Delete Session'
          onClick={deleteSession}
          isLoading={isPending}
        >
          <IoClose size={20} />
        </Button>
      )}
    </Flex>
  )
}

export default SessionCard
