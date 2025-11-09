// --- Demo data ---------------------------------------------------------------
const posts = [
  {
    id: 1,
    slug: "hello-world",
    title: "Hello World",
    date: "2025-11-01",
    excerpt: "Kicking off our tiny blog with a classic first post.",
    content:
      "Welcome to the simplest blog! Edit the posts array in script.js to change content. Each post has a slug, title, date, excerpt, and content.",
  },
  {
    id: 2,
    slug: "vanilla-routing",
    title: "Vanilla JS Hash Routing",
    date: "2025-11-03",
    excerpt: "No frameworks needed: just listen to hashchange and render.",
    content:
      "We use location.hash (e.g., #/post/slug) and a tiny router. The home route is #/. A 404 renders when no post matches.",
  },
  {
    id: 3,
    slug: "why-we-blog",
    title: "Why We Blog",
    date: "2025-11-07",
    excerpt: "Share ideas, keep notes, learn in public.",
    content:
      "Blogging helps organize thinking and share knowledge. Keep posts short and consistent for momentum.",
  },
];

// --- Utilities ---------------------------------------------------------------
const app = document.getElementById("app");

function html(strings, ...vals) {
  return strings.reduce((acc, s, i) => acc + s + (vals[i] ?? ""), "");
}

function formatDate(iso) {
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString();
}

// --- Views -------------------------------------------------------------------
function HomePage() {
  const list = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  return html`
    <header class="header">
      <h1 class="h1">Latest posts</h1>
      <p class="sub">A super basic blog: list view here, individual post pages via slugs.</p>
    </header>
    <ul class="post-list">
      ${list
        .map(
          (p) => html`
            <li class="post-card">
              <time class="post-date" datetime="${p.date}">${formatDate(p.date)}</time>
              <h2 class="post-title">
                <a href="#/post/${p.slug}">${p.title}</a>
              </h2>
              <p class="post-excerpt">${p.excerpt}</p>
              <div class="read-more"><a href="#/post/${p.slug}">Read more →</a></div>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function PostPage(slug) {
  const post = posts.find((p) => p.slug === slug);
  if (!post) return NotFound();

  return html`
    <article class="article">
      <button class="back" onclick="history.back()">← Back</button>
      <h1>${post.title}</h1>
      <time datetime="${post.date}">${formatDate(post.date)}</time>
      <div class="content">
        <p>${post.content}</p>
      </div>
    </article>
  `;
}

function NotFound() {
  return html`
    <div class="notfound">
      <h1>404 — Not found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
      <div style="margin-top:12px"><a href="#/">Go home</a></div>
    </div>
  `;
}

// --- Tiny Router -------------------------------------------------------------
function parseHash() {
  // Normalize: default to "#/" if empty
  const hash = (location.hash || "#/").replace(/^#/, "");
  const segments = hash.split("/").filter(Boolean); // e.g., ["post", "hello-world"]
  return segments;
}

function render() {
  const segs = parseHash();

  // Route: "/" (home)
  if (segs.length === 0) {
    app.innerHTML = HomePage();
    return;
  }

  // Route: "/post/:slug"
  if (segs[0] === "post" && segs[1]) {
    app.innerHTML = PostPage(segs[1]);
    return;
  }

  // Fallback
  app.innerHTML = NotFound();
}

// Initial render + navigation handling
window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) location.hash = "#/"; // ensure home route
  render();
});
