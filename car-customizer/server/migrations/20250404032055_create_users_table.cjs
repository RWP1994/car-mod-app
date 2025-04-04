exports.up = async function (knex) {

    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
      table.text('bio').defaultTo('');
      table.string('avatarUrl').defaultTo('');
      table.jsonb('garage').defaultTo('[]'); // Flexible JSON garage data
      table.timestamps(true, true); // Adds created_at and updated_at
    });
  }
  
  exports.down = async function (knex) {
    return knex.schema.dropTableIfExists('users');
  };
  
  