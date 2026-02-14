import { Store, Mail, CreditCard, Shield } from 'lucide-react';

export const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-semibold text-stone-900">Store Settings</h1>

      <div className="grid gap-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-jade-100 text-jade-600">
              <Store className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Store Information</h2>
          </div>
          <p className="text-sm text-stone-500 mb-4">
            Store name, address, and contact details. Configure these in your backend environment.
          </p>
          <div className="space-y-2 text-sm">
            <p><span className="text-stone-500">Store:</span> Jade Collections</p>
            <p><span className="text-stone-500">Address:</span> 123 Jewelry Lane, Mumbai, Maharashtra 400001</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Email & Notifications</h2>
          </div>
          <p className="text-sm text-stone-500">
            Order confirmations and shipping emails are sent via SMTP. Configure SMTP_HOST, SMTP_USER, etc. in your .env file.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Payments</h2>
          </div>
          <p className="text-sm text-stone-500">
            Razorpay is configured for online payments. Set RAZORPAY_KEY_ID and RAZORPAY_SECRET in your environment.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
              <Shield className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Security</h2>
          </div>
          <p className="text-sm text-stone-500">
            JWT authentication, rate limiting, and CORS are configured. Ensure JWT_SECRET is at least 32 characters in production.
          </p>
        </div>
      </div>
    </div>
  );
};
