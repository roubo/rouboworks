import db from '../tools/db'
import Sequelize from 'sequelize'



export default class ToDoModel {

	constructor() {
		this.connect = db.define('todo', {
			label: {type: Sequelize.STRING},
			value: {type: Sequelize.STRING},
			update_time: {type: Sequelize.DATE},
			jump_url: {type:Sequelize.STRING},
			comment_last: {type: Sequelize.TEXT('long')},
			comment_list: {type: Sequelize.TEXT('long')}
		},{
			freezeTableName: true,
			timestamps: false
		})

		this.connect.sync({force: false}).catch(err => console.warn(err))
	}

	/**
	 * 获取一个类型的列表
	 * @param name: "todo", "doing", "done", "release"
	 * @param callback
	 */
	getOneList = (name, callback) => {
		let result = []
		this.connect.findAll({where:{value: name}}).then(res => {
			if(res) {
				for (let index in res){
					result.push(res[index].dataValues)
				}
			}
			callback.success(result)
		}).catch(err => {
			callback.fail(err)
		})
	}

	/**
	 * 添加一个类型的新todo
	 * @param name
	 * @param type
	 * @param callback
	 */
	addOneSimpleItem = (name, type, callback)	=> {
		let mydate = new Date()
		this.connect.create({
			label: name,
			value: type,
			update_time: mydate.toLocaleDateString(),
			jump_url: '',
			comment_last: '',
			comment_list: ''
		}).then(res => {
			callback.success(res)
		}).catch(err => {
			callback.fail(err)
		})
	}

	/**
	 * 改变一个todo的状态
	 * @param name
	 * @param newtype
	 * @param callback
	 */
	changeType = (name, newtype, callback) => {
		let mydate = new Date()
		this.connect.update({
			value: newtype,
			update_time: mydate.toLocaleDateString()
		},{
			where: {label: name}
		}).then(res => {
			callback.success(res)
		}).catch(err => {
			callback.fail(err)
		})
	}

	/**
	 * 编辑item
	 * @param oldname
	 * @param newname
	 * @param callback
	 */
	editName = (oldname, newname, callback) => {
		let mydate = new Date()
		this.connect.update({
			label: newname,
			update_time: mydate.toLocaleDateString()
		},{
			where: {label: oldname}
		}).then(res => {
			callback.success(res)
		}).catch(err => {
			callback.fail(err)
		})
	}

	/**
	 * 删除一个item
	 * @param name
	 * @param callback
	 */
	deleteItem = (name, callback) => {
		this.connect.destroy({
			where: {label: name}
		}).then(res => {
			callback.success(res)
		})
	}

	getCommontList = (name, callback) => {
		this.connect.findOne({where:{label: name}}).then(res => {
			callback.success(res.dataValues.comment_list)
		})
	}
	/**
	 * 给一个todo增加备注
	 * @param name
	 * @param comment
	 * @param callback
	 */
	addCommont = (name, comment, callback) => {
		this.connect.update({
			comment_list: comment
		},{
			where: {label: name}
		}).then(res => {callback.success(res)})
	}

}
