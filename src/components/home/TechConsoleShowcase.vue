<template>
  <div ref="sectionRef" class="tcs">
    <div class="tcs__inner">

      <!-- Left column: IDE Window -->
      <div class="tcs__left">
        <div ref="consoleRef" class="tcs-ide">
          <div class="tcs-ide__tabbar">
            <div class="tcs-ide__tabs">
              <span class="tcs-ide__tab active">
                <span class="tcs-ide__tab-dot"></span>
                {{ activeItem?.filename || 'stack.js' }}
                <span class="tcs-ide__tab-close">✕</span>
              </span>
            </div>
            <div class="tcs-ide__win-ctl">
              <span class="tcs-ide__ctl ctl--min"></span>
              <span class="tcs-ide__ctl ctl--max"></span>
              <span class="tcs-ide__ctl ctl--close"></span>
            </div>
          </div>
          <div class="tcs-ide__body">
            <div class="tcs-ide__gutter"></div>
            <div class="tcs-ide__code">
              <div
                v-for="(line, i) in activeLines"
                :key="i"
                class="tcs-ide__line"
                :style="{ animationDelay: i * 20 + 'ms' }"
              >
                <span class="tcs-ide__num">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="tcs-ide__text" v-html="line"></span>
              </div>
            </div>
          </div>
          <div class="tcs-ide__statusbar">
            <span class="tcs-ide__status-item">{{ activeItem?.label || 'Stack' }}</span>
            <span class="tcs-ide__status-item">UTF-8</span>
            <span class="tcs-ide__status-item">Ln {{ activeLines.length }}</span>
          </div>
        </div>
      </div>

      <!-- Center column: Laptop -->
      <div class="tcs__center">
        <div ref="deviceRef" class="tcs-laptop">
          <div class="tcs-laptop__shadow"></div>
          <div class="tcs-laptop__body">
            <div class="tcs-laptop__accent"></div>

            <div class="tcs-laptop__lid">
              <div ref="screenRef" class="tcs-laptop__screen">
                <div class="tcs-laptop__screen-bg"></div>
                <div class="tcs-laptop__screen-content">
                  <div class="tcs-laptop__topbar">
                    <span class="tcs-laptop__topbar-icon">📁</span>
                    <span class="tcs-laptop__topbar-title">stack-viewer</span>
                    <div class="tcs-laptop__topbar-controls">
                      <span class="tcs-laptop__ctl ctl--min"></span>
                      <span class="tcs-laptop__ctl ctl--max"></span>
                      <span class="tcs-laptop__ctl ctl--close"></span>
                    </div>
                  </div>
                  <div class="tcs-laptop__screen-body">
                    <nav class="tcs-laptop__menu">
                      <div
                        v-for="(g, i) in groups"
                        :key="g.key"
                        class="tcs-laptop__menu-item"
                        :class="{ active: i === activeCategoryIndex }"
                        @click="selectCategory(i)"
                      >
                        <span class="tcs-laptop__menu-name">{{ g.label }}</span>
                      </div>
                    </nav>
                    <div class="tcs-laptop__main">
                      <div class="tcs-laptop__card">
                        <div class="tcs-laptop__card-icon" v-html="activeItem?.icon" :style="{ color: activeItem?.accent }"></div>
                        <div class="tcs-laptop__card-title" :style="{ color: activeItem?.accent }">{{ activeItem?.label }}</div>
                        <div class="tcs-laptop__card-version">{{ activeItem?.version }}</div>
                        <div class="tcs-laptop__card-code">
                          <div
                            v-for="(line, i) in (activeItem?.lines || []).slice(0, 3)"
                            :key="i"
                            class="tcs-laptop__card-line"
                            v-html="line"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="tcs-laptop__dots">
                    <span
                      v-for="(item, i) in activeItems"
                      :key="item.id"
                      class="tcs-laptop__dot"
                      :class="{ active: i === activeItemIndex }"
                      :style="{ '--dot-color': item.accent }"
                      @click="activeItemIndex = i; syncBubbles()"
                    ></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="tcs-laptop__chin"></div>
          </div>
        </div>
      </div>

      <!-- Right column: Bubbles -->
      <div ref="bubbleAreaRef" class="tcs__right">
        <div
          v-for="(item, i) in activeItems"
          :key="item.id"
          :ref="(el) => { if (el) bubbleEls[i] = el }"
          class="tcs-bubble"
          :class="{
            'tcs-bubble--active': i === activeItemIndex,
            'tcs-bubble--idle': i !== activeItemIndex
          }"
          :style="getBubbleStyle(item, i)"
          @mouseenter="onBubbleEnter(i)"
        >
          <div class="tcs-bubble__icon" v-html="item.icon"></div>
          <span class="tcs-bubble__label">{{ item.label }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { useI18n } from 'vue-i18n'
import { useContent } from '@/content/useContent'

const sectionRef = ref(null)
const consoleRef = ref(null)
const deviceRef = ref(null)
const screenRef = ref(null)
const bubbleAreaRef = ref(null)

const { locale } = useI18n({ useScope: 'global' })
const { getStackGroups, getStackOrbs } = useContent()

const activeCategoryIndex = ref(0)
const activeItemIndex = ref(0)
const bubbleEls = ref([])
let bubbleTweens = []

const orbContent = {
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

const groups = computed(() => getStackGroups(locale.value))
const allOrbs = computed(() => getStackOrbs(locale.value))

const activeGroup = computed(() => groups.value[activeCategoryIndex.value] || null)
const activeItems = computed(() => {
  const group = activeGroup.value
  if (!group) return []
  return allOrbs.value
    .filter(o => o.group === group.key)
    .map(o => ({
      ...o,
      ...(orbContent[o.id] || {}),
      accent: o.accent || '#7ad6ff',
      glow: o.glow || 'rgba(122, 214, 255, 0.35)'
    }))
})
const activeItem = computed(() => activeItems.value[activeItemIndex.value] || null)
const activeLines = computed(() => activeItem.value?.lines || [])

function selectCategory(i) {
  activeCategoryIndex.value = i
  activeItemIndex.value = 0
  nextTick(() => {
    syncBubbles()
    killBubbleFloat()
    initBubbleFloat()
  })
}

function syncBubbles() {
  const active = activeItemIndex.value
  Object.keys(bubbleEls.value).forEach((key) => {
    const el = bubbleEls.value[key]
    if (!el) return
    const i = Number(key)
    el.classList.toggle('tcs-bubble--active', i === active)
    el.classList.toggle('tcs-bubble--idle', i !== active)
    gsap.to(el, {
      scale: i === active ? 1.18 : 1,
      opacity: i === active ? 1 : 0.3,
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  })
}

function onBubbleEnter(i) {
  activeItemIndex.value = i
  syncBubbles()
}

function getBubbleStyle(item, i) {
  const count = activeItems.value.length
  const center = (count - 1) / 2
  const yOffset = window.innerWidth <= 860 ? 0 : (i - center) * 60
  return {
    '--bubble-accent': item.accent,
    '--bubble-glow': item.glow,
    '--bubble-x': '0px',
    '--bubble-y': yOffset + 'px',
    transitionDelay: (i * 0.12) + 's'
  }
}

function initBubbleFloat() {
  if (window.innerWidth <= 860) return
  const els = bubbleEls.value.filter(Boolean)
  if (!els.length) return
  els.forEach((el, i) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: i * 0.4 })
    tl.to(el, {
      y: -8 + i * 3,
      x: 6 - i * 3,
      duration: 2.8 + i * 0.4,
      ease: 'sine.inOut'
    })
    bubbleTweens.push(tl)
  })
}

function killBubbleFloat() {
  bubbleTweens.forEach((tl) => tl.kill())
  bubbleTweens = []
}

onMounted(() => {
  nextTick(() => {
    initBubbleFloat()
  })
})

onBeforeUnmount(() => {
  killBubbleFloat()
})
</script>

<style scoped>
.tcs {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100%;
  padding: calc(88px + 2rem) 1.25rem 2rem;
  overflow: hidden;
}

.tcs__inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: stretch;
  gap: 0;
  min-height: 640px;
}

.tcs__left {
  flex: 0 0 30%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 0;
}

.tcs__center {
  flex: 0 0 62%;
  margin-left: -8%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 0.5rem;
  position: relative;
  z-index: 3;
}

/* ── IDE Window ── */
.tcs-ide {
  width: 100%;
  max-width: 100%;
  background: rgba(10, 8, 16, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow:
    0 28px 56px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(97, 218, 251, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(4px);
  position: relative;
  z-index: 1;
}

.tcs-ide__tabbar {
  display: flex;
  align-items: center;
  height: 28px;
  background: rgba(6, 5, 12, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.tcs-ide__tabs {
  flex: 1;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}

.tcs-ide__tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  font-size: 0.58rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.04);
  white-space: nowrap;
  user-select: none;
}

.tcs-ide__tab.active {
  color: rgba(255, 255, 255, 0.75);
  background: transparent;
  border-bottom: 2px solid #ff14a2;
}

.tcs-ide__tab-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff14a2;
  flex-shrink: 0;
}

.tcs-ide__tab-close {
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  margin-left: 2px;
}

.tcs-ide__tab-close:hover {
  color: rgba(255, 255, 255, 0.6);
}

.tcs-ide__win-ctl {
  display: flex;
  gap: 4px;
  padding: 0 8px;
  align-items: center;
}

.tcs-ide__ctl {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.tcs-ide__body {
  display: flex;
  min-height: 240px;
}

.tcs-ide__gutter {
  width: 3px;
  background: rgba(255, 20, 162, 0.06);
  flex-shrink: 0;
}

.tcs-ide__code {
  flex: 1;
  padding: 10px 10px 10px 6px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  line-height: 1.7;
  overflow: hidden;
}

.tcs-ide__line {
  display: flex;
  gap: 8px;
  white-space: pre;
  opacity: 0;
  animation: tcs-line-in 0.3s ease-out forwards;
}

@keyframes tcs-line-in {
  to { opacity: 1; }
}

.tcs-ide__num {
  color: rgba(255, 255, 255, 0.1);
  font-size: 0.6rem;
  min-width: 2em;
  text-align: right;
  user-select: none;
}

.tcs-ide__text {
  color: rgba(238, 255, 255, 0.82);
}

.tcs-ide__statusbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 3px 10px;
  background: rgba(6, 5, 12, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.15);
  user-select: none;
}

.tcs-ide__status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tcs-ide__status-item:not(:last-child)::after {
  content: '';
  width: 1px;
  height: 8px;
  background: rgba(255, 255, 255, 0.06);
  margin-left: 12px;
}

/* ── Laptop ── */
.tcs-laptop {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tcs-laptop__shadow {
  position: absolute;
  bottom: -6%;
  left: 4%;
  right: 4%;
  height: 20%;
  background: radial-gradient(ellipse at 50% 100%, rgba(0, 0, 0, 0.35), transparent 70%);
  filter: blur(20px);
  z-index: 0;
}

.tcs-laptop__body {
  position: relative;
  width: 100%;
  perspective: 1200px;
}

.tcs-laptop__accent {
  position: absolute;
  top: -1px;
  left: 10%;
  right: 10%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ff14a2, #7ad6ff, transparent);
  border-radius: 2px;
  z-index: 5;
  will-change: filter, transform;
}

.tcs-laptop__lid {
  position: relative;
  width: 100%;
  padding-bottom: 65%;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(22, 20, 36, 0.96), rgba(16, 14, 26, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: visible;
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.4),
    0 0 80px rgba(97, 218, 251, 0.02);
  transform: rotateX(2deg);
}

/* Top edge — visible thickness when tilted */
.tcs-laptop__lid::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 4%;
  right: 4%;
  height: 12px;
  background: linear-gradient(180deg, rgba(18, 16, 28, 0.8), rgba(22, 20, 36, 0.95));
  border-radius: 4px 4px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-bottom: none;
  transform: rotateX(-90deg);
  transform-origin: bottom center;
}

/* Bottom edge — visible thickness */
.tcs-laptop__lid::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 4%;
  right: 4%;
  height: 10px;
  background: linear-gradient(180deg, rgba(16, 14, 26, 0.95), rgba(12, 10, 20, 0.7));
  border-radius: 0 0 4px 4px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-top: none;
  transform: rotateX(-90deg);
  transform-origin: top center;
}

/* Side edges */
.tcs-laptop__lid .tcs-laptop__screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: -8px;
  width: 8px;
  height: 100%;
  background: linear-gradient(180deg, rgba(18, 16, 28, 0.9), rgba(14, 12, 22, 0.9));
  border-radius: 4px 0 0 4px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-right: none;
  z-index: 0;
}

.tcs-laptop__lid .tcs-laptop__screen::after {
  content: '';
  position: absolute;
  top: 0;
  right: -8px;
  width: 8px;
  height: 100%;
  background: linear-gradient(180deg, rgba(14, 12, 24, 0.85), rgba(10, 8, 18, 0.85));
  border-radius: 0 4px 4px 0;
  border: 1px solid rgba(255, 255, 255, 0.02);
  border-left: none;
  z-index: 0;
}

.tcs-laptop__screen {
  position: absolute;
  inset: 8px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(4, 5, 10, 0.98);
  box-shadow:
    inset 0 0 60px rgba(0, 0, 0, 0.8),
    0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.tcs-laptop__screen-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(97, 218, 251, 0.035), transparent 60%),
    radial-gradient(ellipse at 50% 70%, rgba(255, 20, 162, 0.02), transparent 50%),
    linear-gradient(180deg, rgba(8, 6, 18, 0.98), rgba(6, 5, 14, 0.98));
}

.tcs-laptop__screen-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 5% 4%;
}

/* ── Top Bar ── */
.tcs-laptop__topbar {
  display: flex;
  align-items: center;
  padding: 0 6px;
  height: 28px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.tcs-laptop__topbar-title {
  flex: 1;
  text-align: center;
  font-size: 0.55rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.04em;
  user-select: none;
}

.tcs-laptop__topbar-icon {
  font-size: 0.65rem;
  line-height: 1;
  user-select: none;
}

.tcs-laptop__topbar-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.tcs-laptop__ctl {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.ctl--min { background: #ffbd2e; }
.ctl--max { background: #27c93f; }
.ctl--close { background: #ff5f56; }

/* ── Screen Body: sidebar + content ── */
.tcs-laptop__screen-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

.tcs-laptop__menu {
  width: 50%;
  max-width: 280px;
  background: rgba(12, 10, 22, 0.97);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex-shrink: 0;
}

.tcs-laptop__menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-left: 3px solid transparent;
}

.tcs-laptop__menu-item:hover {
  background: rgba(255, 255, 255, 0.04);
}

.tcs-laptop__menu-item.active {
  background: rgba(255, 255, 255, 0.06);
  border-left-color: var(--item-accent, #ff14a2);
}

.tcs-laptop__menu-name {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tcs-laptop__menu-item.active .tcs-laptop__menu-name {
  color: var(--item-accent, #ff14a2);
}

/* ── Main Content Card ── */
.tcs-laptop__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2% 6% 4%;
  gap: 6px;
  min-height: 0;
}

.tcs-laptop__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;
  text-align: center;
}

.tcs-laptop__card-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 4px;
}

.tcs-laptop__card-title {
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: color 0.4s ease;
}

.tcs-laptop__card-version {
  font-size: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.06em;
}

.tcs-laptop__card-code {
  width: 100%;
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  line-height: 1.6;
  text-align: left;
  overflow: hidden;
}

.tcs-laptop__card-line {
  white-space: pre;
  opacity: 0.75;
}

/* ── Page Dots ── */
.tcs-laptop__dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 6px 0 6px;
  flex-shrink: 0;
}

.tcs-laptop__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tcs-laptop__dot.active {
  background: var(--dot-color, #ff14a2);
  box-shadow: 0 0 10px var(--dot-color, transparent);
  width: 22px;
  border-radius: 2px;
}

/* Chin (bottom bezel) */
.tcs-laptop__chin {
  width: 90%;
  height: 16px;
  margin: -1px auto 0;
  background: linear-gradient(180deg, rgba(18, 16, 28, 0.9), rgba(22, 20, 34, 0.6));
  border-radius: 0 0 8px 8px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-top: none;
  position: relative;
  z-index: 1;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* ── Right Column: Bubbles ── */
.tcs__right {
  flex: 0 0 18%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  min-height: 320px;
}

.tcs-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 18px 22px 14px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  cursor: pointer;
  z-index: 5;
  will-change: transform, opacity;
  user-select: none;
  transition:
    border-color 0.4s ease,
    box-shadow 0.4s ease;
  transform: translate(var(--bubble-x, 0), var(--bubble-y, 0));
}

.tcs-bubble:hover {
  border-color: var(--bubble-accent, rgba(255, 255, 255, 0.15));
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.2),
    0 0 30px var(--bubble-glow, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
}

.tcs-bubble--active {
  border-color: var(--bubble-accent, rgba(255, 20, 162, 0.3));
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.25),
    0 0 40px var(--bubble-glow, transparent),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.07);
}

.tcs-bubble__icon {
  width: 38px;
  height: 38px;
  color: var(--bubble-accent, #fff);
  transition: color 0.4s ease;
}

.tcs-bubble--active .tcs-bubble__icon {
  filter: drop-shadow(0 0 8px var(--bubble-glow, transparent));
}

.tcs-bubble__label {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: color 0.4s ease;
}

.tcs-bubble--active .tcs-bubble__label {
  color: var(--bubble-accent, #fff);
}

/* ── Responsive ── */
@media (max-width: 860px) {
  .tcs__inner {
    flex-direction: column;
    align-items: stretch;
    min-height: auto;
    gap: 0.5rem;
  }

  .tcs__left {
    flex: none;
    width: 100%;
    padding-top: 0;
  }

  .tcs__center {
    flex: none;
    width: 80%;
    margin: 0 auto;
  }

  .tcs-laptop {
    max-width: 420px;
  }

  .tcs__right {
    flex: none;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    min-height: auto;
    padding: 0.5rem 0 0;
  }

  .tcs-bubble {
    transform: none !important;
    padding: 12px 16px 10px;
  }

  .tcs-bubble__icon {
    width: 28px;
    height: 28px;
  }

  .tcs-bubble__label {
    font-size: 0.55rem;
  }

  .tcs-ide__body {
    min-height: 200px;
  }

  .tcs-ide__code {
    font-size: 0.68rem;
    padding: 8px 10px;
  }
}

@media (max-width: 640px) {
  .tcs-laptop__screen-body {
    flex-direction: column;
  }

  .tcs-laptop__menu {
    width: 100%;
    max-width: 100%;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 2px 0;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .tcs-laptop__menu::-webkit-scrollbar {
    display: none;
  }

  .tcs-laptop__menu-item {
    padding: 6px 10px;
    border-left: none;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .tcs-laptop__menu-item.active {
    border-left-color: transparent;
    border-bottom-color: var(--item-accent, #ff14a2);
  }

  .tcs-laptop__main {
    padding: 4% 4% 6%;
  }

  .tcs-laptop__card-icon {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 480px) {
  .tcs {
    padding: calc(88px + 1rem) 0.5rem 1rem;
    overflow-x: hidden;
  }

  .tcs-ide__body {
    min-height: 160px;
  }

  .tcs-ide__code {
    font-size: 0.58rem;
    padding: 6px 8px;
    line-height: 1.65;
  }

  .tcs-ide__num {
    font-size: 0.5rem;
    min-width: 1.5em;
  }

  .tcs__center {
    width: 100%;
    margin-left: 0;
  }

  .tcs-laptop {
    max-width: 380px;
  }

  .tcs__right {
    gap: 0.5rem;
  }

  .tcs-bubble {
    padding: 8px 12px 6px;
    gap: 3px;
    border-radius: 14px;
  }

  .tcs-bubble__icon {
    width: 22px;
    height: 22px;
  }

  .tcs-bubble__label {
    font-size: 0.48rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tcs-ide__line {
    animation: none;
    opacity: 1;
  }
}
</style>
