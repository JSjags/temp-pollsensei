import React from 'react'
import { Analytics } from './components/Analytics'
import { InAppPurchases } from './components/InAppPurchases'
import { TransactionHistory } from './components/TransactionHistory'


export default function Shop() {
  return (
    <div>
      <Analytics/>
      <InAppPurchases/>
      <TransactionHistory/>
    </div>
  )
}
