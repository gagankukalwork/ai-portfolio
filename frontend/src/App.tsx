import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  Sparkles,
  Star,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const API_BASE = "http://127.0.0.1:8000";

function Chip({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-2 rounded-full bg-white/80 border border-black/10 hover:bg-white transition shadow-sm"
      type="button"
    >
      {children}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-5">
      <div className="text-2xl font-extrabold tracking-tight">{value}</div>
      <div className="text-xs text-black/60 mt-1">{label}</div>
    </div>
  );
}

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  // Resume upload UI + status
  const [selectedResumeName, setSelectedResumeName] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = useMemo(
    () => [
      "What are your strongest skills?",
      "What projects have you built?",
      "What tech stack do you use?",
      "Summarize your experience",
    ],
    []
  );

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async () => {
    const q = question.trim();
    if (!q || loading) return;

    const updated: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(updated);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, { question: q });
      setMessages([...updated, { role: "assistant", content: res.data.answer }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content:
            "Backend not reachable. Please ensure FastAPI is running on http://127.0.0.1:8000",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const tech = [
    { name: "React", icon: <Sparkles className="w-5 h-5" /> },
    { name: "TypeScript", icon: <Search className="w-5 h-5" /> },
    { name: "Python", icon: <Sparkles className="w-5 h-5" /> },
    { name: "FastAPI", icon: <Send className="w-5 h-5" /> },
    { name: "PostgreSQL", icon: <Star className="w-5 h-5" /> },
    { name: "JavaScript (DOM)", icon: <Star className="w-5 h-5" /> },
  ];

  const projects = [
    {
      tag: "DOM + JS",
      title: "Drum Kit (DOM Based)",
      desc: "Interactive drum kit using keyboard events, DOM manipulation, and sound effects.",
      chips: ["HTML", "CSS", "JavaScript", "DOM"],
      img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=60",
    },
    {
      tag: "Tools",
      title: "API Tester (Postman-like)",
      desc: "A lightweight API testing tool that supports GET/POST requests, headers, and response preview.",
      chips: ["React", "TypeScript", "REST"],
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=60",
    },
    {
      tag: "UI/UX",
      title: "Analytics Dashboard",
      desc: "Dashboard UI with interactive cards and clean layouts.",
      chips: ["React", "UI", "Charts"],
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f3ef] text-[#111827]">
      {/* NAV */}
      <header className="sticky top-0 z-20 bg-[#f5f3ef]/80 backdrop-blur border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              G
            </div>
            <div className="leading-tight">
              <div className="font-bold">GaganDev</div>
              <div className="text-xs text-black/60">Full Stack • AI</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-black/70">
            <a className="hover:text-black" href="#about">
              About
            </a>
            <a className="hover:text-black" href="#skills">
              Skills
            </a>
            <a className="hover:text-black" href="#projects">
              Projects
            </a>
            <a className="hover:text-black" href="#resume">
              Resume + Chat
            </a>
            <a className="hover:text-black" href="#contact">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-black/10 shadow-sm text-sm"
              type="button"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm shadow-sm hover:opacity-90"
            >
              Let’s Talk <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* HERO */}
        <section id="about" className="pt-10 pb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-[28px] border border-black/10 shadow-sm p-8 md:p-10">
              <div className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-full bg-[#e9f7e5] border border-black/10">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                OPEN FOR INTERNSHIP
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Building digital{" "}
                <span className="relative">
                  experiences
                  <span className="absolute left-0 -bottom-1 w-full h-3 bg-[#d7ff4f] -z-10 rounded-md" />
                </span>{" "}
                that matter.
              </h1>

              <p className="mt-5 text-black/60 max-w-xl">
                Hi, I’m Gagan — a full-stack developer learning fast and building
                AI-powered apps with React, Python (FastAPI) and PostgreSQL.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-black text-white text-sm shadow-sm hover:opacity-90"
                >
                  View My Work <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#resume"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-black/10 text-sm shadow-sm hover:bg-black/5"
                >
                  Resume + AI Chat <Sparkles className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-[#d7ff4f] rounded-[28px] border border-black/10 shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="text-xs px-3 py-2 rounded-full bg-white/70 border border-black/10">
                  Full Stack
                </div>
                <div className="w-10 h-10 rounded-full bg-white/80 border border-black/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/80 border border-black/10 flex items-center justify-center text-2xl font-bold">
                  G
                </div>
                <div>
                  <div className="font-bold text-lg">Gagan</div>
                  <div className="text-xs text-black/60">India • Remote</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto">
                <StatCard label="Projects" value="3+" />
                <StatCard label="Stack" value="FS" />
              </div>
            </div>
          </div>
        </section>

        {/* TECH */}
        <section id="skills" className="py-10">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold">Tech Stack</h2>
            <div className="text-sm text-black/60">Core tools I use</div>
          </div>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-6 gap-4">
            {tech.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl border border-black/10 shadow-sm p-4 flex flex-col items-center gap-2 hover:shadow-md transition"
              >
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                  {t.icon}
                </div>
                <div className="text-sm font-medium text-center">{t.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="py-10">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold">Featured Projects</h2>
            <div className="text-sm text-black/60">3 selected</div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-40">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 text-xs px-3 py-1.5 rounded-full bg-black text-white">
                    {p.tag}
                  </div>
                </div>

                <div className="p-5">
                  <div className="font-bold">{p.title}</div>
                  <div className="text-sm text-black/60 mt-2">{p.desc}</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.chips.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2.5 py-1 rounded-full bg-black/5 border border-black/10"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RESUME + CHAT */}
        <section id="resume" className="py-10">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resume panel */}
            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Resume</h2>

                <a
                  href="/Gagan_Resume.pdf"
                  download
                  className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full bg-black text-white hover:opacity-90"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>

              {/* REAL upload block (minimal + clean) */}
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  Upload Resume (PDF)
                </label>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setSelectedResumeName(file.name);
                    setUploadStatus("");
                    setUploading(true);

                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      await axios.post(`${API_BASE}/upload-resume`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });
                      setUploadStatus("✅ Resume uploaded successfully!");
                    } catch {
                      setUploadStatus("❌ Upload failed — is backend running?");
                    } finally {
                      setUploading(false);
                    }
                  }}
                  className="border p-2 rounded w-full"
                />

                <div className="mt-2 text-sm text-black/60">
                  {selectedResumeName
                    ? `Selected: ${selectedResumeName}`
                    : "No file selected"}
                </div>

                {uploading && (
                  <div className="mt-2 text-sm text-black/60">Uploading...</div>
                )}

                {uploadStatus && (
                  <div className="mt-2 text-sm font-medium">{uploadStatus}</div>
                )}
              </div>

              <div className="mt-5 rounded-2xl bg-black/5 border border-black/10 p-6">
                <div className="font-semibold">Gagan_Resume.pdf</div>
                <div className="text-xs text-black/60 mt-1">
                  Put your resume at{" "}
                  <span className="font-medium">
                    frontend/public/Gagan_Resume.pdf
                  </span>
                </div>
              </div>
            </div>

            {/* Chat panel */}
            <div className="bg-white rounded-2xl border border-black/10 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">AI Resume Assistant</h2>
                  <p className="text-sm text-black/60 mt-1">
                    Ask anything about my skills, projects, and experience.
                  </p>
                </div>

                <div className="hidden md:flex gap-2">
                  {quickPrompts.map((p) => (
                    <Chip key={p} onClick={() => setQuestion(p)}>
                      {p}
                    </Chip>
                  ))}
                </div>
              </div>

              <div
                ref={listRef}
                className="mt-5 h-72 overflow-y-auto pr-2 space-y-4"
              >
                {messages.length === 0 && (
                  <div className="text-sm text-black/60 bg-black/5 border border-black/10 rounded-2xl p-4">
                    Try:{" "}
                    <span className="font-semibold">
                      “What technologies do you know?”
                    </span>
                  </div>
                )}

                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-black text-white"
                          : "bg-black/5 text-black"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] rounded-2xl px-4 py-3 text-sm bg-black/5 text-black/60">
                      Thinking…
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about skills, projects…"
                  className="flex-1 border border-black/10 rounded-full px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage();
                  }}
                />

                <button
                  onClick={sendMessage}
                  disabled={!question.trim() || loading}
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-full text-sm hover:opacity-90 disabled:opacity-50 transition"
                  type="button"
                >
                  {loading ? "Thinking..." : "Send"} <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-10 pb-16">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#d7ff4f] rounded-[28px] border border-black/10 shadow-sm p-8">
              <h2 className="text-3xl font-extrabold">Let’s work together</h2>
              <p className="mt-3 text-sm text-black/70">
                I’m open for internship opportunities and ready to learn fast.
              </p>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>gagankuakwork@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>India (Remote)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span>9599823239</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  className="w-10 h-10 rounded-full bg-white/80 border border-black/10 flex items-center justify-center hover:bg-white transition"
                  href="#"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  className="w-10 h-10 rounded-full bg-white/80 border border-black/10 flex items-center justify-center hover:bg-white transition"
                  href="#"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-[28px] border border-black/10 shadow-sm p-8">
              <h3 className="text-lg font-bold">Send a message</h3>
              <div className="mt-5 grid gap-3">
                <input
                  className="border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Name"
                />
                <input
                  className="border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Email"
                />
                <input
                  className="border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="Subject"
                />
                <textarea
                  className="border border-black/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10 min-h-[120px]"
                  placeholder="Message"
                />
                <button
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm hover:opacity-90"
                  type="button"
                >
                  Send Message <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-10 text-center text-xs text-black/50">
          © {new Date().getFullYear()} GaganDev • React + FastAPI + PostgreSQL +
          OpenRouter
        </footer>
      </main>
    </div>
  );
}