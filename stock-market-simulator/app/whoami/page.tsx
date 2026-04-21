import { getCurrentUser } from '@/lib/auth';

export default async function WhoAmIPage() {
  const user = await getCurrentUser();

  return (
    <div style={{ padding: 40 }}>
      <h1>Who am I?</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}