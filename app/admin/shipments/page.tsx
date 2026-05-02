import { Suspense } from "react"
import AdminShipmentsContent from "./admin-shipments-content"

export default function AdminShipments() {
  return (
    <Suspense fallback={null}>
      <AdminShipmentsContent />
    </Suspense>
  )
}
