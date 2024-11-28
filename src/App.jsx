import React, { useState, useEffect } from 'react';
import './style.css';
import img1 from './assets/award-trophy-64ZYJB3-600-removebg-preview.png';
import img2 from './assets/b70ce819fee6e5d95fccfe0bab15fe5d.jpg';
import img3 from './assets/licensed-image.jpg';
import Web3 from 'web3';
import contractABI from './ABI.json'; 

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    nom: '',
    prenom: '',
    actorChoice: '',
  });

  const contractAddress = '0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d'; // Replace with your deployed contract address

  // Initialize Web3 and load the contract
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request wallet connection
          const accounts = await web3Instance.eth.getAccounts();
          setWeb3(web3Instance);
          setAccount(accounts[0]);

          // Initialize the contract
          const voteContract = new web3Instance.eth.Contract(contractABI, contractAddress);
          setContract(voteContract);
        } catch (error) {
          console.error('Error connecting to Web3:', error);
        }
      } else {
        alert('Please install MetaMask to use this application.');
      }
    };

    initWeb3();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { id, nom, prenom, actorChoice } = formData;
  
    if (!contract || !account) {
      alert('Web3 or contract is not initialized. Please ensure MetaMask is connected.');
      return;
    }
  
    try {
      await contract.methods
        .vote(id, nom, prenom, parseInt(actorChoice))
        .send({ from: account });
      alert('Vote successfully submitted!');
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error submitting vote. Check console for details.');
    }
  };
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="logo-container">
        <img src={img1} alt="Logo" />
      </div>
      <div className="container">
        <h1>Votez pour votre acteur préféré</h1>
        <form id="voteForm" onSubmit={handleSubmit}>
          <label htmlFor="id">ID</label>
          <input
            type="number"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleInputChange}
            required
          />

          {/* Section des acteurs */}
          <div className="actor-container">
            <div className="actor">
              <img src={img3} alt="Acteur 1" className="actor-image" />
              <h2>Cillian Murphy</h2>
              <input
                type="radio"
                name="actorChoice"
                value="1"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="actor">
              <img src={img2} alt="Acteur 2" className="actor-image" />
              <h2>Emily Blunt</h2>
              <input
                type="radio"
                name="actorChoice"
                value="2"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit">Soumettre</button>
        </form>
      </div>
    </div>
  );
};

export default App;
