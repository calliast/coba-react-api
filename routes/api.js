var express = require("express");
var router = express.Router();
var models = require("../models");
var { sequelize } = require("../models/index");
var { Response } = require("../helpers/util");
const { Op } = require("sequelize");

router
  .route("/phonebooks")
  /* GET phonebook listing. */
  .get(async function (req, res) {
    try {
      const { name, phone } = req.query;
      let params = {};

      const phonebook = await models.Phonebook.findAll({
        where: params,
        order: [["createdAt", "ASC"]],
      });
      res.send(new Response(phonebook));
    } catch (error) {
      res.status(500).json(new Response(error, false));
    }
  })
  /* Create a phonebook. */
  .post(async function (req, res) {
    try {
      const phonebook = await models.Phonebook.create(req.body);
      res.send(new Response(phonebook));
    } catch (error) {
      res.status(500).json(new Response(error, false));
    }
  });

router
  .route("/phonebooks/:id")
  /* Update a phonebook. */
  .get(async function (req, res) {
    try {
      console.log(`kok kesini`);
      const phonebook = await models.Phonebook.findAll({
        where: {
          id: req.params.id,
        },
      });
      res.send(new Response(phonebook));
    } catch (error) {
      res.status(500).json(new Response(error, false));
    }
  })
  /* Update a phonebook. */
  .put(async function (req, res) {
    try {
      const phonebook = await models.Phonebook.update(req.body, {
        where: {
          id: req.params.id,
        },
        returning: true,
        plain: true,
      });
      res.send(new Response(phonebook[1]));
    } catch (error) {
      res.status(500).json(new Response(error, false));
    }
  })
  /* Delete a phonebook. */
  .delete(async function (req, res) {
    try {
      const phonebook = await models.Phonebook.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.send(new Response(phonebook));
    } catch (error) {
      res.status(500).json(new Response(error, false));
    }
  });

module.exports = router;
