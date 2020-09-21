import {
    InputType,
    Field
} from "type-graphql";

// creating an input object

@InputType()
export class UsernamePasswordInput {
    @Field()
    email: string;
    @Field()
    username: string;
    @Field()
    password: string;
}
