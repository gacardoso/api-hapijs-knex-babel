exports.seed = function seed( knex, Promise ) {

    var tableName = 'users';

    var rows = [

        {
            name: 'Gustavo Cardoso',
            username: 'gacardoso',
            password: 'password',
            email: 'gacardoso@gacardoso.com',
            guid: 'ce177d1d-d595-44d2-afd2-feeab4554bdf',
        },

    ];

    return knex( tableName )
        .del()
        .then( function() {
            return knex.insert( rows ).into( tableName );
        });

};
