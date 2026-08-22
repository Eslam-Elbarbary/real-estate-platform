interface AdviceSuccessBannerProps {
  message: string;
}

export function AdviceSuccessBanner({ message }: AdviceSuccessBannerProps) {
  return (
    <p
      role="status"
      aria-live="polite"
      className="mb-4 rounded-md border border-success-700/20 bg-success-50 px-3 py-2 text-sm font-semibold text-success-700"
    >
      {message}
    </p>
  );
}
