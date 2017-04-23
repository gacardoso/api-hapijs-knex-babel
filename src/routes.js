import Knex from './knex';
import jwt from 'jsonwebtoken';
import GUID from 'node-uuid';

const routes = [

    {

        path: '/dogs',
        method: 'GET',
        handler: ( request, reply ) => {

            const getOperation = Knex( 'dogs' ).where( {

                isPublic: true

            } ).select( 'breed', 'picture_url' ).then( ( results ) => {

                if( !results || results.length === 0 ) {

                    reply( {

                        error: true,
                        errMessage: 'no public dog found',

                    } );

                }

                reply( {

                    dataCount: results.length,
                    data: results,

                } );

            } ).catch( ( err ) => {

                reply( 'server-side error' );

            } );

        }

    },

    {

        path: '/auth',
        method: 'POST',
        handler: ( request, reply ) => {

            const { username, password } = request.payload;

            const getOperation = Knex( 'users' ).where( {

                username,

            } ).select( 'password', 'guid' ).then( ( [ user ] ) => {

                if( !user ) {

                    reply( {

                        error: true,
                        errMessage: 'the specified user was not found',

                    } );

                    return;

                }

                if( user.password === password ) {

                    const token = jwt.sign( {

                        username,
                        scope: user.guid,

                    }, 'secret', {

                        algorithm: 'HS256',
                        expiresIn: '1h',

                    } );

                    reply( {

                        token,
                        scope: user.guid,

                    } );

                } else {

                    reply( 'incorrect password' );

                }

            } ).catch( ( err ) => {

                reply( 'server-side error' );

            } );

        }

    },

    {

        path: '/dogs',
        method: 'POST',
        config: {

            auth: {

                strategy: 'token',

            }

        },
        handler: ( request, reply ) => {

            const { dog } = request.payload;

            const guid = GUID.v4();

            const insertOperation = Knex( 'dogs' ).insert( {

                owner: request.auth.credentials.scope,
                breed: dog.breed,
                picture_url: dog.picture_url,
                guid,

            } ).then( ( res ) => {

                reply( {

                    data: guid,
                    message: 'successfully created dog'

                } );

            } ).catch( ( err ) => {

                reply( 'server-side error' );

            } );

        }

    },

    {

        path: '/dogs/{dogGuid}',
        method: 'PUT',
        config: {

            auth: {

                strategy: 'token',

            },

            pre: [

                {

                    method: ( request, reply ) => {

                        const { dogGuid } = request.params
                            , { scope }    = request.auth.credentials;

                        const getOperation = Knex( 'dogs' ).where( {

                            guid: dogGuid,

                        } ).select( 'owner' ).then( ( [ result ] ) => {

                            if( !result ) {

                                reply( {

                                    error: true,
                                    errMessage: `the dog with id ${ dogGuid } was not found`

                                } ).takeover();

                            }

                            if( result.owner !== scope ) {

                                reply( {

                                    error: true,
                                    errMessage: `the dog with id ${ dogGuid } is not in the current scope`

                                } ).takeover();

                            }

                            return reply.continue();

                        } );

                    }

                }

            ],

        },
        handler: ( request, reply ) => {

            const { dogGuid } = request.params
                , { dog }     = request.payload;

            const insertOperation = Knex( 'dogs' ).where( {

                guid: dogGuid,

            } ).update( {

                breed: dog.breed,
                picture_url: dog.picture_url,
                isPublic: dog.isPublic,

            } ).then( ( res ) => {

                reply( {

                    message: 'successfully updated dog'

                } );

            } ).catch( ( err ) => {

                reply( 'server-side error' );

            } );

        }

    }

];

export default routes;
