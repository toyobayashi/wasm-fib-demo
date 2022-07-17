#ifdef __EMSCRIPTEN__
#define WASM_EXPORT __attribute__((used))
#else
#define WASM_EXPORT __attribute__((visibility("default")))
#endif

WASM_EXPORT
int fib(int n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
