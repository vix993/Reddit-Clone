import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import React from "react";
import { Heading, Link, Stack, Text, Box } from "@chakra-ui/core";
import NextLink from 'next/link';

const Index = () => {
  const [{data}] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });
  return (
    <Layout>
      <NextLink href='/create-post'>
        <Link>
          create post
        </Link>
      </NextLink>
      <br />
        { !data
          ? <div>loading...</div>
          : (
            <Stack spacing={8}>
            {data.posts.map((p) => (
              <Box key={p.id} p={5} shadow="md" borderWidth="1px">
                <Heading fontSize="xl">{p.title}</Heading>
                <Text mt={4}>{p.textSnippet}</Text>
              </Box>
            ))}
            </Stack>
          )}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true}) (Index);
