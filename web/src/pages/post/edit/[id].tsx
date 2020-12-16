import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../../utils/useGetPostFromUrl';
import createPost from '../../create-post';

const EditPost = ({}) => {
    const [{ data, fetching}] = useGetPostFromUrl();
    const [, updatePost] = useUpdatePostMutation();
    if (fetching) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        )
    }
    if (!data?.post) {
        return (
            <Layout>
                <Box>Could not find post</Box>
            </Layout>
        )
    }
        return (
            <Layout variant='small'>
                <Formik
                    initialValues={{ title: data.post.title, text: data.post.text }}
                    onSubmit={async (values, {setErrors}) => {
                        updatePost({id:})
                        // const {error} = await createPost({input: values})
                        // if (!error) {
                        //     router.push("/")
                        // }
                    }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <InputField
                                name="title"
                                label="Title"
                                placeholder="title"
                            />
                            <Box mt={4}>
                                <InputField
                                    textarea
                                    name="text"
                                    label="Body"
                                    placeholder="text..."
                                />
                            </Box>
                            <Button
                                mt={4}
                                type="submit"
                                isLoading={isSubmitting}
                                variantColor="teal"
                            >
                                update post
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Layout>
        );
}

export default withUrqlClient(createUrqlClient) (EditPost);