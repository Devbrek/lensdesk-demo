import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">
        Prêt à organiser tes shootings ?
      </h2>

      <button
        onClick={() => router.push("/dashboard")}
        className="bg-white text-black px-6 py-2 rounded-md font-semibold"
      >
        Commencer
      </button>
    </section>
  );
}
