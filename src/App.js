import React from 'react';
import PickupActivity from './main/PickupActivity';

function App() {
  return (
    <div className="App" style={{ 
      backgroundColor: 'yellow'
    }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px'
      }}> {/* Centering the header */}
        <h1 style={{ flex: '1' }}>Welcome to BookIt! 🇮🇳</h1>
        <a href="https://play.google.com/store/apps/details?id=com.aashay.bookmycab" target="_blank" rel="noopener noreferrer">
          <img src="https://shop.zidoo.tv/cdn/shop/articles/gp.jpg?v=1631342070" alt="BookIt Logo" style={{ height: '50px' }} />
        </a>
      </div>
  
      <main>
        <PickupActivity />
      </main>
  
      <footer>
        <div style={{ backgroundColor: 'black', color: 'white', textAlign: 'center' }}> {/* Centering the footer */}
          <p>&copy; 2024 BookIt | Aashay Pawar | Apicon Apps</p>
          <br></br>
        </div>
      </footer>
    </div>
  );
}

export default App;
