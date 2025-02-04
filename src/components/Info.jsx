import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Header = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000') // Limite ajustable selon vos besoins
      .then(response => {
        setPokemonList(response.data.results);
      });
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img src="path_to_your_logo.png" alt="Logo" />
      </div>
      <nav className="navigation">
        <ul>
          <li><a href="#pokedex">Pokedex</a></li>
          <li><a href="#info">Information</a></li>
          <li><a href="#stats">Stats</a></li>
        </ul>
      </nav>
      <select className="pokemon-dropdown">
        <option value="">Select a Pokémon</option>
        {pokemonList.map((pokemon, index) => (
          <option key={index} value={pokemon.name}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </option>
        ))}
      </select>
    </header>
  );
}

export default Header;
