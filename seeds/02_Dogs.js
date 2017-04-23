exports.seed = function seed( knex, Promise ) {

    var tableName = 'dogs';

    var rows = [

        {
            owner: 'ce177d1d-d595-44d2-afd2-feeab4554bdf',
            breed: 'Border Collie',
            picture_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Border_Collie_600.jpg',
            guid: '9d8233be-52e6-4da5-9b2d-09410fe2163e',
            isPublic: true,
        },

        {
            owner: 'ce177d1d-d595-44d2-afd2-feeab4554bdf',
            breed: 'Labrador Retriever',
            picture_url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/YellowLabradorLooking_new.jpg',
            guid: 'f13862b1-2085-4f2e-a2df-0a237427eca8',
            isPublic: false,
        },

    ];

    return knex( tableName )
        .del()
        .then( function() {
            return knex.insert( rows ).into( tableName );
        });

};
