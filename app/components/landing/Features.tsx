const features = [
  {
    title: "Checklist intelligente",
    desc: "Organise ton matériel et tes actions facilement",
  },
  {
    title: "Priorités",
    desc: "Visualise rapidement ce qui est urgent",
  },
  {
    title: "Dashboard",
    desc: "Accède à ton prochain shooting en un clic",
  },
];

export default function Features() {
  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="p-4 border border-white/10 rounded-lg bg-white/5"
          >
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
