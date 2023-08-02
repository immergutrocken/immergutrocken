import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    testIsolation: false,
    env: {
      frontentBaseUrl: "http://localhost:3000",
      sanityBaseUrl: "http://localhost:3333",
      sanityUser: "",
      sanityPassword: "",
    },
  },
})
