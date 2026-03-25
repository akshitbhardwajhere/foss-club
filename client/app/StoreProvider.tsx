'use client'
import { Provider } from 'react-redux'
import { store } from '../lib/store'

/**
 * StoreProvider Component
 * 
 * Thin wrapper integrating the Redux Toolkit `<Provider>` with the Next.js App Router.
 * Required because Redux context must be established in a `'use client'` environment.
 *
 * @param {Object} props - React children node.
 */
export default function StoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
