// Throwaway: reports line endings of the files about to be edited.
const fs = require('fs')

const files = [
  'src/services/apiClient.js',
  'src/components/app/ChatMessage.jsx',
  'src/utils/legalErrors.js',
  'src/pages/app/AskSachiPage.jsx',
  'src/pages/app/ResourceTemplatePage.jsx',
  'src/pages/app/DraftDetailPage.jsx',
  'src/i18n/locales/app.en.json',
  'src/components/advocates/test.jsx',
]

for (const file of files) {
  try {
    const text = fs.readFileSync(file, 'utf8')
    const crlf = (text.match(/\r\n/g) || []).length
    const lfOnly = (text.match(/(?<!\r)\n/g) || []).length
    console.log(`${file}\n  bytes=${text.length} crlf=${crlf} lf_only=${lfOnly}`)
  } catch (error) {
    console.log(`${file}\n  MISSING (${error.code})`)
  }
}
