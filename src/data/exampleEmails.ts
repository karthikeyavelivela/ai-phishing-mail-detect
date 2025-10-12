export interface ExampleEmail {
  id: string;
  title: string;
  category: 'safe' | 'suspicious' | 'phishing';
  content: string;
}

export const exampleEmails: ExampleEmail[] = [
  {
    id: 'safe-1',
    title: 'Safe - Newsletter',
    category: 'safe',
    content: `Hi there,

Thank you for subscribing to our monthly newsletter. Here's what we have for you this month:

- New product launches
- Industry insights
- Upcoming events

You can view the full newsletter on our website at https://newsletter.example.com

Best regards,
The Example Team

Unsubscribe: https://example.com/unsubscribe`
  },
  {
    id: 'suspicious-1',
    title: 'Suspicious - Urgent Action',
    category: 'suspicious',
    content: `Dear Valued Customer,

Your account requires immediate attention. Please verify your information within 24 hours to avoid suspension.

Click here to update your details: https://account-verify.example.tk

Thank you for your cooperation.

Customer Service Team`
  },
  {
    id: 'phishing-1',
    title: 'Phishing - PayPal Scam',
    category: 'phishing',
    content: `Dear User,

We have detected unusual activity on your PayPal account. Your account has been temporarily suspended.

URGENT: Click here immediately to verify your identity: http://192.168.1.100/paypal-verify

You must confirm your password, credit card, and social security number within 24 hours or your account will be permanently locked.

Kindly update your information now to restore access.

PayPal Security Team
Click here now: http://paypal-security.tk/verify`
  },
  {
    id: 'phishing-2',
    title: 'Phishing - Prize Winner',
    category: 'phishing',
    content: `Congratulations! You are a winner!

You have been selected to receive $1,000,000 in our annual lottery draw!

To claim your prize immediately, click here: https://lottery-claim.ml/winner

You must provide your bank account details and social security number to process the payment. This offer expires today!

Act now! Click here to claim your millions: https://prize-urgent.ga

Lottery Commission`
  },
  {
    id: 'phishing-3',
    title: 'Phishing - Microsoft Alert',
    category: 'phishing',
    content: `Security Alert - Action Required

Dear Microsoft User,

We have detected suspicious login attempts to your account. Your account will be suspended unless you verify your identity immediately.

Click here now: http://192.168.0.50/microsoft-verify
Download this security update: https://microsoft-update.xyz/urgent

Please confirm your password and update payment information within 12 hours.

Urgent attention required!

Microsoft Security Team`
  },
  {
    id: 'suspicious-2',
    title: 'Suspicious - Generic Greeting',
    category: 'suspicious',
    content: `Dear Customer,

Kindly update your account information to continue using our services.

Please click the link below to verify your details:
https://account-update.club/verify

Thank you for your immediate attention to this matter.

Support Team`
  },
  {
    id: 'safe-2',
    title: 'Safe - Order Confirmation',
    category: 'safe',
    content: `Hi John Smith,

Thank you for your order #12345 from Example Store.

Order Details:
- Product: Wireless Headphones
- Price: $99.99
- Estimated Delivery: 3-5 business days

You can track your order at: https://example.com/orders/12345

If you have any questions, please reply to this email or contact us at support@example.com

Best regards,
Example Store Team`
  },
  {
    id: 'phishing-4',
    title: 'Phishing - IRCTC Account',
    category: 'phishing',
    content: `Dear Indian Railways Customer,

Your IRCTC account has been temporarily blocked due to suspicious activity.

URGENT: Verify your account immediately to avoid permanent suspension.

Click here: http://irctc-verify.tk/login
Update your Aadhaar, PAN card and payment details now!

This is your last warning! Act within 6 hours.

IRCTC Security Team`
  },
  {
    id: 'suspicious-3',
    title: 'Suspicious - Flipkart Prize',
    category: 'suspicious',
    content: `Congratulations!

You have won ₹50,000 Flipkart voucher in our lucky draw!

To claim your prize, click here: https://flipkart-winner.club

Hurry! Offer valid for 24 hours only.

Flipkart Customer Care`
  },
  {
    id: 'phishing-5',
    title: 'Phishing - SBI KYC Update',
    category: 'phishing',
    content: `Dear SBI Customer,

Your KYC details are pending verification. Your account will be blocked if not updated immediately.

URGENT ACTION REQUIRED:
Click here: http://192.168.1.88/sbi-kyc
Update Aadhaar, PAN, and mobile number
Confirm ATM PIN and CVV number

Complete within 12 hours or face account suspension.

State Bank of India
Customer Service`
  },
  {
    id: 'safe-3',
    title: 'Safe - Amazon India Order',
    category: 'safe',
    content: `Hello Rajesh Kumar,

Your Amazon.in order #402-8934567-1234567 has been shipped!

Order Details:
- Book: "Thinking, Fast and Slow"
- Price: ₹399
- Delivery by: 15th March 2025

Track your shipment: https://amazon.in/track/402-8934567-1234567

For any assistance, visit Amazon.in Help Center or call 1800-3000-9009

Thanks,
Amazon India Team`
  },
  {
    id: 'phishing-6',
    title: 'Phishing - Paytm Wallet',
    category: 'phishing',
    content: `Alert! Your Paytm Wallet

Dear User,

Your Paytm wallet has been temporarily locked due to KYC non-compliance.

IMMEDIATE ACTION: Click here to update KYC: http://paytm-kyc.ml/verify

Please provide:
- Aadhaar Card details
- PAN Card number
- Bank account and UPI PIN
- Complete within 24 hours!

Download attachment to complete verification.

Paytm Security`
  },
  {
    id: 'suspicious-4',
    title: 'Suspicious - Jio Recharge',
    category: 'suspicious',
    content: `Dear Jio Customer,

Your mobile number is eligible for FREE lifetime data!

Claim now: https://jio-free-data.tk

Limited offer! Click immediately to activate.

Customer Care Team`
  }
];
