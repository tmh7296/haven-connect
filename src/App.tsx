import * as React from 'react';
import { PokemonContainer } from './components/pokemonContainer';

const App = () => (
  <div className="app">
    <PokemonContainer className="pkm-container" />
    <PokemonContainer className="pkm-container" />
  </div>
);

export default App;
