import logo from './logo.svg';
import PickupActivity from './main/PickupActivity'; // Corrected import statement: 'pickupActivity' should be 'PickupActivity'

function App() {
  return (
    <div className="App" style={{ backgroundColor: 'yellow' }}>
      <div>
        <h1>Welcome to BookIt! 🇮🇳</h1>
      </div>
  
      <main>
        <PickupActivity />
      </main>
  
      <footer>
        <div style={{ backgroundColor: 'black', color: 'white'}}>
          <p>&copy; 2024 My Pickup App</p>
        </div>
      </footer>
    </div>
  );
  
}

export default App;
