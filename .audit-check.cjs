// Throwaway audit helper: reports what the production bundle actually contains.
const fs = require('fs')
const path = require('path')

const dir = path.join(process.cwd(), 'dist', 'assets')
const js = fs.readdirSync(dir).filter((f) => f.endsWith('.js'))
const css = fs.readdirSync(dir).filter((f) => f.endsWith('.css'))

for (const file of js) {
  const text = fs.readFileSync(path.join(dir, file), 'utf8')
  console.log(`\n== ${file} (${(Buffer.byteLength(text) / 1024).toFixed(0)} kB)`)
  for (const needle of [
    'test@gmail.com',
    'test123',
    'raksham-api.onrender.com',
    'raksham.session',
    'raksham.sample.drafts',
    'raksham.language',
    'VITE_ENABLE_TEST_LOGIN',
  ]) {
    console.log(`  ${needle.padEnd(28)} ${text.includes(needle) ? 'PRESENT' : 'absent'}`)
  }
}

for (const file of css) {
  const text = fs.readFileSync(path.join(dir, file), 'utf8')
  console.log(`\n== ${file} (${(Buffer.byteLength(text) / 1024).toFixed(0)} kB)`)
  for (const needle of ['::file-selector-button', '--tw-rotate-x', ':focus-visible']) {
    console.log(`  ${needle.padEnd(28)} ${text.includes(needle) ? 'PRESENT' : 'absent'}`)
  }
}

console.log('\n== font subsets emitted:', fs.readdirSync(dir).filter((f) => f.endsWith('.woff2')).length)
