import Header from '../components/header.js';

export default function Home() {
  return (
    <>
      <Header />
      <div style={{ 
        padding: '2rem', 
        maxWidth: '1200px', 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6'
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          padding: '2rem',
          backgroundColor: '#f8f5ff',
          borderRadius: '15px',
          border: '3px solid #e6d7ff'
        }}>
          <img 
            src="/quintal_brincante_logo.png" 
            alt="Quintal Brincante" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              maxHeight: '200px'
            }}
          />
        </div>

        <h1 style={{ 
          color: '#6a4c93', 
          textAlign: 'center',
          marginBottom: '2rem',
          fontSize: '2.5rem'
        }}>
          Bem-vindo ao Quintal Brincante 
        </h1>
        
        <div style={{ 
          backgroundColor: '#f8f5ff', 
          padding: '2rem', 
          borderRadius: '10px',
          marginBottom: '2rem',
          border: '2px solid #e6d7ff'
        }}>
          <h2 style={{ 
            color: '#6a4c93', 
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>
            O que são Quintais Brincantes?
          </h2>
          <p style={{ 
            color: '#4a4a4a', 
            fontSize: '1.1rem',
            textAlign: 'justify'
          }}>
            Quintais Brincantes são espaços mágicos dedicados à primeira infância, onde o brincar livre e a conexão com a natureza se tornam ferramentas poderosas para o desenvolvimento integral das crianças. São ambientes cuidadosamente preparados para estimular a curiosidade, a criatividade e a autonomia.
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#f8f5ff', 
          padding: '2rem', 
          borderRadius: '10px',
          marginBottom: '2rem',
          border: '2px solid #e6d7ff'
        }}>
          <h2 style={{ 
            color: '#6a4c93', 
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>
            Nossa Filosofia
          </h2>
          <p style={{ 
            color: '#4a4a4a', 
            fontSize: '1.1rem',
            textAlign: 'justify',
            marginBottom: '1rem'
          }}>
            Acreditamos que os quintais brincantes são territórios vivos de transformação, ricos em possibilidades, onde as crianças podem aprender sobre si mesmas e sobre o mundo através de experiências sensoriais e sociais significativas.
          </p>
          <p style={{ 
            color: '#4a4a4a', 
            fontSize: '1.1rem',
            textAlign: 'justify',
            marginBottom: '1rem'
          }}>
            Nosso objetivo é criar ambientes afetuosos e respeitosos que auxiliem no processo de formação das crianças, tornando-as protagonistas de suas próprias descobertas e histórias.
          </p>
          <p style={{ 
            color: '#4a4a4a', 
            fontSize: '1.1rem',
            textAlign: 'justify'
          }}>
            Através do brincar não direcionado - porém intencionalmente preparado - oferecemos inúmeras possibilidades para que as crianças possam elaborar, investigar, pensar e experimentar o mundo que as cerca de forma natural e espontânea.
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#f8f5ff', 
          padding: '2rem', 
          borderRadius: '10px',
          border: '2px solid #e6d7ff'
        }}>
          <h2 style={{ 
            color: '#6a4c93', 
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>
            Benefícios dos Quintais Brincantes
          </h2>
          <ul style={{ 
            color: '#4a4a4a', 
            fontSize: '1.1rem',
            paddingLeft: '1.5rem'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>Desenvolvimento motor e cognitivo através da exploração</li>
            <li style={{ marginBottom: '0.5rem' }}>Estímulo à criatividade e imaginação</li>
            <li style={{ marginBottom: '0.5rem' }}>Conexão com a natureza e elementos naturais</li>
            <li style={{ marginBottom: '0.5rem' }}>Socialização e desenvolvimento emocional</li>
            <li>Respeito ao ritmo individual de cada criança</li>
          </ul>
        </div>
      </div>
    </>
  );
}