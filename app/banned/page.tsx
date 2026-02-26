import { ShieldX } from "lucide-react";

export default function BannedPage() {
  return (
    <div className="min-h-screen bg-gw-bg-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
        <ShieldX className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h1 className="font-heading text-xl font-bold text-gw-navy">
          Account Suspended
        </h1>
        <p className="text-sm text-gw-text-gray mt-3 leading-relaxed">
          Your account has been suspended for violating our community
          guidelines. If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}
