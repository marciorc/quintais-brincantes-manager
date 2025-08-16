import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      background: '#6a4c93',
      padding: '1rem 0',
      marginBottom: '2rem',
      borderRadius: '0 0 15px 15px',
      boxShadow: '0 2px 8px #e6d7ff'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem'
      }}>
        <Link href="/home" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none' }}>Home</Link>
        <Link href="/about" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none' }}>Sobre</Link>
        <Link href="/login" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none' }}>Login</Link>
      </nav>
    </header>
  );
}