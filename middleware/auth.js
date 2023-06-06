jwt.verify(token, 'shhhhh', function(err, decoded) {
    console.log(decoded.foo) // bar
  });