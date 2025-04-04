
exports.up = function (knex) {
    return knex.schema.createTable('builds', (table) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('car_model').notNullable();
      table.jsonb('config').defaultTo('{}');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('builds');
  };
  