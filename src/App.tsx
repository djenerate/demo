import React from 'react';
import ContactForm from './components/ContactForm';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Contact Form App</h1>
        </div>
      </header>
      
      <main className="container mx-auto flex-grow py-8 px-4">
        <ContactForm />
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Contact Form App</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
