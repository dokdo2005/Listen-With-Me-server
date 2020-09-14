const rooms = require("../../models").Room;
const jwt = require("jsonwebtoken");

module.exports = {
  patch: (req, res) => {
    let token = req.get("authorization").substring(7);
    jwt.verify(token, process.env.JWT_secret, (err) => {
      if (err) {
        res.status(401).send({ message: "setCurrentMusic fail, need signin" });
      } else {
        rooms.findOne({ where: { id: req.query.id } }).then((room) => {
          if (room) {
            rooms
              .update(
                { currentMusic_id: req.body.music_id },
                { where: { id: room.id } }
              )
              .then((data) =>
                res.status(205).send({
                  room_id: data.id,
                  currentMusic_id: data.currentMusic_id,
                })
              )
              .catch(() =>
                res
                  .status(500)
                  .send({ message: "setCurrentMusic fail, server error" })
              );
          } else {
            res
              .status(404)
              .send({ message: "setCurrentMusic fail, room not found" });
          }
        });
      }
    });
  },
};
