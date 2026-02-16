import { SignIn } from '@clerk/nextjs';

export const metadata = {
  title: 'Sign In - Inngest Dashboard',
};

export default function SignInPage() {
  return (
    <div className="w-full max-w-md">
      <SignIn />
    </div>
  );
}
