import { Box, IconButton, Link } from "@chakra-ui/core";
import NextLink from "next/link";

import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  creatorId: number;
  id: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();
  if (meData?.me?.id !== creatorId) {
    return null;
  }
  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          as={Link}
          mr={4}
          color="green.500"
          icon="edit"
          aria-label="Edit Post"
        />
      </NextLink>

      <IconButton
        color="red.500"
        icon="delete"
        aria-label="Delete Post"
        onClick={() => {
          deletePost({ id });
        }}
      />
    </Box>
  );
};
