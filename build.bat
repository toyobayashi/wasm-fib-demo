@echo off

if not exist out mkdir out

wat2wasm ./src/fib.wat -o ./out/fib.wasm

call emcc -O3 --no-entry -o ./out/fibemcc.wasm ./src/fib.c
call emcc -O3 -sMODULARIZE -o ./out/fibemccesm.mjs ./src/fib.c
@REM %EMSDK%\upstream\bin\wasm-opt ./out/fibemcc.wasm -Oz -o ./out/fibemcc.wasm
@REM wasm-strip ./out/fibemcc.wasm

clang -c -O3 --target=wasm32-wasi -o ./out/fibc.o ./src/fib.c
wasm-ld --no-entry --strip-all --export-dynamic ./out/fibc.o -o ./out/fibc.wasm
@REM %EMSDK%\upstream\bin\wasm-opt ./out/fibc.wasm -Oz -o ./out/fibc.wasm
@REM wasm-strip ./out/fibc.wasm
@REM wasm2wat ./out/fibc.wasm > ./out/fibc.wat
