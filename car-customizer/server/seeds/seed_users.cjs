const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('users').del();

  const hashedPassword = await bcrypt.hash('Dallas1994$', 10);

  await knex('users').insert([
    {
      username: 'Robert',
      password: hashedPassword,
      bio: 'I build Supras.',
      avatarUrl: '',
      garage: JSON.stringify([])
    }
  ]);
};
