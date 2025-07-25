import('dotenv').then(({ config }) => {
  config({ quiet: true })
  import('./app')
})
