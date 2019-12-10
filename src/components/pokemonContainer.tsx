import * as React from 'react';
import '../styles/_containerStyles.css';
import { PokemonDropdown } from './pokemonDropdown';
import { PokemonInfo } from './pokemonInfo';

interface ContainerProps {
  className?: string;
}

// container for dropdown select and pkm cards
export const PokemonContainer = (props: ContainerProps) => {
  const [getName, setName] = React.useState('');

  return (
    <div className="pkm-container">
      <PokemonDropdown selectPokemon={setName} name={getName} className="pkm-dropdown" />
      <PokemonInfo selectPokemon={setName} name={getName} />
    </div>
  );
};
