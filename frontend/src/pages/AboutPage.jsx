export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl font-bold mb-8">Meet the Team</h1>
      <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
        We are a group of passionate students building tools to help other students travel smarter and cheaper.
      </p>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {[1,2,3].map(i => (
          <div key={i} className="glass-card p-6 rounded-2xl transition-transform hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)]">
            <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 border-2 border-blue-500/50 flex items-center justify-center text-3xl font-bold text-slate-500">
              M{i}
            </div>
            <h3 className="text-xl font-bold">Team Member {i}</h3>
            <p className="text-slate-400">Developer</p>
          </div>
        ))}
      </div>
    </div>
  );
}
