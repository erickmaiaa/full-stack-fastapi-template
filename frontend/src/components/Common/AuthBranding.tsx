export default function AuthBranding() {
  return (
    <div className="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r">
      <div className="bg-primary/5 absolute inset-0" />
      <div className="relative z-20 flex items-center text-lg font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        Acme Inc
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="leading-normal text-balance">
          &ldquo;This library has saved me countless hours of work and helped me
          deliver stunning designs to my clients faster than ever before.&rdquo;
          - Sofia Davis
        </blockquote>
      </div>
    </div>
  );
}
