<template>
  <Teleport to="body">
    <div class="chat-widget">
      <button
        type="button"
        class="chat-widget__launcher"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-label="t('chat.launcherLabel')"
        @click="toggleChat"
      >
        <span class="chat-widget__launcher-core"></span>
        <span class="chat-widget__launcher-text">{{ t('chat.launcherShort') }}</span>
      </button>

      <div v-if="isOpen" class="chat-modal" @click.self="toggleChat">
        <section class="chat-panel" role="dialog" :aria-label="t('chat.windowTitle')">
          <div class="chat-panel__terminal-bar">
            <div class="chat-panel__traffic">
              <span class="chat-panel__dot chat-panel__dot--red"></span>
              <span class="chat-panel__dot chat-panel__dot--yellow"></span>
              <span class="chat-panel__dot chat-panel__dot--green"></span>
            </div>
            <span class="chat-panel__terminal-title">assistant@portfolio:~</span>
            <button type="button" class="chat-panel__close" :aria-label="t('chat.closeLabel')" @click="toggleChat">
              ×
            </button>
          </div>

          <header class="chat-panel__header">
            <div>
              <p class="chat-panel__eyebrow">{{ t('chat.windowEyebrow') }}</p>
              <h3 class="chat-panel__title">{{ t('chat.windowTitle') }}</h3>
            </div>
          </header>

          <div class="chat-panel__suggestions">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.id"
              type="button"
              class="chat-panel__suggestion"
              @click="useSuggestion(suggestion)"
            >
              {{ suggestion.label }}
            </button>
          </div>

          <div class="chat-panel__messages">
            <article
              v-for="message in chatMessages"
              :key="message.id"
              class="chat-message"
              :class="message.role === 'user' ? 'chat-message--user' : 'chat-message--assistant'"
            >
              <span class="chat-message__role">{{ message.role === 'user' ? '$ user' : '$ assistant' }}</span>
              <p>{{ message.content }}</p>
            </article>
          </div>

          <form class="chat-panel__form" @submit.prevent="sendMessage">
            <label class="sr-only" for="chat-input">{{ t('chat.inputLabel') }}</label>
            <div class="chat-panel__composer">
              <span class="chat-panel__prompt">&gt;</span>
              <textarea
                id="chat-input"
                v-model="draftMessage"
                class="chat-panel__input"
                rows="3"
                :placeholder="t('chat.inputPlaceholder')"
              ></textarea>
              <button type="submit" class="chat-panel__send">{{ t('chat.send') }}</button>
            </div>
          </form>

          <p class="chat-panel__note">{{ t('chat.note') }}</p>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

const isOpen = ref(false)
const draftMessage = ref('')
const chatMessages = ref([
  {
    id: 'assistant-init',
    role: 'assistant',
    content: t('chat.firstMessage')
  }
])

const suggestions = computed(() => [
  { id: 'projects', label: t('chat.suggestions.projects'), reply: t('chat.replies.projects') },
  { id: 'stack', label: t('chat.suggestions.stack'), reply: t('chat.replies.stack') },
  { id: 'contact', label: t('chat.suggestions.contact'), reply: t('chat.replies.contact') }
])

function toggleChat() {
  isOpen.value = !isOpen.value
}

function pushAssistantReply(content) {
  chatMessages.value.push({
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content
  })
}

function useSuggestion(suggestion) {
  chatMessages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content: suggestion.label
  })
  pushAssistantReply(suggestion.reply)
}

function sendMessage() {
  const message = draftMessage.value.trim()

  if (!message) return

  chatMessages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content: message
  })

  draftMessage.value = ''

  // UI-only phase. Replace this reply mapper with a backend endpoint later.
  const normalized = message.toLowerCase()

  if (normalized.includes('stack') || normalized.includes('tecnolog')) {
    pushAssistantReply(t('chat.replies.stack'))
    return
  }

  if (normalized.includes('contact') || normalized.includes('correo') || normalized.includes('email')) {
    pushAssistantReply(t('chat.replies.contact'))
    return
  }

  if (normalized.includes('proyecto') || normalized.includes('repo')) {
    pushAssistantReply(t('chat.replies.projects'))
    return
  }

  pushAssistantReply(t('chat.replies.default'))
}
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.chat-widget {
  position: fixed;
  right: 1.1rem;
  bottom: 1.1rem;
  z-index: 160;
  display: grid;
  justify-items: end;
  gap: 0.9rem;
}

.chat-modal {
  position: fixed;
  inset: 0;
  z-index: 159;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(2, 4, 8, 0.6);
  backdrop-filter: blur(12px);
}

.chat-widget__launcher {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 13, 20, 0.9);
  color: #f5f7fb;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.28);
  cursor: pointer;
}

.chat-widget__launcher-core {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff33d4, #7ad6ff);
  box-shadow: 0 0 18px rgba(255, 51, 212, 0.45);
}

.chat-widget__launcher-text {
  font-size: 0.84rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.chat-panel {
  width: min(42rem, calc(100vw - 1.5rem));
  max-height: min(42rem, calc(100vh - 3rem));
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto auto;
  gap: 0.9rem;
  padding: 1rem;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(9, 13, 20, 0.98), rgba(5, 8, 14, 0.98)),
    rgba(7, 10, 16, 0.96);
  border: 1px solid rgba(122, 214, 255, 0.22);
  box-shadow:
    0 28px 60px rgba(0, 0, 0, 0.34),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  color: #f5f7fb;
  backdrop-filter: blur(16px);
}

.chat-panel__terminal-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(122, 214, 255, 0.12);
}

.chat-panel__traffic {
  display: inline-flex;
  gap: 0.4rem;
}

.chat-panel__dot {
  width: 0.72rem;
  height: 0.72rem;
  border-radius: 999px;
}

.chat-panel__dot--red { background: #ff6b81; }
.chat-panel__dot--yellow { background: #ffd166; }
.chat-panel__dot--green { background: #7ee081; }

.chat-panel__terminal-title {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: lowercase;
  color: rgba(255, 255, 255, 0.58);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.chat-panel__header {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.chat-panel__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7ad6ff;
}

.chat-panel__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.chat-panel__close {
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1.5rem;
  cursor: pointer;
}

.chat-panel__suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chat-panel__suggestion {
  padding: 0.55rem 0.85rem;
  border-radius: 14px;
  border: 1px solid rgba(122, 214, 255, 0.14);
  background: rgba(122, 214, 255, 0.06);
  color: inherit;
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.chat-panel__messages {
  min-height: 0;
  display: grid;
  gap: 0.7rem;
  overflow: auto;
  padding-right: 0.35rem;
}

.chat-message {
  max-width: min(88%, 31rem);
  padding: 0.85rem 0.95rem;
  border-radius: 16px;
  line-height: 1.55;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.chat-message p {
  margin: 0.3rem 0 0;
}

.chat-message__role {
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.chat-message--assistant {
  background: rgba(122, 214, 255, 0.1);
  justify-self: start;
}

.chat-message--user {
  background: rgba(255, 51, 212, 0.12);
  justify-self: end;
}

.chat-panel__form {
  display: grid;
  gap: 0.75rem;
}

.chat-panel__composer {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.8rem;
  align-items: start;
  padding: 0.85rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(122, 214, 255, 0.12);
}

.chat-panel__prompt {
  padding-top: 0.85rem;
  color: #7ad6ff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.chat-panel__input {
  width: 100%;
  resize: none;
  min-height: 4.4rem;
  border-radius: 12px;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0.75rem 0;
  font: inherit;
}

.chat-panel__input:focus {
  outline: none;
}

.chat-panel__send {
  align-self: center;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 0;
  background: linear-gradient(135deg, #ff33d4, #7ad6ff);
  color: #050505;
  font-weight: 700;
  cursor: pointer;
}

.chat-panel__note {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.82rem;
  line-height: 1.45;
}

@media (max-width: 640px) {
  .chat-widget {
    right: 0.75rem;
    bottom: 0.75rem;
  }

  .chat-panel {
    width: min(100%, calc(100vw - 1rem));
    max-height: calc(100vh - 2rem);
  }

  .chat-widget__launcher-text {
    display: none;
  }

  .chat-panel__composer {
    grid-template-columns: 1fr;
  }

  .chat-panel__prompt {
    display: none;
  }
}
</style>
