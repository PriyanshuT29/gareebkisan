# Multi-Language Support (i18n)

This project supports **10 major Indian languages** plus English to make farming tools accessible to farmers across India.

## Supported Languages

1. **English (en)** - Default
2. **Hindi (hi)** - हिंदी
3. **Punjabi (pa)** - ਪੰਜਾਬੀ
4. **Marathi (mr)** - मराठी
5. **Tamil (ta)** - தமிழ்
6. **Telugu (te)** - తెలుగు
7. **Gujarati (gu)** - ગુજરાતી
8. **Bengali (bn)** - বাংলা
9. **Kannada (kn)** - ಕನ್ನಡ
10. **Odia (or)** - ଓଡ଼ିଆ

## Technology Stack

- **i18next**: Core internationalization framework
- **react-i18next**: React bindings for i18next
- **i18next-browser-languagedetector**: Automatic language detection

## Usage

### In Components

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return <h1>{t('dashboard.welcome')}</h1>
}
```

### Changing Language

```tsx
import { useTranslation } from 'react-i18next'

function LanguageSelector() {
  const { i18n } = useTranslation()
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  
  return (
    <button onClick={() => changeLanguage('hi')}>
      Switch to Hindi
    </button>
  )
}
```

### Using the Language Switcher Component

```tsx
import { LanguageSwitcher } from './components/LanguageSwitcher'

function Settings() {
  return (
    <div>
      <h2>Language Settings</h2>
      <LanguageSwitcher />
    </div>
  )
}
```

## Translation Files

All translations are stored in `src/locales/` directory:

```
src/locales/
├── en.json (English)
├── hi.json (Hindi)
├── pa.json (Punjabi)
├── mr.json (Marathi)
├── ta.json (Tamil)
├── te.json (Telugu)
├── gu.json (Gujarati)
├── bn.json (Bengali)
├── kn.json (Kannada)
└── or.json (Odia)
```

## Translation Keys Structure

```json
{
  "app": {
    "name": "App Name",
    "tagline": "Tagline"
  },
  "nav": {
    "dashboard": "Dashboard",
    "farmLog": "Farm Log",
    ...
  },
  "common": {
    "loading": "Loading...",
    "save": "Save",
    ...
  }
}
```

## Adding New Translations

1. Add the key in `src/locales/en.json` (English - master file)
2. Add corresponding translations in all other language files
3. Use the key in your component: `t('section.key')`

## Features

- ✅ **Auto-detection**: Detects browser language on first visit
- ✅ **Persistence**: Saves language preference in localStorage
- ✅ **Real-time switching**: Changes language without page reload
- ✅ **Fallback**: Falls back to English if translation is missing
- ✅ **SEO-friendly**: Proper language codes and structure

## Adding a New Language

1. Create a new JSON file in `src/locales/` (e.g., `ml.json` for Malayalam)
2. Copy the structure from `en.json` and translate all values
3. Import the translation in `src/i18n.ts`:
   ```typescript
   import mlTranslation from './locales/ml.json'
   ```
4. Add to resources:
   ```typescript
   const resources = {
     // ...existing languages
     ml: { translation: mlTranslation },
   }
   ```
5. Add to language switcher in `LanguageSwitcher.tsx`

## Best Practices

1. **Use namespaces**: Group related translations (nav, auth, common, etc.)
2. **Be consistent**: Use the same key structure across all language files
3. **Avoid hardcoded text**: Always use translation keys for user-facing text
4. **Keep it simple**: Use clear, concise translation keys
5. **Test thoroughly**: Verify all languages render correctly, especially RTL languages
6. **Cultural sensitivity**: Ensure translations are culturally appropriate

## Testing Different Languages

1. Open the app
2. Click on the language dropdown in the navbar
3. Select any language
4. Navigate through different pages to see translations

## Browser Language Detection

The app automatically detects the browser's language on first visit:
- If browser language is supported → Uses that language
- If not supported → Falls back to English

## Language Coverage by Section

### Fully Translated:
- ✅ Navigation menu
- ✅ Authentication (login/register)
- ✅ Dashboard
- ✅ Farm Log
- ✅ Marketplace
- ✅ Community
- ✅ Government Schemes
- ✅ Weather Alerts
- ✅ Settings
- ✅ Common UI elements
- ✅ Landing page

## Contributing Translations

To improve translations:
1. Fork the repository
2. Edit the appropriate language file in `src/locales/`
3. Submit a pull request
4. Include context for the changes

## License

Translation files are part of the main project license.
