var express = require("express");
var router = express.Router();
var models = require("../models");
const { Op } = require("sequelize");
var { Response } = require("../helpers/util");

router
  .route("/phonebooks")
  /* GET phonebook listing. */
  .get(async function (req, res) {
    try {
      const { name, phone, mode, page } = req.query;
      console.log("🚀 ~ file: api.js:13 ~ name, phone, mode, page ", name, phone, mode, page )
      let params = {};
      let op = mode === "or" ? Op.or : Op.and;

      const limit = 5;
      const offset = (page - 1) * limit;

      if (name || phone) {
        params[op] = {};
      }

      if (name) {
        params[op]["name"] = {
          [Op.iLike]: `%${name}%`,
        };
      }

      if (phone) {
        params[op]["phone"] = {
          [Op.iLike]: `%${phone}%`,
        };
      }

      const totalCount = await models.Phonebook.count()
      const contacts = await models.Phonebook.findAndCountAll({
        where: params,
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });

      const total = contacts.count
      const pages = Math.ceil(total / limit);
      
      res.send(
        new Response({
          totalCount,
          rowCount: total,
          page: Number(page),
          pages,
          query: {
            name,
            phone,
            mode
          },
          contacts: contacts.rows
        })
      );
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
