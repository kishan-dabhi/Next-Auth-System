import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-bold">Not authorized</h2>
          <a href="/auth/login" className="text-sky-600">
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-300  p-6 rounded shadow">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p>Protected content — token present</p>
      </div>
    </div>
  );
}
