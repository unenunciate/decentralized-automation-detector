import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'hooks/useAuth'

export interface ActionControllerProps {
  children: React.ReactNode
}

export function ActionController({ children }: ActionControllerProps) {
  const runOnceRef = useRef<any | null>(null)
  const { auth, removeAllowedDomain, loading } = useAuth()
  const navigate = useNavigate()
  const action: any = {};

  useEffect(() => {
    if (!action || loading) {
      runOnceRef.current = null
      return
    }
    if (runOnceRef.current === action) return

    // Save the action, so we only run this once per action
    runOnceRef.current = action

    // Authenticated, move to next step
    switch (action.type) {
      case 'signIn':
        return navigate('/connected')
      case 'signOut':
        removeAllowedDomain(action.data?.domain)
        action.resolve()
        return
      case 'ethPersonalSign': return navigate('/sign/personal')
    }
  }, [action, auth, loading, navigate, removeAllowedDomain])

  return (
    <>{children}</>
  )
}