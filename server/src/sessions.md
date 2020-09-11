## req.session.userId = user.id
1. `{userId: 1} -> send that to redis (key value store)`
2. `e.g. sess: 'yudfhweobhfgwoeijhf'(the key we provide) -- maps to -> { userId: 1 }`
3. `express-session sets a cookie -> '213hnjhvh7g6cgv345432'`
4. `when user makes a request`
    - '213hnjhvh7g6cgv345432' -> server
    - server decrypts -- '213hnjhvh7g6cgv345432' + secret -> sess: 'yudfhweobhfgwoeijhf'
5. `Make request to redis`
    - sess: 'yudfhweobhfgwoeijhf' -> { userId: 1 }