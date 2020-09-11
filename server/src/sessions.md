#### * req.session.userId = user.id *
- `{userId: 1} -> send that to redis (key value store)`
1. `e.g. sess: 'yudfhweobhfgwoeijhf'(the key we provide) -- maps to -> { userId: 1 }`
2. `express-session sets a cookie -> '213hnjhvh7g6cgv345432'`
3. `when user makes a request`
    - '213hnjhvh7g6cgv345432' -> server
    - server decrypts -- '213hnjhvh7g6cgv345432' + secret -> sess: 'yudfhweobhfgwoeijhf'
4. `Make request to redis`
    - sess: 'yudfhweobhfgwoeijhf' -> { userId: 1 }