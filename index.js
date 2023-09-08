import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";
import 'dotenv/config';

let dataStr = `
type Artwork @cacheControl(maxAge: 30){
  id: String
  image: String
  height_cm: String
  width_cm: String
  alias: String
  date_of_artwork: String
  medium: String
  title: String
  lots: [Lot!]! @relationship(type: "LOT_IS_TYPE_ARTWORK", direction: OUT)
  }
  
  type Lot @cacheControl(maxAge: 30){
  id: String
  published: String
  lot_number: String
  sp_gbp: String
  sp_inr: String
  sp_usd: String
  auction: [Auction!]! @relationship(type: "HAS_LOT", direction: IN)
  }
  
  type Auction @cacheControl(maxAge: 30){
  auction_code: String
  auction_house: String
  date_of_auction: String
  home_currency: String
  id: String
  year_of_auction: String
  euro_rate: String
  gbp_rate: String
  hkd_to_usd: String
  inr_to_usd_rate: String
  alias: String
  title: String
  venue: String
  }

  type Bibliograhies @cacheControl(maxAge: 30){
    id: String
    title: String
    alias: String
    web_serial_number: String
    reference_code: String
    web_display: String
    date_of_library_publication: String
    place_of_publication: String
    histographical_note: String
    main_historical_note: String
    binding_status: String
    accession_number: String
    cdt: String
    country_of_publication: String
    date_of_published_edition_in_library: String
    dates_of_first_edition: String
    isbn_issn_number: String
    language_of_publication: String
    number_of_pages_in_publication_text: String
    personality_film_visually_featured_on_cover: String
    publisher: String
    serial_number: String
    sortable_year_date_of_publication: String
    sub_title_of_document_book: String
    title_of_document_book: String
    volume_issue_number: String
    masterlist: String
    }

    type Currency @cacheControl(maxAge: 30){
      id: String
      name: String
      alias: String
      country: String
      symbol: String
      }
  
      type Filmography @cacheControl(maxAge: 30){
        published: String
        full_movie_link: String
        short_description: String
        synopsis: String
        trailer_link: String
        date_of_expiry: String
        date_of_issue: String
        certificate_number: String
        duration_mins: String
        id: String
        number_of_reels: String
        year_of_film: String
        image: String
        budget_in_rupees: String
        alias: String
        alternative_title: String
        certification: String
        color_type: String
        colour: String
        country_of_origin_of_film: String
        film_length: String
        film_sub_type: String
        film_type: String
        gauge: String
        keyword_dates: String
        lab: String
        length_of_reels: String
        main_title: String
        name: String
        region: String
        release_date: String
        shooting_period: String
        studios: String
        sub_title: String
        title_in_original_language: String
        title_in_other_languages: String
        language: [Language!]! @relationship(type: "HAS_LANGUAGE", direction: IN)
        }
        
        type Language @cacheControl(maxAge: 30){
        id: String
        name: String
        alias: String
        country: String
        }
        
        type Genres @cacheControl(maxAge: 30){
        id: String
        name: String
        alias: String
        }

        type IntegratedTimelines @cacheControl(maxAge: 30){
          id: String
          time_period: String
          title_of_time_period: String
          sortable_date: String
          specific_date: String
          events: String
          references: String
          text_1: String
          caption_1: String
          text_2: String
          caption_2: String
          text_3: String
          caption_3: String
          masterlist: String
          }

          type Masterlists @cacheControl(maxAge: 30){
            name: String
            id: String
            alias: String
            image: String
          }

type Personality @plural(value: "Personality")@cacheControl(maxAge: 30)
{
description: String
date_of_birth: String
date_of_death: String
id: String
image: String
official_website: String
age: String
alias: String
name: String
nationality: String
place_of_birth: String
zodiac_sign: String
time_of_birth: String
is_publisher: String
marriageregistrationdate: Date
education: [Education!]! @relationship(type: "GOT_EDUCATED", direction: OUT)
teaching_infrastructure: [Teaching_Infrastructure!]! @relationship(type: "TAUGHT_INFRA", direction: IN)
spouse: [Personality!]! @relationship(type: "IS_RELATED {relation: 'spouse'}", direction: OUT)
children: [Personality!]! @relationship(type: "IS_RELATED {relation: 'children'}", direction: OUT)
mother: [Personality!]! @relationship(type: "IS_RELATED {relation: 'mother'}", direction: OUT)
father: [Personality!]! @relationship(type: "IS_RELATED {relation: 'father'}", direction: OUT)
grandmother: [Personality!]! @relationship(type: "IS_RELATED {relation: 'grandmother'}", direction: OUT)
grandfather: [Personality!]! @relationship(type: "IS_RELATED {relation: 'grandfather'}", direction: OUT)
ancestors: [Personality!]! @relationship(type: "IS_RELATED {relation: 'ancestors'}", direction: OUT)
awards: [Awards!]! @relationship(type: "AWARD_CATEGORY_WINNER", direction: IN)
}

type Education @cacheControl(maxAge: 30){
id: String
start_year: String
end_year: String
education: String
image: String
}

type Teaching_Infrastructure @cacheControl(maxAge: 30){
id: String
post: String
data: String
display_date: String
image: String
}

type Awards @cacheControl(maxAge: 30){
Exhibition: String
award_name: String
id: String
issuing_authority: String
sortable_date: String
type: String
winner: String
}

type Projects @cacheControl(maxAge: 30){
  id: String
  alias: String
  name: String
  display_date: String
  link: String
  published: String
  venue: String
  image: String
  }

  type ResearchCategories @cacheControl(maxAge: 30){
    id: String
    abbreviation: String
    alias: String
    name: String
    }
    
    
  

type Screening @cacheControl(maxAge: 30){
  id: String
  event_name: String
  type: String
  sortable_date: String
  opening_date: String
  closing_date: String
  masterlist: String
  }
  

  type Soundtrack @plural(value: "Soundtrack") @cacheControl(maxAge: 30){
    id: String
    name: String
    duration_of_song: String
    film: String
}

type Exhibition {
  id: String
  alias: String
  category: String
  dates_revised: String
  description: String
  display_code: String
  place: String
  sortable_year: String
  title: String
  }

  
`;

const typeDefs = `#graphql
enum CacheControlScope {
  PUBLIC
  PRIVATE
}
directive @cacheControl(
  maxAge: Int
  scope: CacheControlScope
  inheritMaxAge: Boolean
) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
${dataStr}
`;
const driver = neo4j.driver(
  process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
 plugins: [responseCachePlugin()],
 // plugins: [ApolloServerPluginCacheControl({ defaultMaxAge: 120 })],
});
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ req }),
    listen: { port: 4000 },
});
console.log(`:rocket: Server ready at ${url}`);