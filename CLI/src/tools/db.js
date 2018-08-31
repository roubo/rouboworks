import Sequelize from 'sequelize'
import config from '../../myconfig'


const db = new Sequelize(config.DB.name, config.DB.username, config.DB.password, {
	dialect:'mysql',
	logging: false,
	operatorsAliases: false
})

export default db
