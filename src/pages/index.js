import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [count, setCount] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NODE_ENV === 'production'
    ? 'https://union-tracker.vercel.app'
    : 'http://localhost:3000';

  const validateAndGenerate = async () => {
    if (!username || username.length > 15 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Please enter a valid X username (alphanumeric, max 15 characters)');
      return;
    }
    setLoading(true);
    setError('');
    setCopied(false);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`/api/validate?username=${encodeURIComponent(username)}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (res.ok) {
        const newCount = Math.floor(Math.random() * (4600 - 3500 + 1)) + 3500;
        setCount(newCount);
        setHistory((prev) => [{ username, count: newCount }, ...prev.slice(0, 4)]);
        setShowResult(true);
      } else {
        setError(data.error || 'Invalid X username. Please try another.');
      }
    } catch (err) {
      setError(err.name === 'AbortError' ? 'Request timed out.' : `Failed to validate username: ${err.message}`);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!count || !username) return;
    setCopied(false);
    const message = `zkgm maxis,

One last game before mainnet.

Let's say your allocation is based on how many times you mentioned Union.

Check it out here:
${appUrl}
Developed by @devnizam
Here:
${appUrl}

Here's my allocation

(Screenshot)

Pass it ion @urfriend`;
    navigator.clipboard.writeText(message)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        setError(`Failed to copy: ${err.message}`);
      });
  };

  const resetSearch = () => {
    setUsername('');
    setCount(null);
    setShowResult(false);
    setError('');
    setCopied(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Union Counts Tracker</h1>
      <p className={styles.description}>
        Enter your X username to see how many times you’ve mentioned Union!
      </p>
      {!showResult ? (
        <div className={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
            placeholder="Enter your X username (e.g., devnizam)"
            className={styles.input}
            disabled={loading}
          />
          <button
            onClick={validateAndGenerate}
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Checking...' : 'Get Union Count'}
          </button>
        </div>
      ) : (
        <div className={styles.result}>
          <h2>@{username} mentioned Union {count} times! 🚀</h2>
          <p className={styles.resultSubtext}>
            At current pre-market FDV.
          </p>
          <p className={styles.boldText}>
            Allocation is $U{count}.
          </p>
          <p className={styles.boldText}>
            Price: ${(count * 2.3).toFixed(1)}🔥
          </p>
          <button
            onClick={copyToClipboard}
            disabled={loading}
            className={styles.copyButton}
          >
            {copied ? 'Copied!' : 'Copy & Share'}
          </button>
          {copied && (
            <p className={styles.copiedMessage}>
              Copied! Share your Union score on X now!
            </p>
          )}
          <button
            onClick={resetSearch}
            disabled={loading}
            className={styles.backButton}
          >
            Back to Search
          </button>
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
      
    </div>
  );
}