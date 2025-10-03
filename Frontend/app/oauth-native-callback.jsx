import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { handleRedirect } from '@clerk/clerk-expo';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    handleRedirect()
      .then(() => {
        router.replace('/auth/sign-up'); // Navigate after successful Google login
      })
      .catch(err => console.log("OAuth redirect error:", err));
  }, []);

  return null; // Optional: can render a loading spinner
}
