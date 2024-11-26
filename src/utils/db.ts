import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('dsp_db', 'dsp_user', 'dsp_password', {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;