export default function Privacy() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Privacy Policy</h1>
      <p style={styles.text}>
        The Union Yappers Tracker collects public post data from X (usernames and mention counts) to display a leaderboard and user-specific scores for the keyword "Union." We do not store private data or sensitive user information. Data is processed securely, and API credentials are protected.
      </p>
      <p style={styles.text}>
        To request deletion of your data or for any questions, contact us at [your-email@example.com].
      </p>
      <p style={styles.text}>
        <a href="/" style={styles.link}>Back to Home</a>
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: { fontSize: '2.5em', marginBottom: '20px' },
  text: { fontSize: '1.2em', margin: '10px 0' },
  link: { color: '#1DA1F2', textDecoration: 'none' }
};