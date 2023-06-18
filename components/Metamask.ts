import { useEffect, useState, useCallback } from 'react'
import { requestAccounts, sign, ethPersonalSignRecoverPublicKey } from '@polybase/eth'
import { useAuth } from 'hooks/useAuth'

export function Metamask() {
  const { login } = useAuth()
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    if (account) return
    (async () => {
      const accounts = await requestAccounts()
      setAccount(accounts[0])
    })()
  }, [account])

  const onSubmit = useCallback(async () => {
    if (!account) return

    // Get 64 byte public key
    const msg = 'Sign in'
    const sig = await sign(msg, account)
    const pkWithPrefix = await ethPersonalSignRecoverPublicKey(sig, msg)
    const publicKey = '0x' + pkWithPrefix.slice(4)

    login({
      type: 'metamask',
      userId: account,
      publicKey,
    })

    //navigate('/success')
  })

  const changeAccount = useCallback(async () => {
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [
        {
          eth_accounts: {},
        },
      ],
    })
    setAccount(null)
  })

  /**
  const el = account ? (
    <Box>
      <Stack spacing={6}>
        <Stack>
          <Heading fontSize='md' lineHeight={1.7} color='bw.600'>
            You are connected to:
          </Heading>
          <Heading fontSize='lg' color='bw.800'>
            {account}
          </Heading>
        </Stack>
        <Stack spacing={3}>
          <Button size='lg' onClick={onSubmit.execute}>Continue</Button>
          <Button
            size='lg'
            variant='outline'
            isLoading={changeAccount.loading}
            onClick={changeAccount.execute}>
            Swap Account
          </Button>
        </Stack>
      </Stack>
    </Box>
  ) : (
    <Stack spacing={6}>
      <Heading textAlign='center' fontSize='md' lineHeight={1.7} color='bw.600'>
        Select account in your <br /> Metamask wallet
      </Heading>
    </Stack>
  )

  return (
    <Layout title='Select Account'>
      <Box py={2}>
        {el}
      </Box>
    </Layout>
  )
  */
 
  return (
    <div>
      <li></li>
    </div>
  )
}