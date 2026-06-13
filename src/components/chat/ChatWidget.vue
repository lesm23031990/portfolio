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
        <span class="chat-widget__launcher-core">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="7" width="14" height="10" rx="3" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="10" cy="12" r="1.2" fill="currentColor"/>
            <circle cx="14" cy="12" r="1.2" fill="currentColor"/>
            <rect x="8" y="3" width="2" height="3" rx="0.5" fill="currentColor"/>
            <rect x="14" y="3" width="2" height="3" rx="0.5" fill="currentColor"/>
            <rect x="11" y="17" width="2" height="2" rx="0.5" fill="currentColor"/>
            <line x1="4" y1="16" x2="5" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="20" y1="16" x2="19" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="chat-widget__launcher-text">{{ t('chat.launcherShort') }}</span>
        <span v-if="!dismissBubble" class="chat-widget__bubble">
          {{ t('chat.bubble') }}
          <button type="button" class="chat-widget__bubble-close" @click.stop="dismissBubble = true">×</button>
        </span>
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

          <div ref="messagesContainer" class="chat-panel__messages">
            <article
              v-for="message in chatMessages"
              :key="message.id"
              class="chat-message"
              :class="message.role === 'user' ? 'chat-message--user' : 'chat-message--assistant'"
            >
              <span class="chat-message__role">{{ message.role === 'user' ? '$ user' : '$ assistant' }}</span>
              <p>{{ message.content }}</p>
            </article>
            <div v-if="isLoading" class="chat-message chat-message--assistant">
              <span class="chat-message__role">$ assistant</span>
              <p class="chat-panel__typing">
                <span class="chat-panel__dot--typing"></span>
                <span class="chat-panel__dot--typing"></span>
                <span class="chat-panel__dot--typing"></span>
              </p>
            </div>
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
                @keydown.enter.exact.prevent="sendMessage"
              ></textarea>
              <button type="submit" class="chat-panel__send" :disabled="isLoading">{{ t('chat.send') }}</button>
            </div>
          </form>

        </section>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { sendChatMessage } from '@/services/chat'

const { t } = useI18n({ useScope: 'global' })

const isOpen = ref(false)
const dismissBubble = ref(false)
const draftMessage = ref('')
const isLoading = ref(false)
const messagesContainer = ref(null)
const chatMessages = ref([
  {
    id: 'assistant-init',
    role: 'assistant',
    content: t('chat.firstMessage')
  }
])

const suggestions = computed(() => [
  { id: 'projects', label: t('chat.suggestions.projects'), query: t('chat.replies.projects') },
  { id: 'stack', label: t('chat.suggestions.stack'), query: t('chat.replies.stack') },
  { id: 'contact', label: t('chat.suggestions.contact'), query: t('chat.replies.contact') }
])

function toggleChat() {
  isOpen.value = !isOpen.value
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function pushAssistantReply(content) {
  chatMessages.value.push({
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content
  })
  scrollToBottom()
}

function getHistory() {
  return chatMessages.value.slice(-10).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content
  }))
}

async function useSuggestion(suggestion) {
  chatMessages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content: suggestion.label
  })
  scrollToBottom()
  isLoading.value = true
  const history = getHistory()
  const reply = await sendChatMessage(suggestion.query, history)
  isLoading.value = false
  pushAssistantReply(reply)
}

async function sendMessage() {
  const message = draftMessage.value.trim()

  if (!message || isLoading.value) return

  chatMessages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content: message
  })

  draftMessage.value = ''
  scrollToBottom()
  isLoading.value = true
  const history = getHistory()
  const reply = await sendChatMessage(message, history)
  isLoading.value = false
  pushAssistantReply(reply)
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
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 1.2rem 0.75rem 1rem;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 51, 212, 0.4);
  background: linear-gradient(135deg, rgba(10, 13, 20, 0.95), rgba(20, 10, 30, 0.95));
  color: #f5f7fb;
  box-shadow: 0 8px 32px rgba(255, 51, 212, 0.2), 0 0 60px rgba(122, 214, 255, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: launcher-float 3s ease-in-out infinite;
}

.chat-widget__launcher:hover {
  border-color: rgba(255, 51, 212, 0.7);
  box-shadow: 0 8px 40px rgba(255, 51, 212, 0.35), 0 0 80px rgba(122, 214, 255, 0.15);
  transform: translateY(-2px) scale(1.03);
}

.chat-widget__launcher:active {
  transform: scale(0.97);
}

.chat-widget__bubble {
  position: absolute;
  bottom: calc(100% + 12px);
  right: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border: 1.5px solid rgba(255, 51, 212, 0.5);
  border-radius: 14px;
  padding: 0.65rem 0.3rem 0.65rem 1.1rem;
  font-size: 0.82rem;
  color: #111;
  white-space: nowrap;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.chat-widget__bubble-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  border: none;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 999px;
  color: #555;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.chat-widget__bubble-close:hover {
  background: rgba(255, 51, 212, 0.15);
  color: #ff33d4;
}

.chat-widget__bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 1.5rem;
  border: 7px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.92);
  filter: drop-shadow(0 1px 0 rgba(255, 51, 212, 0.3));
}


@keyframes launcher-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.chat-widget__launcher-core {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff33d4, #7ad6ff);
  box-shadow: 0 0 24px rgba(255, 51, 212, 0.6);
  animation: core-pulse 1.5s ease-in-out infinite;
}

@keyframes core-pulse {
  0%, 100% { box-shadow: 0 0 24px rgba(255, 51, 212, 0.6); transform: scale(1); }
  50% { box-shadow: 0 0 48px rgba(255, 51, 212, 0.9), 0 0 80px rgba(122, 214, 255, 0.3); transform: scale(1.15); }
}

.chat-widget__launcher-text {
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #ff33d4, #7ad6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

.chat-panel {
  width: min(40rem, calc(100vw - 1.5rem));
  max-height: min(48rem, calc(100vh - 3rem));
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr) auto;
  gap: 0.6rem;
  padding: 0.85rem;
  border-radius: 24px;
  font-size: 0.83rem;
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
  gap: 0.35rem;
}

.chat-panel__suggestion {
  padding: 0.35rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(122, 214, 255, 0.14);
  background: rgba(122, 214, 255, 0.06);
  color: inherit;
  cursor: pointer;
  font-size: 0.78rem;
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
  justify-self: start;
  border-left: 3px solid #ff33d4;
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

.chat-panel__typing {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  margin: 0.3rem 0 0;
}

.chat-panel__dot--typing {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: #7ad6ff;
  animation: typing-bounce 1.4s ease-in-out infinite;
}

.chat-panel__dot--typing:nth-child(2) {
  animation-delay: 0.2s;
}

.chat-panel__dot--typing:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
  30% { opacity: 1; transform: translateY(-4px); }
}

.chat-panel__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
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

  .chat-widget__launcher {
    width: 3.5rem;
    height: 3.5rem;
    padding: 0;
    justify-content: center;
    border-radius: 999px;
    border: 2px solid rgba(255, 51, 212, 0.6);
    background: linear-gradient(135deg, rgba(10, 13, 20, 0.98), rgba(20, 10, 30, 0.98));
    box-shadow: 0 0 30px rgba(255, 51, 212, 0.4), 0 0 60px rgba(122, 214, 255, 0.15);
    animation: launcher-pulse 2s ease-in-out infinite;
  }

  .chat-widget__launcher-core {
    width: 1.4rem;
    height: 1.4rem;
    box-shadow: 0 0 30px rgba(255, 51, 212, 0.7);
  }

  @keyframes launcher-pulse {
    0%, 100% { box-shadow: 0 0 30px rgba(255, 51, 212, 0.4), 0 0 60px rgba(122, 214, 255, 0.15); }
    50% { box-shadow: 0 0 50px rgba(255, 51, 212, 0.7), 0 0 100px rgba(122, 214, 255, 0.3); }
  }

  .chat-widget__launcher-text,
  .chat-widget__bubble {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }

  .chat-panel__composer {
    grid-template-columns: 1fr;
  }

  .chat-panel__prompt {
    display: none;
  }
}
</style>
