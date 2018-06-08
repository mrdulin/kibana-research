const { buildSchema } = require('graphql');

const fakeDB = {
  heroes: [{ id: '1', name: 'lin' }, { id: '2', name: 'youzi' }]
};

const typeDefs = `
  type Hero {
    id: ID!
    name: String
  }
  type Query {
    hero(id: ID!): Hero
    heros: [Hero]
  }
`;

const schema = buildSchema(typeDefs);

const root = {
  hero: ({ id }, req, ctx) => {
    // console.log(id, req, ctx);
    return fakeDB.heroes.find(hero => hero.id === id);
  },
  heros: () => {
    return fakeDB.heroes;
  }
};

module.exports = { schema, root };
