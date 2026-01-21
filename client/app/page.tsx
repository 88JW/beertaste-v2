export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-6xl font-bold mb-4">🍺 Beer Taste v2</h1>
      <p className="text-xl">
        Witaj na swoim serwerze! CI/CD działa perfekcyjnie.
      </p>
      <div className="mt-8 p-4 border rounded bg-gray-100 text-black">
        Status: <span className="text-green-600 font-bold">ONLINE</span>
      </div>
    </div>
  );
}

