export default defineNitroConfig({
  replace: {
    "typeof window": "`undefined`",
  }
})