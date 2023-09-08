const { gql, ApolloServer } = require("apollo-server");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
require("dotenv").config();
const fs = require('fs'); 
let dataString = '';
let dataStr = '';
const { InMemoryLRUCache } = require('@apollo/utils.keyvaluecache');



// fs.readFile('types/personality.txt', 'utf8', (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
// });

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

readFiles('types/', function(filename, content) {
  dataStr += content + '\n';
}, function(err) {
  throw err;
});

setTimeout(() => {
  if (dataStr) {
    const typeDefs = gql`${dataStr}`;
  
    const driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    );
    
    const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
    
    neoSchema.getSchema().then((schema) => {
        const server = new ApolloServer({
            schema: schema,
            cache: new InMemoryLRUCache(),
        });
    
        server.listen().then(({ url }) => {
            console.log(`GraphQL server ready on ${url}`);
        });
    });
  }
}, 3000)