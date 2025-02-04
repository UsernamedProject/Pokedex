import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [pokemon, setPokemon] = useState();
  const [image, setImage] = useState();
  const [stats, setStats] = useState();
  const [idname, setIdname] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [fetchAllowed, setFetchAllowed] = useState(false);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=9999')
      .then(response => {
        setPokemonList(response.data.results);
      });
  }, []);

  const fetchPokemonData = (value) => {
    if (fetchAllowed) {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${value}`)
        .then(response => {
          setPokemon(response.data.name);
          setImage(response.data.sprites.other['official-artwork'].front_default);
          setStats(response.data.stats);
        });
    }
  };

  useEffect(() => {
    if (idname && fetchAllowed) {
      fetchPokemonData(idname);
    }
  }, [idname, fetchAllowed]);

  const handleInputChange = (event) => {
    const value = event.target.value.toLowerCase();
    setIdname(value);
    setFetchAllowed(false);
    if (value && searchHistory.length === 0) {
      setSearchHistory([value]);
    }
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setIdname(value);
    setFetchAllowed(true);
    fetchPokemonData(value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const value = event.target.value.toLowerCase();
      if (value && !searchHistory.includes(value)) {
        setSearchHistory(prevHistory => [...prevHistory, value]);
      }
      setFetchAllowed(true);
      setIdname(value);
    }
  };

  const getSuggestions = () => {
    const suggestions = new Set();
    pokemonList.forEach(poke => suggestions.add(poke.name));
    return Array.from(suggestions).filter(suggestion =>
      suggestion.startsWith(idname)
    );
  };

  return (
    <div className="page">
      <header>
        <h1 className="pokedex">Pokédex</h1>
        <div className="info">
          <input
            list="search-history"
            name="Input"
            className="idname"
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="ID/Name"
            value={idname}
          />
          <datalist id="search-history">
            {searchHistory.map((historyItem, index) => (
              <option key={index} value={historyItem} />
            ))}
          </datalist>
          <select onChange={handleSelectChange}>
            <option value="">Pokémon</option>
            {pokemonList.map((poke, index) => (
              <option key={index} value={poke.name}>
                {poke.name}
              </option>
            ))}
          </select>
        </div>
      </header>
      <main>
        {pokemon && (
          <>
            <h1>{pokemon}</h1>
            {image && <img src={image} alt={pokemon} />}
            {stats && (
              <div className="statistiques">
                <h2>Stats</h2>
                <ul>
                  {stats.map((stat, index) => (
                    <li key={index}>
                      {stat.stat.name}: {stat.base_stat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
