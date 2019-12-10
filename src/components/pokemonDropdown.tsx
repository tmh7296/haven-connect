import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { gql } from 'apollo-boost';
import * as React from 'react';
import { Query } from 'react-apollo';
import '../styles/_dropdownStyles.css';

// hard-coded at 151 because the endpoint only includes first-gen pokemon
const POKEMON_COLLECTION = gql`
  query pokemons {
    pokemons(first: 151) {
      name
    }
  }
`;

interface Pokemon {
  name: string;
}

interface DropdownProps {
  selectPokemon: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  className?: string;
}

export const PokemonDropdown = (props: DropdownProps) => {
  const handleChange = (event: React.ChangeEvent<{ name: string; value: any }>): void => {
    props.selectPokemon(event.target.value);
  };

  let content: JSX.Element;

  return (
    <Query query={POKEMON_COLLECTION}>
      {({ loading, error, data }) => {
        if (loading) {
          content = <MenuItem>'Loading...'</MenuItem>;
        } else if (error) {
          content = <MenuItem>'Error!'</MenuItem>;
        } else {
          if (data.pokemons.length !== 0) {
            // create select items for all pokemon
            content = data.pokemons.map((pokemon: Pokemon, idx: number) => (
              <MenuItem value={pokemon.name} key={idx}>
                {pokemon.name}
              </MenuItem>
            ));
          }
        }
        return (
          <>
            <InputLabel>Pokemon:</InputLabel>
            <Select labelId="dropdown-label" className="pkm-dropdown" value={props.name} onChange={handleChange}>
              {content}
            </Select>
          </>
        );
      }}
    </Query>
  );
};
