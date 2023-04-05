const models = require("../models");
var { Response } = require("../helpers/util");
const { Op } = require("sequelize");

var resolvers = {
  hello: () => "hello world",
  load: async ({ page, mode, name, phone }, args, context, info) => {
    console.log("🚀 ~ file: resolvers.js:8 ~ load: ~ page", page)
    try {
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

      const totalCount = await models.Phonebook.count();
      const { count, rows } = await models.Phonebook.findAndCountAll({
        where: params,
        limit,
        offset,
        order: [["id", "DESC"]],
      });

      const pages = Math.ceil(count / limit);

      return new Response({
        params: {
          rowCount: count,
          totalCount,
          page: Number(page),
          pages,
          name,
          phone,
          mode
        },
        contacts: rows,
      });
    } catch (error) {
      return new Response(error, false);
    }
  },
  add: async ({ input }) => {
    try {
      const phonebook = await models.Phonebook.create(input);
      return new Response(phonebook);
    } catch (error) {
      return new Response(error, false);
    }
  },
  update: async ({ id, input }) => {
    try {
      const phonebook = await models.Phonebook.update(input, {
        where: {
          id,
        },
        returning: true,
        plain: true,
      });
      return new Response(phonebook[1]);
    } catch (error) {
      return new Response(error, false);
    }
  },
  remove: async({id}) => {
    try {
      const phonebook = await models.Phonebook.destroy({
        where: {
          id
        },
      });
      return new Response(phonebook)
    } catch (error) {
      return new Response(error, false)
    }
  }
};

module.exports = {
  resolvers
};
