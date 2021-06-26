import React from 'react';
import { Box, Link, Flex, Button, Heading } from '@chakra-ui/core';
import NextLink from 'next/link'; 
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import {useRouter} from 'next/router';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter();
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    const [{data, fetching}] = useMeQuery({
        pause: isServer(),
    });
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
            <Flex align="center">
                <NextLink href='/create-post'>
                    <Button as={Link} mr={4}>
                        create post
                    </Button>
                </NextLink>

                <Box color='white'>
                    {data.me.username}
                </Box>

                <Button
                    onClick={async () => {
                        await logout()
                        router.reload()
                    }}
                    isLoading={logoutFetching}
                    variant='link'
                    color='black'
                    ml={2}
                >
                    logout
                </Button>
            </Flex>
        )
    }

    return (
        <Flex
            zIndex={2}
            position="sticky"
            top={0}
            bg='tomato'
            p={4}
            ml={'auto'}
        >
            <Flex flex={1} m="auto" maxWidth={800} align="center">
                <NextLink href="/">
                    <Link>
                        <Heading color="white">LiReddit</Heading>
                    </Link>
                </NextLink>
                <Box ml={'auto'}>
                    {body}
                </Box>
            </Flex>
        </Flex>
    );
}