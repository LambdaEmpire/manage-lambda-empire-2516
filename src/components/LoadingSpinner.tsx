import { Crown } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Loading Lambda Empire..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-4">
        <div className="relative">
          <Crown className="h-12 w-12 text-purple-600 mx-auto animate-pulse" />
          <div className="absolute inset-0 animate-spin">
            <div className="h-12 w-12 border-2 border-purple-200 border-t-purple-600 rounded-full"></div>
          </div>
        </div>
        <p className="text-gray-600 animate-pulse">{message}</p>
      </div>
    </div>
  );
}