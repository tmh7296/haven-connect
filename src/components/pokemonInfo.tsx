import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Card from '@material-ui/core/Card/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { gql } from 'apollo-boost';
import * as React from 'react';
import { Query } from 'react-apollo';
import '../styles/_infoStyles.css';

const POKE_DATA = gql`
  query pokemon($name: String!) {
    pokemon(name: $name) {
      id
      number
      name
      maxHP
      evolutions {
        name
      }
    }
  }
`;

interface InfoProps {
  selectPokemon: React.Dispatch<React.SetStateAction<string>>;
  name: string;
}

interface Evolution {
  name: string;
}

export const PokemonInfo = (props: InfoProps) => {
  let image: JSX.Element;
  // type 'any' because we're going to store strings/react-nodes in here
  const stats: any = {
    name: '?',
    id: '?',
    number: '?',
    maxHP: '?',
    evolutions: '?'
  };

  const handleClick = (name: string): void => {
    props.selectPokemon(name);
  };

  return !props.name ? null : (
    <Query query={POKE_DATA} variables={{ name: props.name }}>
      {({ loading, error, data }) => {
        if (loading) {
          // during load, displaying loading indicator
          image = <CircularProgress className="loading"/>;
        } else if (error) {
          // replace image and stats with error denoations
          image = (
            <img
              src="http://ichno.org/dokuwiki/lib/exe/fetch.php?cache=&media=characters:placeholder.png"
              className="pkm-img"
            />
          );
          Object.keys(stats).map(stat => {
            stats[stat] = 'error';
          });
        } else {
          // happy path
          image = (
            <img
              src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${data.pokemon.number}.png`}
              className="pkm-img"
            />
          );
          // display stats
          Object.keys(stats).map(stat => {
            // make evolutions clickable buttons
            if (stat === 'evolutions') {
              if (!data.pokemon[stat]) {
                return (stats[stat] = 'None');
              }
              const buttons = data.pokemon[stat].map((pokemon: Evolution) => (
                <Button onClick={() => handleClick(pokemon.name)} value={pokemon.name} key={pokemon.name}>
                  {pokemon.name}
                </Button>
              ));
              // button grid
              stats[stat] = (
                <Grid container spacing={1} direction="column" alignItems="center">
                  <Grid item>
                    <ButtonGroup size="small" aria-label="small outlined button group">
                      {buttons}
                    </ButtonGroup>
                  </Grid>
                </Grid>
              );
            } else {
              // add normal stat to table
              stats[stat] = data.pokemon[stat];
            }
          });
        }
        return (
          <Card>
            <div className="pkm-img-container">{image}</div>
            <Paper>
              <Table aria-label="simple table">
                <TableBody>
                  {Object.keys(stats).map(stat => (
                    <TableRow key={stat}>
                      <TableCell component="th" scope="row">
                        <b>{stat.charAt(0).toUpperCase() + stat.slice(1)}</b>
                      </TableCell>
                      <TableCell align="right">{stats[stat]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Card>
        );
      }}
    </Query>
  );
};
