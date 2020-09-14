const users = require("../../../models").User;
const jwt = require("jsonwebtoken");

module.exports = {
  patch: (req, res) => {
    let token = req.get("authorization").substring(7);
    jwt.verify(token, process.env.JWT_secret, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "nickname update fail, need signin" });
      } else {
        users
          .findOne({ where: { nickname: req.body.nickname } })
          .then((data) => {
            if (data) {
              res.status(409).send({
                message: "unavailable nickname, already exists nickname",
              });
            } else {
              users
                .update(
                  { nickname: req.body.nickname },
                  {
                    where: { id: decoded.userid },
                  }
                )
                .then(() =>
                  res.status(200).send({ message: "nickname update success" })
                )
                .catch(() =>
                  res
                    .status(500)
                    .send({ message: "nickname update fail, server error" })
                );
            }
          })
          .catch(() =>
            res
              .status(500)
              .send({ message: "nickname update fail, server error" })
          );
      }
    });
  },
};
