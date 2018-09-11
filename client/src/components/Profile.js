import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.renderLineItem = this.renderLineItem.bind(this);
  }

  renderLineItem(item) {
    const { characters, currentCharacter, match } = this.props;
    const id = match.params.id ? Number(match.params.id) : 1;
    const character = characters.filter(c => c.id === id)[0];
    const isCurrentCharacter = character.id === currentCharacter;
    const buttonStr = item.isCarried ? 'Remove Item' : 'Carry Item';
    return (
      <div className="inventory-line-item" key={item.id}>
        <div className="inventory-image">
          { item.image && <img src={item.image} alt='' /> }
        </div>
        <div className="inventory-description">
          { item.description }
        </div>
        <div className="inventory-achievement">
          You have achieved { item.achievement } points!
        </div>
        <div className="inventory-add-remove-item">
          {isCurrentCharacter && <button type="button" onClick={() => this.props.toggleCarry(character.id, item.id)}>
            { buttonStr }
          </button> }
        </div>
      </div>
    );
  }

  render() {
    console.log(this.props.drizzle)
    const { characters, match, currentCharacter } = this.props;
    const id = match.params.id ? Number(match.params.id) : 1;
    const character = characters.filter(c => c.id === id)[0];
    if (!character) {
      return (
        <div className="error">
          <h2>
            Error! User does not exist or you are not authorized to view this user.
          </h2>
        </div>
      )
    }
    const items = character.items;
    const isCurrentCharacter = character.id === currentCharacter;
    const youOrOtherString = isCurrentCharacter ? "You are" : `${character.name} is`;
    let itemsCarriedString = `${youOrOtherString} not carrying anything.`;
    const itemsCarried = items.filter(item => item.isCarried);
    const rating = characters.sort((prev, curr) => {
      return prev.points < curr.points;
    }).findIndex(c => c.id === character.id) + 1;
    if (itemsCarried.length) {
      let itemsCarriedSubstring = itemsCarried.map((item, index) => {
        if (index === itemsCarried.length - 1 && itemsCarried.length > 1) {
          return `and ${item.description.toLowerCase()}`;
        }
        return item.description.toLowerCase();
      }).join(', ');
      itemsCarriedString = `${youOrOtherString} carrying ${itemsCarriedSubstring}.`;
    }

    const otherCharacters = characters.filter(c => c.id !== character.id);
    const profileString = isCurrentCharacter ? 'My Profile' : `${character.name}'s Profile`;
    const friendString = isCurrentCharacter ? 'My Friends' : `${character.name}'s Friends`;
    return (
      <div className="container">
        <div className="subheader">
          <h2>
            {profileString}
          </h2>
        </div>
        <div className="avatar">
          <img src={character.avatar} />
          <p className="items-carried">
            { itemsCarriedString }
          </p>
        </div>
        <div className="profile-body">
          <div className="profile-information">
            <h3>Player Information</h3>
            <dl>
              <dt>
                Name
              </dt>
              <dd>
                {character.name}
              </dd>
              <dt>
                Species
              </dt>
              <dd>
                {character.species}
              </dd>
              <dt>
                Points
              </dt>
              <dd>
                {character.points.toLocaleString('en-US')}
              </dd>
              <dt>
                Player Rating
              </dt>
              <dd>
                {rating}
              </dd>
            </dl>
            <div className="profile-friends">
              <h3>
                {friendString}
              </h3>
              <div className="profile-friends-container">
                {otherCharacters.map(char => (
                  <div key={char.id}>
                    <Link to={`/profile/${char.id}`}>
                      <img src={char.avatar} />
                    </Link>
                    <p>
                      <Link to={`/profile/${char.id}`}>
                        { char.name }
                      </Link>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="profile-inventory">
            <h3>
              Inventory
            </h3>
            {items.length && items.map(this.renderLineItem)}
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Profile);