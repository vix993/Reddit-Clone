import { Box, Flex, Link, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React, { useState } from 'react';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';
import { createUrqlClient } from '../utils/createUrqlClient';
import { toErrorMap } from '../utils/toErrorMap';
import { useForgotPasswordMutation } from "../generated/graphql";
import login from './login';

const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [, forgotPassword] = useForgotPasswordMutation();
        return (
            <Wrapper variant='small'>
                <Formik
                    initialValues={{email: ""}}
                    onSubmit={async (values) => {
                        await forgotPassword(values);
                        setComplete(true);
                    }}
                >
                    {({isSubmitting}) => complete
                        ? (
                        <Box>
                            if an account with that email exists, we sent you an email
                        </Box>
                        ) : (
                        <Form>
                            <InputField
                                name="email"
                                label="email"
                                placeholder="Email"
                                type="email"
                            />
                            
                            <Button
                                mt={4}
                                type="submit"
                                isLoading={isSubmitting}
                                variantColor="teal"
                            >
                                forgot password
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);