const express = require("express");
const {
  addPeopleController,
  getPeopleByTableIDController,
  deletePeopleController
} = require("./controller.js");

const router = express.Router();

router.post("/add", addPeopleController);
router.get("/:TableID", getPeopleByTableIDController);
router.delete('/:id', deletePeopleController);

module.exports = router;
