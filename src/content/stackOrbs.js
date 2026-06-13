export const stackOrbs = {
  'orb-vue': {
    filename: 'App.vue',
    icon: `<svg viewBox="0 0 44 44" fill="none"><path d="M22 4L4 36h12l6-10 6 10h12L22 4z" fill="#41B883"/><path d="M22 4l-6 12-6 12h8l4-7 4 7h8l-6-12-6-12z" fill="#35495E"/></svg>`,
    lines: [
      `<span style="color:#c792ea">&lt;script</span> <span style="color:#82aaff">setup</span><span style="color:#c792ea">&gt;</span>`,
      `<span style="color:#c792ea">import</span> { <span style="color:#82aaff">ref</span> } <span style="color:#c792ea">from</span> <span style="color:#c3e88d">'vue'</span>`,
      ``,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">count</span> = <span style="color:#82aaff">ref</span>(<span style="color:#f78c6c">0</span>)`,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">increment</span> = () => <span style="color:#82aaff">count</span>.value++`,
      ``,
      `<span style="color:#c792ea">&lt;/script&gt;</span>`,
      ``,
      `<span style="color:#c792ea">&lt;template&gt;</span>`,
      `  <span style="color:#89ddff">&lt;button</span> <span style="color:#82aaff">@click</span>=<span style="color:#c3e88d">"increment"</span><span style="color:#89ddff">&gt;</span>{{ count }}<span style="color:#89ddff">&lt;/button&gt;</span>`,
      `<span style="color:#c792ea">&lt;/template&gt;</span>`
    ]
  },
  'orb-nuxt': {
    filename: 'app.vue',
    icon: `<svg viewBox="0 0 44 44" fill="none"><path d="M22 6L4 38h36L22 6z" fill="#00DC82"/><path d="M22 16l-8 14h16l-8-14z" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">&lt;template&gt;</span>`,
      `  <span style="color:#89ddff">&lt;div</span> <span style="color:#82aaff">class</span>=<span style="color:#c3e88d">"container"</span><span style="color:#89ddff">&gt;</span>`,
      `    <span style="color:#89ddff">&lt;NuxtPage</span> <span style="color:#89ddff">/&gt;</span>`,
      `  <span style="color:#89ddff">&lt;/div&gt;</span>`,
      `<span style="color:#c792ea">&lt;/template&gt;</span>`,
      ``,
      `<span style="color:#c792ea">&lt;script</span> <span style="color:#82aaff">setup</span><span style="color:#c792ea">&gt;</span>`,
      `<span style="color:#c792ea">definePageMeta</span>({`,
      `  <span style="color:#82aaff">layout</span>: <span style="color:#c3e88d">'default'</span>`,
      `})`,
      `<span style="color:#c792ea">&lt;/script&gt;</span>`
    ]
  },
  'orb-react': {
    filename: 'App.jsx',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="4" fill="#61dafb"/><ellipse cx="22" cy="22" rx="18" ry="7" stroke="#61dafb" stroke-width="2.5" fill="none"/><ellipse cx="22" cy="22" rx="7" ry="18" stroke="#61dafb" stroke-width="2.5" fill="none" transform="rotate(30 22 22)"/><ellipse cx="22" cy="22" rx="7" ry="18" stroke="#61dafb" stroke-width="2.5" fill="none" transform="rotate(-30 22 22)"/></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> <span style="color:#82aaff">React</span>, { <span style="color:#82aaff">useState</span> } <span style="color:#c792ea">from</span> <span style="color:#c3e88d">'react'</span>`,
      ``,
      `<span style="color:#c792ea">export</span> <span style="color:#c792ea">default</span> <span style="color:#c792ea">function</span> <span style="color:#82aaff">App</span>() {`,
      `  <span style="color:#c792ea">const</span> [<span style="color:#82aaff">count</span>, <span style="color:#82aaff">setCount</span>] = <span style="color:#82aaff">useState</span>(<span style="color:#f78c6c">0</span>)`,
      `  <span style="color:#c792ea">return</span> <span style="color:#89ddff">&lt;button</span> <span style="color:#82aaff">onClick</span>={`,
      `    () => <span style="color:#82aaff">setCount</span>(c => c + <span style="color:#f78c6c">1</span>)`,
      `  }<span style="color:#89ddff">&gt;</span>{count}<span style="color:#89ddff">&lt;/button&gt;</span>`,
      `}`
    ]
  },
  'orb-angular': {
    filename: 'app.component.ts',
    icon: `<svg viewBox="0 0 44 44" fill="none"><path d="M22 4L4 10l4 24 14 6 14-6 4-24L22 4z" fill="#dd0031"/><path d="M22 4L4 10l4 24 14 6V4z" fill="#c3002f"/><text x="22" y="28" text-anchor="middle" fill="#fff" font-family="Arial" font-size="10" font-weight="bold">A</text></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> { <span style="color:#82aaff">Component</span> } <span style="color:#c792ea">from</span> <span style="color:#c3e88d">'@angular/core'</span>`,
      ``,
      `<span style="color:#c792ea">@Component</span>({`,
      `  <span style="color:#82aaff">selector</span>: <span style="color:#c3e88d">'app-root'</span>,`,
      `  <span style="color:#82aaff">template</span>: <span style="color:#c3e88d">'&lt;h1&gt;{{title}}&lt;/h1&gt;'</span>`,
      `})`,
      `<span style="color:#c792ea">export</span> <span style="color:#c792ea">class</span> <span style="color:#ffcb6b">AppComponent</span> {`,
      `  <span style="color:#82aaff">title</span> = <span style="color:#c3e88d">'Angular App'</span>`,
      `}`
    ]
  },
  'orb-js': {
    filename: 'main.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="6" y="6" width="32" height="32" rx="4" fill="#f7df1e"/><path d="M18 30v-8h2v8h-2zm6-2v-6h2v2h2v4h-2v-2h-2z" fill="#000"/></svg>`,
    lines: [
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">fetchData</span> = <span style="color:#c792ea">async</span> (<span style="color:#82aaff">url</span>) => {`,
      `  <span style="color:#c792ea">try</span> {`,
      `    <span style="color:#c792ea">const</span> <span style="color:#82aaff">res</span> = <span style="color:#c792ea">await</span> <span style="color:#82aaff">fetch</span>(url)`,
      `    <span style="color:#c792ea">return</span> <span style="color:#c792ea">await</span> <span style="color:#82aaff">res</span>.<span style="color:#82aaff">json</span>()`,
      `  } <span style="color:#c792ea">catch</span> (<span style="color:#82aaff">err</span>) {`,
      `    <span style="color:#82aaff">console</span>.<span style="color:#c792ea">error</span>(err)`,
      `  }`,
      `}`,
      ``,
      `<span style="color:#c792ea">export</span> <span style="color:#c792ea">default</span> <span style="color:#82aaff">fetchData</span>`
    ]
  },
  'orb-laravel': {
    filename: 'Post.php',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="4" y="10" width="36" height="24" rx="4" fill="#ff2d20"/><path d="M28 16h4l-6 8 6 8h-4l-6-8 6-8zm-12 0h4l-6 8 6 8h-4l-6-8 6-8z" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">&lt;?php</span>`,
      ``,
      `<span style="color:#c792ea">namespace</span> <span style="color:#82aaff">App\\Models</span>;`,
      ``,
      `<span style="color:#c792ea">class</span> <span style="color:#ffcb6b">Post</span> <span style="color:#c792ea">extends</span> <span style="color:#82aaff">Model</span> {`,
      `  <span style="color:#c792ea">protected</span> <span style="color:#82aaff">$fillable</span> = [<span style="color:#c3e88d">'title'</span>, <span style="color:#c3e88d">'body'</span>];`,
      ``,
      `  <span style="color:#c792ea">public function</span> <span style="color:#82aaff">user</span>() {`,
      `    <span style="color:#c792ea">return</span> <span style="color:#82aaff">$this</span>-><span style="color:#82aaff">belongsTo</span>(<span style="color:#82aaff">User</span>::<span style="color:#82aaff">class</span>);`,
      `  }`,
      `}`
    ]
  },
  'orb-node': {
    filename: 'server.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><ellipse cx="22" cy="22" rx="16" ry="16" fill="#68a063"/><path d="M22 10l10 6v12l-10 6-10-6V16l10-6z" fill="#333"/><path d="M22 14l6 3.5v7l-6 3.5-6-3.5v-7l6-3.5z" fill="#68a063"/></svg>`,
    lines: [
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">express</span> = <span style="color:#82aaff">require</span>(<span style="color:#c3e88d">'express'</span>)`,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">app</span> = <span style="color:#82aaff">express</span>()`,
      ``,
      `<span style="color:#82aaff">app</span>.<span style="color:#82aaff">get</span>(<span style="color:#c3e88d">'/api'</span>, (<span style="color:#82aaff">req</span>, <span style="color:#82aaff">res</span>) => {`,
      `  <span style="color:#82aaff">res</span>.<span style="color:#82aaff">json</span>({ <span style="color:#82aaff">message</span>: <span style="color:#c3e88d">'Hello'</span> })`,
      `})`,
      ``,
      `<span style="color:#82aaff">app</span>.<span style="color:#82aaff">listen</span>(<span style="color:#f78c6c">3000</span>)`
    ]
  },
  'orb-docker': {
    filename: 'Dockerfile',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#2496ed"/><path d="M14 18h3v3h-3zm5-3h3v3h-3zm0 5h3v3h-3zm5-5h3v3h-3zm0 5h3v3h-3zm5-3h3v3h-3zm-15 5h3v3h-3zm5 0h3v3h-3z" fill="#fff"/><path d="M12 23c0 4 3 7 10 7s6-3 6-3" stroke="#fff" stroke-width="2" fill="none"/></svg>`,
    lines: [
      `<span style="color:#c792ea">FROM</span> <span style="color:#82aaff">node:20-alpine</span>`,
      ``,
      `<span style="color:#82aaff">WORKDIR</span> <span style="color:#c3e88d">/app</span>`,
      `<span style="color:#82aaff">COPY</span> package.json .`,
      `<span style="color:#82aaff">RUN</span> <span style="color:#82aaff">pnpm install</span>`,
      `<span style="color:#82aaff">COPY</span> . .`,
      ``,
      `<span style="color:#82aaff">EXPOSE</span> <span style="color:#f78c6c">3000</span>`,
      `<span style="color:#82aaff">CMD</span> [<span style="color:#c3e88d">"node"</span>, <span style="color:#c3e88d">"server.js"</span>]`
    ]
  },
  'orb-api': {
    filename: 'api.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="6" y="12" width="10" height="20" rx="3" fill="#5cf2ff"/><rect x="28" y="12" width="10" height="20" rx="3" fill="#5cf2ff"/><path d="M16 22h12" stroke="#fff" stroke-width="3"/><circle cx="22" cy="14" r="3" fill="#fff"/><circle cx="22" cy="30" r="3" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> <span style="color:#82aaff">axios</span> <span style="color:#c792ea">from</span> <span style="color:#c3e88d">'axios'</span>`,
      ``,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">api</span> = <span style="color:#82aaff">axios</span>.<span style="color:#82aaff">create</span>({`,
      `  <span style="color:#82aaff">baseURL</span>: <span style="color:#c3e88d">'/api/v1'</span>,`,
      `  <span style="color:#82aaff">timeout</span>: <span style="color:#f78c6c">5000</span>`,
      `})`,
      ``,
      `<span style="color:#82aaff">api</span>.<span style="color:#c792ea">get</span>(<span style="color:#c3e88d">'/users'</span>)`,
      `  .<span style="color:#82aaff">then</span>(<span style="color:#82aaff">res</span> => res.data)`,
      `  .<span style="color:#c792ea">catch</span>(<span style="color:#82aaff">handleError</span>)`
    ]
  },
  'orb-pgsql': {
    filename: 'schema.sql',
    icon: `<svg viewBox="0 0 44 44" fill="none"><ellipse cx="22" cy="14" rx="16" ry="8" fill="#6df7c8"/><path d="M6 14v16c0 4.4 7.2 8 16 8s16-3.6 16-8V14" fill="#6df7c8" opacity="0.6"/><path d="M6 22c0 4.4 7.2 8 16 8s16-3.6 16-8" fill="none" stroke="#1a1a2e" stroke-width="1.5"/></svg>`,
    lines: [
      `<span style="color:#c792ea">CREATE TABLE</span> <span style="color:#82aaff">users</span> (`,
      `  <span style="color:#82aaff">id</span> <span style="color:#89ddff">SERIAL PRIMARY KEY</span>,`,
      `  <span style="color:#82aaff">name</span> <span style="color:#89ddff">VARCHAR</span>(<span style="color:#f78c6c">120</span>) <span style="color:#c792ea">NOT NULL</span>,`,
      `  <span style="color:#82aaff">email</span> <span style="color:#89ddff">VARCHAR</span>(<span style="color:#f78c6c">255</span>) <span style="color:#c792ea">UNIQUE</span>,`,
      `  <span style="color:#82aaff">created_at</span> <span style="color:#89ddff">TIMESTAMP</span> <span style="color:#c792ea">DEFAULT NOW()</span>`,
      `);`,
      ``,
      `<span style="color:#c792ea">CREATE INDEX</span> <span style="color:#82aaff">idx_email</span>`,
      `<span style="color:#c792ea">ON</span> <span style="color:#82aaff">users</span>(email);`
    ]
  },
  'orb-mysql': {
    filename: 'query.sql',
    icon: `<svg viewBox="0 0 44 44" fill="none"><ellipse cx="22" cy="14" rx="16" ry="8" fill="#84b6ff"/><path d="M6 14v16c0 4.4 7.2 8 16 8s16-3.6 16-8V14" fill="#84b6ff" opacity="0.6"/><path d="M6 22c0 4.4 7.2 8 16 8s16-3.6 16-8" fill="none" stroke="#1a1a2e" stroke-width="1.5"/></svg>`,
    lines: [
      `<span style="color:#c792ea">SELECT</span>`,
      `  <span style="color:#82aaff">p</span>.<span style="color:#82aaff">title</span>,`,
      `  <span style="color:#82aaff">u</span>.<span style="color:#82aaff">name</span> <span style="color:#c792ea">AS</span> <span style="color:#c3e88d">author</span>,`,
      `  <span style="color:#82aaff">COUNT</span>(<span style="color:#82aaff">c</span>.<span style="color:#82aaff">id</span>) <span style="color:#c792ea">AS</span> <span style="color:#c3e88d">count</span>`,
      `<span style="color:#c792ea">FROM</span> <span style="color:#82aaff">posts</span> <span style="color:#82aaff">p</span>`,
      `<span style="color:#c792ea">LEFT JOIN</span> <span style="color:#82aaff">comments</span> <span style="color:#82aaff">c</span>`,
      `  <span style="color:#c792ea">ON</span> <span style="color:#82aaff">c</span>.<span style="color:#82aaff">post_id</span> = <span style="color:#82aaff">p</span>.<span style="color:#82aaff">id</span>`,
      `<span style="color:#c792ea">GROUP BY</span> <span style="color:#82aaff">p</span>.<span style="color:#82aaff">title</span>;`
    ]
  },
  'orb-oracle': {
    filename: 'schema.sql',
    icon: `<svg viewBox="0 0 44 44" fill="none"><ellipse cx="22" cy="14" rx="16" ry="8" fill="#f80000"/><path d="M6 14v16c0 4.4 7.2 8 16 8s16-3.6 16-8V14" fill="#f80000" opacity="0.6"/><text x="22" y="20" text-anchor="middle" fill="#fff" font-family="Arial" font-size="7" font-weight="bold">ORA</text></svg>`,
    lines: [
      `<span style="color:#c792ea">CREATE TABLE</span> <span style="color:#82aaff">employees</span> (`,
      `  <span style="color:#82aaff">emp_id</span> <span style="color:#89ddff">NUMBER PRIMARY KEY</span>,`,
      `  <span style="color:#82aaff">name</span> <span style="color:#89ddff">VARCHAR2</span>(<span style="color:#f78c6c">100</span>) <span style="color:#c792ea">NOT NULL</span>,`,
      `  <span style="color:#82aaff">hire_date</span> <span style="color:#89ddff">DATE DEFAULT SYSDATE</span>`,
      `);`,
      ``,
      `<span style="color:#c792ea">CREATE INDEX</span> <span style="color:#82aaff">idx_name</span>`,
      `<span style="color:#c792ea">ON</span> <span style="color:#82aaff">employees</span>(name);`
    ]
  },
  'orb-html': {
    filename: 'styles.css',
    icon: `<svg viewBox="0 0 44 44" fill="none"><path d="M6 4l3 32 13 4 13-4 3-32H6z" fill="#e44d26"/><path d="M36 6H22v33l9-3 2-30z" fill="#f16529"/><text x="22" y="21" text-anchor="middle" fill="#fff" font-family="Arial" font-size="10" font-weight="bold">H5</text></svg>`,
    lines: [
      `<span style="color:#89ddff">.container</span> {`,
      `  <span style="color:#82aaff">display</span>: <span style="color:#89ddff">grid</span>;`,
      `  <span style="color:#82aaff">grid-template</span>: <span style="color:#82aaff">repeat</span>(<span style="color:#f78c6c">3</span>, <span style="color:#f78c6c">1fr</span>) /`,
      `    <span style="color:#82aaff">auto</span>;`,
      `  <span style="color:#82aaff">gap</span>: <span style="color:#f78c6c">1.5rem</span>;`,
      `  <span style="color:#82aaff">padding</span>: <span style="color:#f78c6c">2rem</span>;`,
      `}`,
      ``,
      `<span style="color:#89ddff">.card</span> {`,
      `  <span style="color:#82aaff">background</span>: <span style="color:#c792ea">var</span>(<span style="color:#c3e88d">--surface</span>);`,
      `  <span style="color:#82aaff">border-radius</span>: <span style="color:#f78c6c">12px</span>;`,
      `}`
    ]
  },
  'orb-git': {
    filename: 'sprint.md',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="16" fill="#b4ff8a" opacity="0.8"/><path d="M14 22l4 4 8-8" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    lines: [
      `<span style="color:#676e95"># Sprint Backlog</span>`,
      ``,
      `<span style="color:#c792ea">-</span> [ ] <span style="color:#eeffff">Configurar CI/CD</span>`,
      `<span style="color:#c792ea">-</span> [<span style="color:#89ddff">x</span>] <span style="color:#eeffff">Autenticacion OAuth</span>`,
      `<span style="color:#c792ea">-</span> [ ] <span style="color:#eeffff">Pruebas unitarias</span>`,
      `<span style="color:#c792ea">-</span> [ ] <span style="color:#eeffff">Documentar</span>`,
      `<span style="color:#c792ea">-</span> [<span style="color:#89ddff">x</span>] <span style="color:#eeffff">Diseno responsive</span>`,
      ``,
      `<span style="color:#676e95">## Review: Jueves</span>`,
      `<span style="color:#676e95">## Retro: Viernes</span>`
    ]
  },
  'orb-bootstrap': {
    filename: 'index.html',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="8" y="4" width="28" height="36" rx="6" fill="#7952b3"/><path d="M16 12h8a4 4 0 013.5 2.2A4 4 0 0126 22l-2 2h4a4 4 0 010 8H16V12zm6 8h2a2 2 0 000-4h-2v4zm0 8h3a2 2 0 000-4h-3v4z" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#89ddff">&lt;div</span> <span style="color:#82aaff">class</span>=<span style="color:#c3e88d">"container"</span><span style="color:#89ddff">&gt;</span>`,
      `  <span style="color:#89ddff">&lt;div</span> <span style="color:#82aaff">class</span>=<span style="color:#c3e88d">"row"</span><span style="color:#89ddff">&gt;</span>`,
      `    <span style="color:#89ddff">&lt;div</span> <span style="color:#82aaff">class</span>=<span style="color:#c3e88d">"col-md-6"</span><span style="color:#89ddff">&gt;</span>`,
      `      <span style="color:#89ddff">&lt;button</span> <span style="color:#82aaff">class</span>=<span style="color:#c3e88d">"btn btn-primary"</span><span style="color:#89ddff">&gt;</span>`,
      `        Click me`,
      `      <span style="color:#89ddff">&lt;/button&gt;</span>`,
      `    <span style="color:#89ddff">&lt;/div&gt;</span>`,
      `  <span style="color:#89ddff">&lt;/div&gt;</span>`,
      `<span style="color:#89ddff">&lt;/div&gt;</span>`
    ]
  },
  'orb-materialize': {
    filename: 'index.html',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#ee6e73"/><path d="M14 18l4-4h8l4 4-8 14-8-14z" fill="#fff"/><rect x="20" y="10" width="4" height="6" rx="2" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#89ddff">&lt;div</span> <span style="color:#82aaff">class</span>=<span style="color:#c3e88d">"card"</span><span style="color:#89ddff">&gt;</span>`,
      `  <span style="color:#89ddff">&lt;div</span> <span style="color:#82aaff">class</span>=<span style="color:#c3e88d">"card-content"</span><span style="color:#89ddff">&gt;</span>`,
      `    <span style="color:#89ddff">&lt;h5&gt;</span>Materialize<span style="color:#89ddff">&lt;/h5&gt;</span>`,
      `    <span style="color:#89ddff">&lt;p&gt;</span>Modern responsive<span style="color:#89ddff">&lt;/p&gt;</span>`,
      `  <span style="color:#89ddff">&lt;/div&gt;</span>`,
      `  <span style="color:#89ddff">&lt;div</span> <span style="color:#82aaff">class</span>=<span style="color:#c3e88d">"card-action"</span><span style="color:#89ddff">&gt;</span>`,
      `    <span style="color:#89ddff">&lt;a</span> <span style="color:#82aaff">href</span>=<span style="color:#c3e88d">"#"</span><span style="color:#89ddff">&gt;</span>Link<span style="color:#89ddff">&lt;/a&gt;</span>`,
      `  <span style="color:#89ddff">&lt;/div&gt;</span>`,
      `<span style="color:#89ddff">&lt;/div&gt;</span>`
    ]
  },
  'orb-redux': {
    filename: 'store.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#764abc"/><path d="M22 10c-4.4 0-8 2.7-8 6 0 2 1.3 3.8 3.3 4.9A8 8 0 0016 24c0 3.3 3.6 6 8 6s8-2.7 8-6c0-1.1-.4-2.2-1-3.1 2-.9 3-2.7 3-4.9 0-3.3-3.6-6-8-6z" fill="#fff" opacity="0.9"/><path d="M20 18l4 2.5-4 2.5v-5z" fill="#764abc"/></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> { <span style="color:#82aaff">createStore</span> } <span style="color:#c792ea">from</span> <span style="color:#c3e88d">'redux'</span>`,
      ``,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">reducer</span> = (<span style="color:#82aaff">state</span> = { <span style="color:#82aaff">count</span>: <span style="color:#f78c6c">0</span> }, <span style="color:#82aaff">action</span>) => {`,
      `  <span style="color:#c792ea">switch</span> (<span style="color:#82aaff">action</span>.<span style="color:#82aaff">type</span>) {`,
      `    <span style="color:#c792ea">case</span> <span style="color:#c3e88d">'INCREMENT'</span>:`,
      `      <span style="color:#c792ea">return</span> { ...state, <span style="color:#82aaff">count</span>: state.count + <span style="color:#f78c6c">1</span> }`,
      `    <span style="color:#c792ea">default</span>:`,
      `      <span style="color:#c792ea">return</span> state`,
      `  }`,
      `}`
    ]
  },
  'orb-vuex': {
    filename: 'store.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><path d="M22 4L4 36h36L22 4z" fill="#41B883"/><path d="M22 4l-6 12-6 12h8l4-7 4 7h8l-6-12-6-12z" fill="#35495E"/></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> { <span style="color:#82aaff">createStore</span> } <span style="color:#c792ea">from</span> <span style="color:#c3e88d">'vuex'</span>`,
      ``,
      `<span style="color:#c792ea">export</span> <span style="color:#c792ea">default</span> <span style="color:#82aaff">createStore</span>({`,
      `  <span style="color:#82aaff">state</span>: { <span style="color:#82aaff">count</span>: <span style="color:#f78c6c">0</span> },`,
      `  <span style="color:#82aaff">mutations</span>: {`,
      `    <span style="color:#82aaff">increment</span>(<span style="color:#82aaff">state</span>) {`,
      `      <span style="color:#82aaff">state</span>.count++`,
      `    }`,
      `  },`,
      `  <span style="color:#82aaff">actions</span>: {`,
      `    <span style="color:#82aaff">incrementAsync</span>({ <span style="color:#82aaff">commit</span> }) {`,
      `      <span style="color:#82aaff">setTimeout</span>(() => <span style="color:#82aaff">commit</span>(<span style="color:#c3e88d">'increment'</span>), <span style="color:#f78c6c">1000</span>)`,
      `    }`,
      `  }`,
      `})`
    ]
  },
  'orb-three': {
    filename: 'scene.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="4" y="4" width="36" height="36" rx="6" fill="#1a1a2e"/><polygon points="22,10 30,30 14,30" fill="#ff8df6" opacity="0.8"/><polygon points="22,14 27,26 17,26" fill="none" stroke="#ff8df6" stroke-width="1.5"/><circle cx="22" cy="22" r="2" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> * <span style="color:#c792ea">as</span> <span style="color:#82aaff">THREE</span> <span style="color:#c792ea">from</span> <span style="color:#c3e88d">'three'</span>`,
      ``,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">scene</span> = <span style="color:#c792ea">new</span> <span style="color:#82aaff">THREE</span>.<span style="color:#82aaff">Scene</span>()`,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">camera</span> = <span style="color:#c792ea">new</span> <span style="color:#82aaff">THREE</span>.<span style="color:#82aaff">PerspectiveCamera</span>(<span style="color:#f78c6c">75</span>, <span style="color:#82aaff">w</span>/<span style="color:#82aaff">h</span>, <span style="color:#f78c6c">0.1</span>, <span style="color:#f78c6c">1000</span>)`,
      ``,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">geo</span> = <span style="color:#c792ea">new</span> <span style="color:#82aaff">THREE</span>.<span style="color:#82aaff">BoxGeometry</span>(<span style="color:#f78c6c">1</span>, <span style="color:#f78c6c">1</span>, <span style="color:#f78c6c">1</span>)`,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">mat</span> = <span style="color:#c792ea">new</span> <span style="color:#82aaff">THREE</span>.<span style="color:#82aaff">MeshStandardMaterial</span>({ <span style="color:#82aaff">color</span>: <span style="color:#f78c6c">0xff33d4</span> })`,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">cube</span> = <span style="color:#c792ea">new</span> <span style="color:#82aaff">THREE</span>.<span style="color:#82aaff">Mesh</span>(geo, mat)`,
      `<span style="color:#82aaff">scene</span>.<span style="color:#82aaff">add</span>(cube)`
    ]
  },
  'orb-php': {
    filename: 'index.php',
    icon: `<svg viewBox="0 0 44 44" fill="none"><ellipse cx="22" cy="22" rx="18" ry="16" fill="#8892bf"/><text x="22" y="28" text-anchor="middle" fill="#fff" font-family="Arial" font-size="16" font-weight="bold">PHP</text></svg>`,
    lines: [
      `<span style="color:#c792ea">&lt;?php</span>`,
      ``,
      `<span style="color:#c792ea">namespace</span> <span style="color:#82aaff">App\\Http\\Controllers</span>;`,
      ``,
      `<span style="color:#c792ea">class</span> <span style="color:#ffcb6b">UserController</span> {`,
      `  <span style="color:#c792ea">public function</span> <span style="color:#82aaff">index</span>() {`,
      `    <span style="color:#c792ea">return</span> <span style="color:#82aaff">User</span>::<span style="color:#82aaff">all</span>();`,
      `  }`,
      `}`
    ]
  },
  'orb-tailwind': {
    filename: 'tailwind.config.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#38bdf8"/><path d="M16 26c0-4 2-6 4-6s4 2 4 4c0-4 2-6 4-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M12 30c0-4 2-6 4-6s4 2 4 4c0-4 2-6 4-6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.6"/></svg>`,
    lines: [
      `<span style="color:#c792ea">export</span> <span style="color:#c792ea">default</span> {`,
      `  <span style="color:#82aaff">content</span>: [<span style="color:#c3e88d">'./src/**/*.vue'</span>],`,
      `  <span style="color:#82aaff">theme</span>: {`,
      `    <span style="color:#82aaff">extend</span>: {`,
      `      <span style="color:#82aaff">colors</span>: {`,
      `        <span style="color:#82aaff">primary</span>: <span style="color:#c3e88d">'#ff33d4'</span>`,
      `      }`,
      `    }`,
      `  }`,
      `}`
    ]
  },
  'orb-cursor': {
    filename: '.cursorrules',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="8" y="6" width="28" height="32" rx="4" fill="#1a1a2e" stroke="#b4ff8a" stroke-width="1.5"/><path d="M14 16h16v2H14zm0 6h12v2H14zm0 6h14v2H14z" fill="#b4ff8a" opacity="0.7"/></svg>`,
    lines: [
      `<span style="color:#676e95"># Cursor IDE</span>`,
      ``,
      `<span style="color:#c792ea">Convenciones:</span>`,
      `  <span style="color:#c792ea">-</span> <span style="color:#eeffff">Vue 3 Composition API</span>`,
      `  <span style="color:#c792ea">-</span> <span style="color:#eeffff">Tailwind v4</span>`,
      `  <span style="color:#c792ea">-</span> <span style="color:#eeffff">Sin console.log</span>`,
      `  <span style="color:#c792ea">-</span> <span style="color:#eeffff">Variables en ingles</span>`,
      `  <span style="color:#c792ea">-</span> <span style="color:#eeffff">Desarrollo asistido por IA</span>`
    ]
  },
  'orb-coderabbit': {
    filename: 'codereview.yml',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#ff6b6b"/><path d="M16 18l6 6 6-6" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22" cy="12" r="2" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#676e95"># CodeRabbit AI Review</span>`,
      ``,
      `<span style="color:#c792ea">review:</span>`,
      `  <span style="color:#82aaff">auto_approve</span>: <span style="color:#89ddff">false</span>`,
      `  <span style="color:#82aaff">max_complexity</span>: <span style="color:#f78c6c">10</span>`,
      `  <span style="color:#82aaff">security</span>:`,
      `    <span style="color:#82aaff">check_sensitive</span>: <span style="color:#89ddff">true</span>`
    ]
  },
  'orb-pnpm': {
    filename: 'package.json',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="4" y="4" width="36" height="36" rx="6" fill="#f69220"/><rect x="10" y="10" width="8" height="8" fill="#fff"/><rect x="22" y="10" width="8" height="8" fill="#fff"/><rect x="10" y="22" width="8" height="8" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">{</span>`,
      `  <span style="color:#c3e88d">"packageManager"</span>: <span style="color:#c3e88d">"pnpm@9"</span>,`,
      `  <span style="color:#c3e88d">"scripts"</span>: {`,
      `    <span style="color:#c3e88d">"dev"</span>: <span style="color:#c3e88d">"vue-cli-service serve"</span>,`,
      `    <span style="color:#c3e88d">"format"</span>: <span style="color:#c3e88d">"prettier --write src"</span>`,
      `  }`,
      `}`
    ]
  },
  'orb-linux': {
    filename: 'bash.sh',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#1793d1"/><text x="22" y="28" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12" font-weight="bold">&#x5f;&#x5f;</text></svg>`,
    lines: [
      `<span style="color:#89ddff">$</span> <span style="color:#82aaff">npm run dev</span>`,
      `<span style="color:#89ddff">$</span> <span style="color:#82aaff">pnpm build</span>`,
      `<span style="color:#89ddff">$</span> <span style="color:#82aaff">docker compose up</span>`,
      `<span style="color:#89ddff">$</span> <span style="color:#82aaff">systemctl status</span>`,
      ``,
      `<span style="color:#676e95"># Administración Linux/Windows</span>`,
      `<span style="color:#c792ea">alias</span> <span style="color:#82aaff">ga</span>=<span style="color:#c3e88d">'git add .'</span>`
    ]
  },
  'orb-canvas': {
    filename: 'canvas.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="4" y="4" width="36" height="36" rx="4" fill="#1a1a2e"/><rect x="8" y="8" width="28" height="28" fill="none" stroke="#5cf2ff" stroke-width="2"/><circle cx="18" cy="20" r="5" fill="#5cf2ff" opacity="0.6"/><rect x="24" y="16" width="8" height="12" fill="#ff8df6" opacity="0.6"/></svg>`,
    lines: [
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">canvas</span> = <span style="color:#82aaff">document</span>.<span style="color:#82aaff">getElementById</span>(<span style="color:#c3e88d">'c'</span>)`,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">ctx</span> = <span style="color:#82aaff">canvas</span>.<span style="color:#82aaff">getContext</span>(<span style="color:#c3e88d">'2d'</span>)`,
      ``,
      `<span style="color:#82aaff">ctx</span>.<span style="color:#82aaff">fillStyle</span> = <span style="color:#c3e88d">'#ff33d4'</span>`,
      `<span style="color:#82aaff">ctx</span>.<span style="color:#82aaff">fillRect</span>(<span style="color:#f78c6c">0</span>, <span style="color:#f78c6c">0</span>, <span style="color:#f78c6c">100</span>, <span style="color:#f78c6c">100</span>)`,
      ``,
      `<span style="color:#c792ea">function</span> <span style="color:#82aaff">animate</span>() {`,
      `  <span style="color:#82aaff">requestAnimationFrame</span>(animate)`,
      `}`
    ]
  },
  'orb-css': {
    filename: 'styles.css',
    icon: `<svg viewBox="0 0 44 44" fill="none"><path d="M6 4l3 32 13 4 13-4 3-32H6z" fill="#264de4"/><path d="M36 6H22v33l9-3 2-30z" fill="#2965f1"/><text x="22" y="21" text-anchor="middle" fill="#fff" font-family="Arial" font-size="10" font-weight="bold">CSS</text></svg>`,
    lines: [
      `<span style="color:#89ddff">.block</span> {`,
      `  <span style="color:#82aaff">display</span>: <span style="color:#89ddff">flex</span>;`,
      `  <span style="color:#82aaff">gap</span>: <span style="color:#82aaff">var</span>(<span style="color:#c3e88d">--space</span>);`,
      `}`,
      ``,
      `<span style="color:#676e95">/* BEM */</span>`,
      `<span style="color:#89ddff">.block__element--modifier</span> {`,
      `  <span style="color:#82aaff">color</span>: <span style="color:#c792ea">var</span>(<span style="color:#c3e88d">--accent</span>);`,
      `}`
    ]
  },
  'orb-vuetify': {
    filename: 'vuetify.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><rect x="4" y="4" width="36" height="36" rx="8" fill="#1867c0"/><path d="M14 32l8-20 8 20" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 24l4-8 4 8" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`,
    lines: [
      `<span style="color:#c792ea">&lt;template&gt;</span>`,
      `  <span style="color:#89ddff">&lt;v-btn</span> <span style="color:#82aaff">color</span>=<span style="color:#c3e88d">"primary"</span>`,
      `    <span style="color:#82aaff">@click</span>=<span style="color:#c3e88d">"dialog = true"</span><span style="color:#89ddff">&gt;</span>`,
      `    Open Dialog`,
      `  <span style="color:#89ddff">&lt;/v-btn&gt;</span>`,
      ``,
      `  <span style="color:#89ddff">&lt;v-dialog</span> <span style="color:#82aaff">v-model</span>=<span style="color:#c3e88d">"dialog"</span><span style="color:#89ddff">&gt;</span>`,
      `    <span style="color:#89ddff">&lt;v-card&gt;</span>Contenido<span style="color:#89ddff">&lt;/v-card&gt;</span>`,
      `  <span style="color:#89ddff">&lt;/v-dialog&gt;</span>`,
      `<span style="color:#c792ea">&lt;/template&gt;</span>`
    ]
  },
  'orb-sql': {
    filename: 'query.sql',
    icon: `<svg viewBox="0 0 44 44" fill="none"><ellipse cx="22" cy="14" rx="16" ry="8" fill="#6df7c8"/><path d="M6 14v16c0 4.4 7.2 8 16 8s16-3.6 16-8V14" fill="#6df7c8" opacity="0.6"/><text x="22" y="24" text-anchor="middle" fill="#1a1a2e" font-family="Arial" font-size="9" font-weight="bold">SQL</text></svg>`,
    lines: [
      `<span style="color:#c792ea">SELECT</span>`,
      `  <span style="color:#82aaff">u</span>.<span style="color:#82aaff">name</span>,`,
      `  <span style="color:#82aaff">COUNT</span>(<span style="color:#82aaff">o</span>.<span style="color:#82aaff">id</span>) <span style="color:#c792ea">AS</span> <span style="color:#c3e88d">orders</span>`,
      `<span style="color:#c792ea">FROM</span> <span style="color:#82aaff">users</span> <span style="color:#82aaff">u</span>`,
      `<span style="color:#c792ea">LEFT JOIN</span> <span style="color:#82aaff">orders</span> <span style="color:#82aaff">o</span>`,
      `  <span style="color:#c792ea">ON</span> <span style="color:#82aaff">u</span>.<span style="color:#82aaff">id</span> = <span style="color:#82aaff">o</span>.<span style="color:#82aaff">user_id</span>`,
      `<span style="color:#c792ea">GROUP BY</span> <span style="color:#82aaff">u</span>.<span style="color:#82aaff">name</span>;`
    ]
  },
  'orb-c': {
    filename: 'main.c',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#555555"/><text x="22" y="28" text-anchor="middle" fill="#fff" font-family="Arial" font-size="12" font-weight="bold">C</text></svg>`,
    lines: [
      `<span style="color:#c792ea">#include</span> <span style="color:#c3e88d">&lt;stdio.h&gt;</span>`,
      ``,
      `<span style="color:#c792ea">int</span> <span style="color:#82aaff">main</span>() {`,
      `  <span style="color:#82aaff">printf</span>(<span style="color:#c3e88d">"Hola mundo\\n"</span>);`,
      `  <span style="color:#c792ea">return</span> <span style="color:#f78c6c">0</span>;`,
      `}`
    ]
  },
  'orb-cpp': {
    filename: 'main.cpp',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#00599c"/><text x="22" y="28" text-anchor="middle" fill="#fff" font-family="Arial" font-size="11" font-weight="bold">C++</text></svg>`,
    lines: [
      `<span style="color:#c792ea">#include</span> <span style="color:#c3e88d">&lt;iostream&gt;</span>`,
      `<span style="color:#c792ea">using namespace</span> <span style="color:#82aaff">std</span>;`,
      ``,
      `<span style="color:#c792ea">int</span> <span style="color:#82aaff">main</span>() {`,
      `  <span style="color:#82aaff">cout</span> &lt;&lt; <span style="color:#c3e88d">"Hola mundo"</span>;`,
      `  <span style="color:#c792ea">return</span> <span style="color:#f78c6c">0</span>;`,
      `}`
    ]
  },
  'orb-csharp': {
    filename: 'Program.cs',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#239120"/><text x="22" y="28" text-anchor="middle" fill="#fff" font-family="Arial" font-size="11" font-weight="bold">C#</text></svg>`,
    lines: [
      `<span style="color:#c792ea">using</span> <span style="color:#82aaff">System</span>;`,
      ``,
      `<span style="color:#c792ea">class</span> <span style="color:#ffcb6b">Program</span> {`,
      `  <span style="color:#c792ea">static void</span> <span style="color:#82aaff">Main</span>() {`,
      `    <span style="color:#82aaff">Console</span>.<span style="color:#82aaff">WriteLine</span>(<span style="color:#c3e88d">"Hola"</span>);`,
      `  }`,
      `}`
    ]
  },
  'orb-java': {
    filename: 'Main.java',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#ed8b00"/><text x="22" y="28" text-anchor="middle" fill="#fff" font-family="Arial" font-size="10" font-weight="bold">Java</text></svg>`,
    lines: [
      `<span style="color:#c792ea">public class</span> <span style="color:#ffcb6b">Main</span> {`,
      `  <span style="color:#c792ea">public static void</span> <span style="color:#82aaff">main</span>(<span style="color:#89ddff">String</span>[] <span style="color:#82aaff">args</span>) {`,
      `    <span style="color:#82aaff">System</span>.<span style="color:#82aaff">out</span>.<span style="color:#82aaff">println</span>(<span style="color:#c3e88d">"Hola"</span>);`,
      `  }`,
      `}`
    ]
  },
  'orb-huggingface': {
    filename: 'hf.py',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#ffd21e"/><path d="M14 26s2-6 8-6 8 6 8 6" fill="none" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round"/><circle cx="18" cy="16" r="2" fill="#1a1a2e"/><circle cx="26" cy="16" r="2" fill="#1a1a2e"/></svg>`,
    lines: [
      `<span style="color:#c792ea">from</span> <span style="color:#82aaff">transformers</span> <span style="color:#c792ea">import</span> <span style="color:#82aaff">pipeline</span>`,
      ``,
      `<span style="color:#82aaff">classifier</span> = <span style="color:#82aaff">pipeline</span>(<span style="color:#c3e88d">'text-classification'</span>,`,
      `  <span style="color:#82aaff">model</span>=<span style="color:#c3e88d">'distilbert-base-uncased'</span>)`,
      ``,
      `<span style="color:#82aaff">result</span> = <span style="color:#82aaff">classifier</span>(<span style="color:#c3e88d">"Amazing!"</span>)`
    ]
  },
  'orb-openai': {
    filename: 'api.py',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#10a37f"/><path d="M16 28V16l12 6-12 6z" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">from</span> <span style="color:#82aaff">openai</span> <span style="color:#c792ea">import</span> <span style="color:#82aaff">OpenAI</span>`,
      ``,
      `<span style="color:#82aaff">client</span> = <span style="color:#82aaff">OpenAI</span>()`,
      ``,
      `<span style="color:#82aaff">response</span> = <span style="color:#82aaff">client</span>.<span style="color:#82aaff">chat</span>.<span style="color:#82aaff">completions</span>.<span style="color:#82aaff">create</span>(`,
      `  <span style="color:#82aaff">model</span>=<span style="color:#c3e88d">'gpt-4'</span>,`,
      `  <span style="color:#82aaff">messages</span>=[{<span style="color:#c3e88d">'role'</span>: <span style="color:#c3e88d">'user'</span>, <span style="color:#c3e88d">'content'</span>: <span style="color:#c3e88d">'Hola'</span>}]`,
      `)`
    ]
  },
  'orb-ollama': {
    filename: 'ollama.py',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#00a6ed"/><path d="M16 18l6 4 6-4" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="22" cy="26" r="4" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> <span style="color:#82aaff">ollama</span>`,
      ``,
      `<span style="color:#82aaff">response</span> = <span style="color:#82aaff">ollama</span>.<span style="color:#82aaff">chat</span>({`,
      `  <span style="color:#82aaff">model</span>: <span style="color:#c3e88d">'llama3.2'</span>,`,
      `  <span style="color:#82aaff">messages</span>: [{`,
      `    <span style="color:#82aaff">role</span>: <span style="color:#c3e88d">'user'</span>,`,
      `    <span style="color:#82aaff">content</span>: <span style="color:#c3e88d">'Explain RAG'</span>`,
      `  }]`,
      `})`
    ]
  },
  'orb-rag': {
    filename: 'rag.py',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#ff6b9d"/><path d="M14 18h16M14 26h12" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><circle cx="22" cy="12" r="3" fill="#fff"/><circle cx="22" cy="32" r="3" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">from</span> <span style="color:#82aaff">langchain.vectorstores</span> <span style="color:#c792ea">import</span> <span style="color:#82aaff">Chroma</span>`,
      `<span style="color:#c792ea">from</span> <span style="color:#82aaff">langchain.embeddings</span> <span style="color:#c792ea">import</span> <span style="color:#82aaff">OpenAIEmbeddings</span>`,
      ``,
      `<span style="color:#82aaff">vectorstore</span> = <span style="color:#82aaff">Chroma</span>(`,
      `  <span style="color:#82aaff">embedding_function</span>=<span style="color:#82aaff">OpenAIEmbeddings</span>()`,
      `)`,
      ``,
      `<span style="color:#676e95"># RAG: retrieve + generate</span>`,
      `<span style="color:#82aaff">docs</span> = <span style="color:#82aaff">vectorstore</span>.<span style="color:#82aaff">similarity_search</span>(query)`
    ]
  },
  'orb-tensorflowjs': {
    filename: 'model.js',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#ff6f00"/><path d="M16 14l6 4v12l-6-4V14z" fill="#fff" opacity="0.9"/><path d="M28 14l-6 4v12l6-4V14z" fill="#fff" opacity="0.7"/><rect x="13" y="20" width="18" height="2" fill="#fff" opacity="0.5"/></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> * <span style="color:#c792ea">as</span> <span style="color:#82aaff">tf</span> <span style="color:#c792ea">from</span> <span style="color:#c3e88d">'@tensorflow/tfjs'</span>`,
      ``,
      `<span style="color:#c792ea">const</span> <span style="color:#82aaff">model</span> = <span style="color:#82aaff">tf</span>.<span style="color:#82aaff">sequential</span>()`,
      `<span style="color:#82aaff">model</span>.<span style="color:#82aaff">add</span>(<span style="color:#82aaff">tf</span>.<span style="color:#82aaff">layers</span>.<span style="color:#82aaff">dense</span>({<span style="color:#82aaff">units</span>: <span style="color:#f78c6c">16</span>, <span style="color:#82aaff">activation</span>: <span style="color:#c3e88d">'relu'</span>}))`,
      ``,
      `<span style="color:#c792ea">await</span> <span style="color:#82aaff">model</span>.<span style="color:#82aaff">fit</span>(xs, ys, { <span style="color:#82aaff">epochs</span>: <span style="color:#f78c6c">10</span> })`
    ]
  },
  'orb-sagemaker': {
    filename: 'train.py',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#ff9900"/><path d="M16 14h12v6H16v-6zm0 10h8v6h-8v-6zm10 0h4v6h-4v-6z" fill="#fff"/></svg>`,
    lines: [
      `<span style="color:#c792ea">import</span> <span style="color:#82aaff">sagemaker</span> <span style="color:#c792ea">as</span> <span style="color:#82aaff">sm</span>`,
      `<span style="color:#c792ea">from</span> <span style="color:#82aaff">sagemaker.huggingface</span> <span style="color:#c792ea">import</span> <span style="color:#82aaff">HuggingFace</span>`,
      ``,
      `<span style="color:#82aaff">estimator</span> = <span style="color:#82aaff">HuggingFace</span>(`,
      `  <span style="color:#82aaff">entry_point</span>=<span style="color:#c3e88d">'train.py'</span>,`,
      `  <span style="color:#82aaff">instance_type</span>=<span style="color:#c3e88d">'ml.g5.xlarge'</span>`,
      `)`,
      ``,
      `<span style="color:#82aaff">estimator</span>.<span style="color:#82aaff">fit</span>()`
    ]
  },
  'orb-python': {
    filename: 'main.py',
    icon: `<svg viewBox="0 0 44 44" fill="none"><ellipse cx="18" cy="14" rx="12" ry="8" fill="#3776AB"/><ellipse cx="26" cy="30" rx="12" ry="8" fill="#FFD43B"/><rect x="16" y="16" width="12" height="12" fill="#fff" opacity="0.9"/><path d="M26 14l-4-2-4 2v4l4 2 4-2v-4z" fill="#3776AB"/><path d="M18 30l4 2 4-2v-4l-4-2-4 2v4z" fill="#FFD43B"/></svg>`,
    lines: [
      `<span style="color:#c792ea">from</span> <span style="color:#82aaff">langchain_community.llms</span> <span style="color:#c792ea">import</span> <span style="color:#82aaff">Ollama</span>`,
      `<span style="color:#c792ea">from</span> <span style="color:#82aaff">langchain.chains</span> <span style="color:#c792ea">import</span> <span style="color:#82aaff">LLMChain</span>`,
      ``,
      `<span style="color:#82aaff">llm</span> = <span style="color:#82aaff">Ollama</span>(<span style="color:#82aaff">model</span>=<span style="color:#c3e88d">'llama3.2'</span>)`,
      `<span style="color:#82aaff">chain</span> = <span style="color:#82aaff">LLMChain</span>(`,
      `  <span style="color:#82aaff">llm</span>=llm,`,
      `  <span style="color:#82aaff">prompt</span>=<span style="color:#82aaff">prompt</span>`,
      `)`,
      ``,
      `<span style="color:#82aaff">result</span> = <span style="color:#82aaff">chain</span>.<span style="color:#82aaff">run</span>({ <span style="color:#c3e88d">'question'</span>: query })`
    ]
  },
  'orb-langchain': {
    filename: 'chain.py',
    icon: `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="18" fill="#7b61ff"/><path d="M28 14l4 8-4 8" stroke="#fff" stroke-width="2.5" fill="none"/><path d="M16 14l-4 8 4 8" stroke="#fff" stroke-width="2.5" fill="none"/><circle cx="22" cy="14" r="3" fill="#fff"/><circle cx="22" cy="30" r="3" fill="#fff"/><path d="M22 17v10" stroke="#fff" stroke-width="2"/></svg>`,
    lines: [
      `<span style="color:#c792ea">from</span> <span style="color:#82aaff">langchain</span> <span style="color:#c792ea">import</span> <span style="color:#82aaff">LLMChain</span>, <span style="color:#82aaff">PromptTemplate</span>`,
      ``,
      `<span style="color:#82aaff">prompt</span> = <span style="color:#82aaff">PromptTemplate</span>.<span style="color:#82aaff">from_template</span>(`,
      `  <span style="color:#c3e88d">"Tell me about {topic}"</span>`,
      `)`,
      `<span style="color:#82aaff">chain</span> = <span style="color:#82aaff">LLMChain</span>(<span style="color:#82aaff">llm</span>=llm, <span style="color:#82aaff">prompt</span>=prompt)`,
      ``,
      `<span style="color:#82aaff">result</span> = <span style="color:#82aaff">chain</span>.<span style="color:#82aaff">run</span>({ <span style="color:#c3e88d">'topic'</span>: <span style="color:#c3e88d">'RAG architectures'</span> })`
    ]
  }
}
