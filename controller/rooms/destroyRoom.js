const rooms = require("../../models").Room;
const audiences = require("../../models").AudienceUser;
const acc = require("../../models").AccumulateAudience;
const jwt = require("jsonwebtoken");

module.exports = {
  delete: (req, res) => {
    let tokenString = req.get("authorization");
    if (tokenString && tokenString.length > 7) {
      let token = tokenString.substring(7);
      jwt.verify(token, process.env.JWT_secret, async (err) => {
        if (err) {
          res.status(401).send({ message: "room destroy fail, need signin" });
        } else {
          let room = await rooms.findOne({ where: { id: req.query.id } });
          if (room) {
            try {
              await acc.update(
                { room_id: null },
                { where: { room_id: req.query.id } }
              );
              await rooms.destroy({ where: { id: req.query.id } });
              await audiences.destroy({
                where: { playList_id: room.playlist_id },
              });
              res.status(204).send({ message: "room destroy success" });
            } catch (err) {
              console.log(err);
              res
                .status(500)
                .send({ message: "room destroy fail, server error" });
            }
          } else {
            res
              .status(404)
              .send({ message: "room destroy fail, room not found" });
          }
        }
      });
    } else {
      res.status(403).send({ message: "room destroy fail, invalid token" });
    }
  },
};
