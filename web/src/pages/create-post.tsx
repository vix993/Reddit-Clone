import { Box, Flex, Link, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import React, { useEffect } from 'react';
import { InputField } from '../components/InputField';
import { useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/Layout';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({}) => {
    useIsAuth();
    const router = useRouter();
    const [, createPost] = useCreatePostMutation();
        return (
            <Layout variant='small'>
                <Formik
                    initialValues={{ title:'', text: '', }}
                    onSubmit={async (values, {setErrors}) => {
                        const {error} = await createPost({input: values})
                        if (!error) {
                            router.push("/")
                        }
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
                                create post
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Layout>
        );
}

export default withUrqlClient(createUrqlClient)(CreatePost);