import { Suspense } from "react"
import ShipmentsContent from "./shipment-content"


export default function SuperAdminShipments() {
  return (
    <Suspense fallback={null}>
      <ShipmentsContent />
    </Suspense>
  )
}
