import express from 'express'

const app = express()

// Middleware to read form + JSON data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Home route
app.get('/', (req, res) => {
  res.send('Fractional Knapsack Server Running')
})

// ---------- INPUT PAGE ----------
app.get('/input', (req, res) => {
  res.send(`
    <h2>Fractional Knapsack</h2>

    <form method="POST" action="/knapsack-form">
      <label>Capacity:</label><br>
      <input type="number" name="capacity" required /><br><br>

      <label>Items (value,weight per line):</label><br>
      <textarea name="items" rows="6" cols="30" required></textarea><br><br>

      <button type="submit">Calculate</button>
    </form>
  `)
})

// ---------- FORM SUBMIT ----------
app.post('/knapsack-form', (req, res) => {
  let capacity = Number(req.body.capacity)

  let items = req.body.items
    .trim()
    .split('\n')
    .map(line => line.split(',').map(Number))

  // Sort by value/weight (descending)
  items.sort((a, b) => (b[0] / b[1]) - (a[0] / a[1]))

  let ans = 0
  let c = capacity

  for (let [value, weight] of items) {
    if (c === 0) break

    if (weight <= c) {
      ans += value
      c -= weight
    } else {
      ans += (value * c) / weight
      break
    }
  }

  res.send(`
    <h3>Maximum Value = ${Math.floor(ans)}</h3>
    <a href="/input">Try Again</a>
  `)
})

// ---------- API (POST JSON) ----------
app.post('/knapsack', (req, res) => {
  let { capacity, items } = req.body

  items.sort((a, b) => (b[0] / b[1]) - (a[0] / a[1]))

  let ans = 0
  let c = capacity

  for (let [value, weight] of items) {
    if (c === 0) break

    if (weight <= c) {
      ans += value
      c -= weight
    } else {
      ans += (value * c) / weight
      break
    }
  }

  res.json({
    maximumValue: Math.floor(ans)
  })
})

// ---------- SERVER ----------
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
