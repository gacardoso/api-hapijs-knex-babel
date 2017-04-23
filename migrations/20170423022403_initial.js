exports.up = function(knex, Promise) {

    return knex
            .schema
            .createTable( 'users', function( usersTable ) {

                // Primary Key
                usersTable.increments();

                // Data
                usersTable.string( 'name', 50 ).notNullable();
                usersTable.string( 'username', 50 ).notNullable().unique();
                usersTable.string( 'email', 250 ).notNullable().unique();
                usersTable.string( 'password', 128 ).notNullable();
                usersTable.string( 'guid', 50 ).notNullable().unique();

                usersTable.timestamp( 'created_at' ).notNullable();

            } )

            .createTable( 'dogs', function( dogsTable ) {

                // Primary Key
                dogsTable.increments();
                dogsTable.string( 'owner', 36 ).references( 'guid' ).inTable( 'users' );

                // Data
                dogsTable.string( 'breed', 250 ).notNullable();
                dogsTable.string( 'picture_url', 250 ).notNullable();
                dogsTable.string( 'guid', 36 ).notNullable().unique();
                dogsTable.boolean( 'isPublic' ).notNullable().defaultTo( true );

                dogsTable.timestamp( 'created_at' ).notNullable();

            } );

};

exports.down = function(knex, Promise) {

    return knex
        .schema
            .dropTableIfExists( 'dogs' )
            .dropTableIfExists( 'users' );

};
