import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { DrizzleContext } from "drizzle-react";
import Profile from './components/Profile';
import './App.css';

const items = [
  {
    id: 0,
    description: 'A glowing purple sword',
    achievement: 5000,
    image: 'http://www.legendarydeeds.com/wiki/images/2/21/Sword_of_Light.jpg',
    isCarried: false,
  },
  {
    id: 1,
    description: 'A few gold flakes',
    achievement: 1000,
    image: 'https://5.imimg.com/data5/GC/FC/MY-31027579/gold-flakes-500x500.jpg',
    isCarried: true,
  },
  {
    id: 2,
    description: 'A small elf\'s hat',
    achievement: 7500,
    image: 'https://img.etsystatic.com/il/e3219c/1435872799/il_340x270.1435872799_ml80.jpg?version=1',
    isCarried: false,
  },
  {
    id: 3,
    description: 'An overflowing fountain',
    achievement: 15000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwpUYrUgXH349JkHe5PApz2w95F1PVRQi7seZGPhOKU2A134Nd',
    isCarried: false,
  },
  {
    id: 4,
    description: 'A million sparkling lights',
    achievement: 10000,
    image: 'https://www.hybridchildrencommunity.com/wp-content/uploads/2013/06/15752922-peaceful-sky-filled-with-lots-of-sparkling-stars.jpg',
    isCarried: false,
  },
  {
    id: 5,
    description: 'A basket full of kittens',
    achievement: 20000,
    image: 'https://scontent-atl3-1.cdninstagram.com/vp/7bf017a4eb1a20e08699a9191bac3086/5BD012A7/t51.2885-15/e35/35413521_1603922589704948_7517899300240621568_n.jpg',
    isCarried: false,
  }
].sort((prev, curr) => prev.achievement > curr.achievement);

const characters = [
  {
    id: 1,
    name: 'Magnificent Manta Ray',
    species: 'drow',
    points: 9050,
    avatar: 'http://www.diveworldwide.com/images/products/mantas_species_reef_manta.jpg',
    items: items.map(i => {
      const item = {...i};
      if (item.id === 2 || item.id === 1) {
        item.isCarried = true;
      }
      return item;
    }).filter(i => i.achievement <= 29050),
  },
  {
    id: 2,
    name: 'Princess Sadie',
    species: 'cat',
    points: 3000,
    avatar: 'https://res.cloudinary.com/petrescue/image/upload/h_638,w_638,c_pad,q_auto:best/v1513663063/lraid383yrxxk7jqag5w.jpg',
    items: items.map(i => {
      const item = {...i};
      if (item.id === 0 || item.id === 1) {
        item.isCarried = true;
      }
      return item;
    }).filter(i => i.achievement <= 3000),
  },
  {
    id: 3,
    name: 'Ladybird Beetle',
    species: 'elf',
    points: 12170,
    avatar: 'https://www.catseyepest.com/sites/default/files/other%20common%20insects_beetle_ladybird%20ladybug_profile_350x350.jpg',
    items: items.filter(i => i.achievement <= 12170),
  },
  {
    id: 4,
    name: 'Teacup Pup',
    species: 'human',
    points: 19978,
    avatar: 'https://secure.img2-fg.wfcdn.com/im/83549772/resize-h800-w800%5Ecompr-r85/3670/36706786/Teacup+Labrador+Puppy+Statue.jpg',
    items: items.map(i => {
      const item = {...i};
      item.isCarried = false;
      return item;
    }).filter(i => i.achievement <= 19978),
  },
]

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      drizzleState: null,
      character: characters[0],
      characters,
    };
    this.toggleCarry = this.toggleCarry.bind(this);
  }

  componentDidMount() {
    const { drizzle } = this.props;
  // console.log(drizzle)
    // // subscribe to changes in the store
    // this.unsubscribe = drizzle.store.subscribe(() => {
  
    //   // every time the store updates, grab the state from drizzle
    //   const drizzleState = drizzle.store.getState();
  
    //   // check to see if it's ready, if so, update local component state
    //   if (drizzleState.drizzleStatus.initialized) {
    //     this.setState({ loading: false, drizzleState });
    //   }
    // });
  }
  
  compomentWillUnmount() {
    // this.unsubscribe();
  }

  toggleCarry(charId, itemId) {
    const ch = this.state.characters.filter(c => c.id === charId)[0];
    const newChar = {...ch};
    const newItems = [...newChar.items].map(i => {
      const item = {...i};
      if (item.id === itemId) {
        item.isCarried = !item.isCarried;
      }
      return item;
    });

    const newArr = this.state.characters.map(c => {
      if (c.id === charId) {
        return Object.assign({}, c, {items: newItems});
      }
      return c;
    });
    this.setState({characters: newArr});
  }

  render() {
    const { character: char, characters } = this.state;
    
    return (
      <DrizzleContext.Consumer>
        { drizzleContext => {
          const { drizzle, drizzleState, initialized } = drizzleContext;
          return (
            <div className="App">
              <header>
                <h1>
                  Game App!
                </h1>
              </header>
              <Route path="/profile/:id?" render={
                () => <Profile
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  toggleCarry={this.toggleCarry}
                  characters={characters}
                  currentCharacter={char.id}  /> } />
            </div>
          );
        } }
      </DrizzleContext.Consumer>
    );
  }  
}

export default App;
