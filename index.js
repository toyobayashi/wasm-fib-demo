import { fib, $fib, dpFib } from './fib.js'
import init from './out/fibemccesm.mjs'

async function fetchArrayBuffer (url, importObject) {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return await WebAssembly.instantiate(arrayBuffer, importObject)
}

async function fetchAndCompile (url, importObject) {
  if (typeof process === 'object' && process.versions && typeof process.versions.node === 'string') {
    const fs = await import('node:fs/promises')
    const buffer = await fs.readFile(url)
    return await WebAssembly.instantiate(buffer, importObject)
  }

  if (typeof fetch === 'function') {
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(fetch(url), importObject)
      } catch (_) {
        return await fetchArrayBuffer(url, importObject)
      }
    } else {
      return await fetchArrayBuffer(url, importObject)
    }
  } else {
    const arrayBuffer = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.responseType = 'arraybuffer'
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function () {
        reject(new Error('xhr GET "' + url + '" failed'))
      }
      xhr.open('GET', url)
      xhr.send()
    })
    return await WebAssembly.instantiate(arrayBuffer, importObject)
  }
}

const [
  {
    instance: {
      exports: { fib: _fib }
    }
  },
  {
    instance: {
      exports: { fib: _fibc }
    }
  },
  {
    instance: {
      exports: { fib: _fibemcc }
    }
  },
  {
    _fib: _fibemccesm
  }
] = await Promise.all([
  fetchAndCompile('./out/fib.wasm', {}),
  fetchAndCompile('./out/fibc.wasm', {}),
  fetchAndCompile('./out/fibemcc.wasm', {}),
  init({ /* 初始化选项 */ })
])

const input = 24
console.log(`input: ${input}`)

let output

console.time('wat2wasm\n')
output = _fib(input)
console.timeEnd('wat2wasm\n')
console.log(output)

console.time('clang -O3\n')
output = _fibc(input)
console.timeEnd('clang -O3\n')
console.log(output)

console.time('emcc -O3\n')
output = _fibemcc(input)
console.timeEnd('emcc -O3\n')
console.log(output)

console.time('emcc -O3 -sMODULARIZE\n')
output = _fibemccesm(input)
console.timeEnd('emcc -O3 -sMODULARIZE\n')
console.log(output)

console.time('JavaScript: fib\n')
output = fib(input)
console.timeEnd('JavaScript: fib\n')
console.log(output)

// console.time('JavaScript: $fib\n')
// output = $fib(input)
// console.timeEnd('JavaScript: $fib\n')
// console.log(output)

console.time('JavaScript: dpFib\n')
output = dpFib(input)
console.timeEnd('JavaScript: dpFib\n')
console.log(output)
