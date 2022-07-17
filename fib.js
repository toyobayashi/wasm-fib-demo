export function fib (n) {
  if (n < 2) return n
  return fib(n - 1) + fib(n - 2)
}

/**
 * ```
 * (func $fib (;1;) (export "fib") (param $var0 i32) (result i32)
 *   (local $var1 i32) (local $var2 i32)
 *   local.get $var0
 *   i32.const 2
 *   i32.lt_s
 *   if
 *     local.get $var0
 *     return
 *   end
 *   loop $label0
 *     local.get $var0
 *     i32.const 1
 *     i32.sub
 *     call $fib
 *     local.get $var1
 *     i32.add
 *     local.set $var1
 *     local.get $var0
 *     i32.const 3
 *     i32.gt_u
 *     local.set $var2
 *     local.get $var0
 *     i32.const 2
 *     i32.sub
 *     local.set $var0
 *     local.get $var2
 *     br_if $label0
 *   end $label0
 *   local.get $var0
 *   local.get $var1
 *   i32.add
 * )
 * ```
 */
export function $fib (var0) {
  var var1, var2
  if (var0 < 2) return var0
  var1 = 0
  do {
    var1 += $fib(var0 - 1)
    var2 = var0 > 3
    var0 = var0 - 2
  } while (var2)
  return var0 + var1
}

export function dpFib (n) {
  if (n < 2) return n
  const tmp = [0, 1]
  for (let i = 2; i <= n; ++i) {
    tmp[1] = tmp[1] + tmp[0]
    tmp[0] = tmp[1] - tmp[0]
  }
  return tmp[1]
}
