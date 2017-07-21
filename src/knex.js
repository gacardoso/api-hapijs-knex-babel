export default require( 'knex' )( {

    client: 'mysql',
    connection: {

        host: '127.0.0.1',

        user: 'user',
        password: 'user',

        database: 'dogs',
        charset: 'utf8',

    },

    debug: true

} );
