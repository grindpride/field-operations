import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import App from './App.vue';

function loadLocaleMessages() {
  const context = require.context('../locales', true, /[A-Za-z0-9-_\s]+\.json$/i);
  return context
    .keys()
    .map((key) => ({ key, locale: (key.match(/[A-Za-z0-9-_]+/i) as string[])[0] }))
    .reduce(
      (messages, { key, locale }) => ({
        ...messages,
        [locale]: context(key),
      }),
      {},
    );
}

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'ru',
  messages: loadLocaleMessages(),
});

createApp(App)
  .use(i18n)
  .mount('#app');
