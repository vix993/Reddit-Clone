import React from 'react';
import { Box, Link, Flex, Button } from '@chakra-ui/core';
import NextLink from 'next/link'; 
import { useMeQuery } from '../generated/graphql';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{data, fetching}] = useMeQuery();
    let body = null;
    // data is loading
    if(fetching){
        body = null;
        //user not logged in
    } else if (!data?.me){
        body = (
        <>
            <NextLink href='/login'>
                <Link color='white' mr={2}>login</Link>
            </NextLink>

            <NextLink href='/register'>
                <Link>register</Link>
            </NextLink>
        </>
        )
        //user is logged in
    } else {
        body = (
            <Flex>
                <Box color='white'>
                    {data.me.username}
                </Box>

                <Button variant='link' color='black' ml={2}>logout</Button>
            </Flex>
        )
    }

    return (
        <Flex
            bg='tomato'
            p={4}
            ml={'auto'}
        >
            <Box ml={'auto'}>
                {body}
            </Box>
        </Flex>
    );
}