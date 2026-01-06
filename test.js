const spq = require('./')
const test = require('brittle')

test('different prios', function (t) {
  const queue = spq()

  const a = queue.add({
    hello: 'world',
    priority: 0
  })

  const b = queue.add({
    hej: 'verden',
    priority: 1
  })

  t.ok(queue.has(b))
  t.is(queue.length, 2)
  t.alike(queue.shift(), b)
  t.ok(!queue.has(b))
  t.is(queue.length, 1)
  t.alike(queue.shift(), a)
  t.is(queue.length, 0)
  t.is(queue.shift(), null)
})

test('same prios', function (t) {
  const queue = spq()

  const a = queue.add({
    hello: 'world',
    priority: 0
  })

  const b = queue.add({
    hello: 'verden',
    priority: 0
  })

  const c = queue.add({
    hej: 'verden',
    priority: 1
  })

  t.alike(queue.shift(), c)

  let head = queue.shift()
  t.ok(head === a || head === b)

  head = queue.shift()
  t.ok(head === a || head === b)

  t.is(queue.shift(), null)
})

test('next', function (t) {
  const queue = spq()

  const a = queue.add({
    hello: 'world',
    priority: 0
  })

  const b = queue.add({
    hello: 'verden',
    priority: 0
  })

  const c = queue.add({
    hej: 'verden',
    priority: 1
  })

  t.alike(queue.next(), c)

  let value = queue.next(c)
  t.ok(value === a || value === b)

  const old = value
  value = queue.next(value)
  t.ok(old !== value)
  t.ok(value === a || value === b)

  t.is(queue.next(value), null)
})

test('prev', function (t) {
  const queue = spq()

  const a = queue.add({
    hello: 'world',
    priority: 0
  })

  const b = queue.add({
    hello: 'verden',
    priority: 0
  })

  const c = queue.add({
    hej: 'verden',
    priority: 1
  })

  let tail = queue.prev()
  t.ok(tail === a || tail === b)

  const old = tail
  tail = queue.prev(tail)
  t.ok(old !== tail)
  t.ok(tail === a || tail === b)

  tail = queue.prev(tail)
  t.alike(tail, c)

  t.is(queue.prev(tail), null)
})

test('equals', function (t) {
  const queue = spq({
    equals: function (a, b) {
      return a.hello === b.hello
    }
  })

  queue.add({
    hello: 'world'
  })

  t.is(queue.head().hello, 'world')

  queue.remove({
    hello: 'world'
  })

  t.is(queue.head(), null)
})

test('iterator', function (t) {
  t.plan(5)

  const queue = spq()
  const seen = {}

  queue.add({ priority: 0, hi: 'a' })
  queue.add({ priority: 0, hi: 'b' })
  queue.add({ priority: 1, hi: 'c' })
  queue.add({ priority: 2, hi: 'd' })

  let prev = 3

  for (const value of queue) {
    t.ok(prev >= value.priority)
    prev = value.priority
    seen[value.hi] = true
  }

  t.alike(seen, { a: true, b: true, c: true, d: true })
})
