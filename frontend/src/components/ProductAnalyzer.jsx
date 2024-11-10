import { useState } from 'react'

function ProductAnalyzer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyzeProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setResult(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Product Analyzer</h1>

      <form onSubmit={analyzeProduct}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter product URL"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="results">
          <h2>Results</h2>
          <h3>Extracted Data:</h3>
          <pre>{JSON.stringify(result.extracted_data, null, 2)}</pre>

          <h3>Analysis:</h3>
          <pre>{JSON.stringify(result.analysis, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default ProductAnalyzer 