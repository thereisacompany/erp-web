import { createI18n } from 'vue-i18n'

function loadLocaleMessages() {
  // 使用 import.meta.glob 動態加載語言包
  const locales = import.meta.glob('./locales/*.json', { eager: true })
  const messages = {}

  // 遍歷所有語言包
  Object.keys(locales).forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\.json$/i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales[key] // 將語言包內容加入 messages
    }
  })

  return messages
}

export const i18n = createI18n({
  locale: import.meta.env.VITE_APP_I18N_LOCALE || 'en',
  legacy: false,
  globalInjection: true,
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages() // 加載語言包
})
