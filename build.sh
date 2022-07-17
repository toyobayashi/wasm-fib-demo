#!/bin/sh

mkdir -p out

wat2wasm ./src/fib.wat -o ./out/fib.wasm

emcc -O3 --no-entry -o ./out/fibc.wasm ./src/fib.c
emcc -O3 -sMODULARIZE -o ./out/fibemccesm.mjs ./src/fib.c

clang -c -O3 --target=wasm32-wasi -o ./out/fibc.o ./src/fib.c
wasm-ld --no-entry --strip-all --export-dynamic ./out/fibc.o -o ./out/fibc.wasm
