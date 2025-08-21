# Cravvelo P2P Payment Flow

The P2P (peer-to-peer) payment method allows buyers to send money directly to sellers using their preferred channels (e.g., Binance, bank transfer, wallet).  
After payment, the buyer uploads proof (image or PDF) to Cravvelo for verification.

---

## 🔄 Payment Flow

### 1. Buyer Journey

1. Buyer selects a **product or course** and chooses **P2P** as the payment method.
2. Cravvelo generates a `Payment` record with:
   - `status = PENDING`
   - `provider = P2P`
   - linked `Sale` and `ItemPurchase`
3. Buyer sends money **directly to the seller** using the seller’s configured payment details.
4. Buyer uploads **proof of payment** (`PaymentProof`) → image (jpg/png) or document (pdf).
5. System notifies the seller (`NotificationType.INFO`) that a proof is awaiting validation.

### 2. Seller Journey

1. Seller receives a dashboard notification:
   - "New P2P payment proof received for Order #XXXX"
2. Seller can:
   - ✅ **Validate** → marks `Payment.status = COMPLETED`, buyer gets access immediately.
   - ❌ **Reject** → marks `Payment.status = FAILED` and provides a rejection note.
3. If the seller takes **no action within X hours/days**, the system:
   - Automatically marks `Payment.status = COMPLETED`
   - Grants buyer access to product/course.

### 3. Buyer Protection

1. If the seller rejects but buyer claims unfair treatment, buyer can **open a dispute**.
2. Dispute notifies Cravvelo Admin.
3. **Admin role**:
   - Reviews `PaymentProof` and communication.
   - Can **override** status to:
     - ✅ `COMPLETED` (grant access to buyer)
     - ❌ `FAILED/REFUNDED` (refund buyer credits or mark as invalid)
   - Logs decision in `Payment.metadata`.

---

## 🗂 Data Models Used

- **Payment**
  - Links Sale, Student, Seller (Account)
  - Status: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`
  - Method: `PaymentProvider.P2P`
- **PaymentProof**
  - fileUrl (image/pdf)
  - note
  - verified = true/false
- **Notification**
  - Notifies seller about proofs and actions
- **ItemPurchase**
  - Activated once payment is validated (by seller or automatically)

---

## 📊 Seller Dashboard Integration

### Seller Settings

- Sellers configure **P2P details** in `PaymentMethodConfig`:
  ```json
  {
    "wallet": "USDT Binance Wallet Address",
    "network": "TRC20",
    "iban": "DZ1234567890",
    "note": "Send exact amount only"
  }
  ```
