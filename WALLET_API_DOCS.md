# Wallet API Endpoints

Base URL: /api/v1/payments

## Auth
All wallet endpoints require a valid bearer token for a customer user.

## 1. Get wallet balance and recent activity
- Method: GET
- Path: /wallet
- Purpose: Fetch the authenticated customer’s current wallet balance and recent wallet transactions.

Response example:
```json
{
  "success": true,
  "data": {
    "balance": 5000,
    "customer": {
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "walletBalance": 5000
    },
    "transactions": [
      {
        "reference": "WLT-123",
        "type": "CREDIT",
        "amount": 5000,
        "source": "paystack_funding",
        "status": "SUCCESS"
      }
    ]
  }
}
```

## 2. Fund wallet with Paystack
- Method: POST
- Path: /wallet/fund
- Purpose: Initialize a Paystack checkout for funding the wallet.

Request body:
```json
{
  "amount": 5000,
  "email": "jane@example.com",
  "description": "Wallet funding"
}
```

Response example:
```json
{
  "success": true,
  "message": "Wallet funding initialized successfully",
  "data": {
    "reference": "WLT-123",
    "authorizationUrl": "https://checkout.paystack.com/xyz",
    "accessCode": "abc123",
    "amount": 5000,
    "currency": "NGN"
  }
}
```

## 3. Verify wallet funding payment
- Method: GET
- Path: /wallet/verify/:reference
- Purpose: Verify a wallet funding transaction after the Paystack callback or redirect.

Response example:
```json
{
  "success": true,
  "message": "Wallet funding verified successfully",
  "data": {
    "success": true,
    "walletTransaction": {
      "reference": "WLT-123",
      "status": "SUCCESS"
    },
    "customer": {
      "walletBalance": 10000
    }
  }
}
```

## 4. Pay shipment using wallet balance
- Method: POST
- Path: /shipments/:shipmentNumber/wallet
- Purpose: Pay an assigned shipment using the customer’s wallet balance.

Request body:
```json
{
  "description": "Payment for shipment"
}
```

Response example:
```json
{
  "success": true,
  "message": "Shipment paid with wallet successfully",
  "data": {
    "reference": "WAL-INV-123",
    "invoice": {
      "invoiceId": "INV-123"
    },
    "shipment": {
      "shipmentNumber": "SHP-001"
    },
    "walletBalance": 3000
  }
}
```

## Error handling
- 400/403/404/500 responses may be returned depending on invalid input, insufficient balance, unauthorized access, or missing resources.
- Insufficient balance returns an error like: "Insufficient wallet balance".
