db.createUser(
  {
    user: "admin",
    pwd: "admin",
    roles: [
      {
        role: "admin",
        db: "order-db"
      }
    ]
  }
);