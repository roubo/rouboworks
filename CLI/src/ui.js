import {
	h, Component, Color, Bold, Fragment
} from 'ink'

import {Tabs, Tab} from 'ink-tab'
import Divider from 'ink-divider'
import SelectInput from 'ink-select-input'
import Box from 'ink-box'
import ToDoModel from './models/todoModel'
import TextInput from 'ink-text-input'

export default class UI extends Component {

	constructor(props) {
		super(props)
		this.state = {
			activeTabName: null,
			activeItemName: null,
			selectedlist: null,
			todolist : null,
			doinglist : null,
			donelist : null,
			releaselist : null,
			inputText: "",
			isInputing: false,
			isSelecting: false,
			isEditing: false,
			isAddCommond: false,
			showDetail: false,
			activeCommlist: null
		}
	}

	/**
	 * 更新列表数据
	 * @private
	 */
	_updateList = () => {
		let todo  = new ToDoModel()
		todo.getOneList("todo",{
			success: (res) => {
				if(res) {
					if(Array.isArray(res)){
						this.setState({
							todolist: res.concat({
								label: '新增一个todo',
								value: 'add'
							})
						})
					} else {
						this.setState({
							todolist: [].concat(res).concat({
								label: '新增一个todo',
								value: 'add'
							})
						})
					}

				}else{
					this.setState({
						todolist: [{
							label: '新增一个todo',
							value: 'add'
						}]
					})
				}
			},
			fail: (err) => {
				console.warn(err)
			}
		})
		todo.getOneList("doing",{
			success: (res) => {
				if(res) {
					if(Array.isArray(res)){
						this.setState({
							doinglist: res
						})
					} else {
						this.setState({
							doinglist: [].concat(res)
						})
					}

				}
			}
		})
		todo.getOneList("done",{
			success: (res) => {
				if(res) {
					if(Array.isArray(res)){
						this.setState({
							donelist: res
						})
					} else {
						this.setState({
							donelist: [].concat(res)
						})
					}

				}
			}
		})
		todo.getOneList("release",{
			success: (res) => {
				if(res) {
					if(Array.isArray(res)){
						this.setState({
							releaselist: res
						})
					} else {
						this.setState({
							releaselist: [].concat(res)
						})
					}

				}
			}
		})
	}

	_updateCommonList = () => {
		let todo = new ToDoModel()
		todo.getCommontList(this.state.activeItemName, {
			success: (res) => {
				this.setState({
					activeCommlist: res
				})
			}
		})
	}

	componentDidMount() {
		this._updateList()

	}

	/**
	 * 导航栏change事件
	 * @param name
	 * @param activeTab
	 * @private
	 */
	_onChangeTab = (name, activeTab) => {
		this.setState({
			activeTabName: name
		})
	}

	/**
	 * 列表选中件
	 * @param item
	 * @private
	 */
	_onSelected = (item) => {
		if(this.state.activeTabName === 'todo') {
			if(item.value === 'add') {
				this.setState({
					isInputing : true
				})

			} else {
				this.setState({
					activeItemName: item.label,
					isSelecting: true
				})
			}
		} else {
			this.setState({
				activeItemName: item.label,
				isSelecting: true
			})
		}
	}

	/**
	 * 渲染列表区域
	 * @returns {*}
	 * @private
	 */
	_renderTable = () => {
		if(this.state.isInputing || this.state.isSelecting || this.state.showDetail) {
			return null
		}
		let tabledata = null
		switch (this.state.activeTabName) {
			case "todo"	:
				tabledata = this.state.todolist
				break
			case "doing":
				tabledata = this.state.doinglist
				break
			case "done":
				tabledata = this.state.donelist
				break
			case "release":
				tabledata = this.state.releaselist
				break
			default:
				tabledata = null
				break
		}
		if(tabledata) {
			return (
				<div>
					<SelectInput items={tabledata} onSelect={this._onSelected}/>
					<br/>
					<Divider width={100} padding={0} dividerChar="-" dividerColor="green"/>
				</div>
			)
		}else{
			return (
				<Color red>暂无数据</Color>
			)
		}
	}

	_onSelectDetailItem = (item) => {

		if(item.value === 1) {
			this.setState({
				isInputing: true,
				isAddCommond: true
			})
		} else {
			this.setState({
				showDetail: false
			})
		}
	}
	/**
	 * 渲染详情区域
	 * @returns {null}
	 * @private
	 */
	_renderDetail = () => {

		if(this.state.showDetail) {
			return (
				<div>
					<Box  borderStyle="round" borderColor="cyan" float="left" padding={1}>
						{this.state.activeCommlist}
					</Box>
					<br/>
					<SelectInput
						items={[
							{
								label: '新增一个备注',
								value: 1
							},
							{
								label: '返回',
								value: 2
							}
						]}
						onSelect={this._onSelectDetailItem}
					/>
					<br/>
					<Divider width={100} padding={0} dividerChar="-" dividerColor="green"/>
				</div>
			)
		}
		return null
	}

	_onInputChange = (value) => {
		this.setState({
			inputText: value
		})
	}

	_onInputSubmit = (value) => {
		let todo = new ToDoModel()
		let addComm = ""
		if(this.state.isEditing) {
			todo.editName(this.state.activeItemName, value, {
				success: (res) => {
					this._updateList()
				}
			})
		} else if(this.state.isAddCommond) {
			if(this.state.activeCommlist){
				addComm = this.state.activeCommlist + '\n' + value
			}else{
				addComm = value
			}
			todo.addCommont(this.state.activeItemName, addComm, {
				success: (res) => {
					this._updateCommonList()
				}
			})
		} else {
			todo.addOneSimpleItem(value, "todo", {
				success: (res) => {
					this._updateList()
				}
			})
		}
		this.setState({
			isInputing: false,
			isEditing: false,
			isAddCommond: false
		})
	}
	/**
	 * 渲染输入区域
	 * @returns {*}
	 * @private
	 */
	_renderInput = () => {
		if(!this.state.isInputing) {
			return null
		}
		return (
			<div>
				Input 》》
				<TextInput
					value={this.state.inputText}
					onChange={this._onInputChange}
					onSubmit={this._onInputSubmit}
				/>
				<br/>
				<Divider width={100} padding={0} dividerChar="-" dividerColor="green"/>
			</div>
		)
	}


	_onSelectSelectItem = (item) => {
		let todo = new ToDoModel()
		switch (item.label) {
			case "开始" :
				todo.changeType(this.state.activeItemName, 'doing', {
					success: (res) => {
						this._updateList()
						this.setState({
							isSelecting: false
						})
					}
				})
				break
			case "完成" :
				todo.changeType(this.state.activeItemName, 'done', {
					success: (res) => {
						this._updateList()
						this.setState({
							isSelecting: false
						})
					}
				})
				break
			case "删除" :
				todo.deleteItem(this.state.activeItemName, {
					success: (res) => {
						this._updateList()
						this.setState({
							isSelecting: false
						})
					}
				})
				break
			case "修改" :
				this.setState({
					isInputing : true,
					isEditing: true
				})
				break
			case "查看备注" :
				this._updateCommonList()
				this.setState({
					showDetail: true,
					isSelecting: false
				})
				break
			case "返回" :
				this.setState({
					isSelecting: false
				})
				break
			default:
				break
		}
	}
	/**
	 * 渲染选择框区域
	 * @private
	 */
	_renderSelect = () => {
		let data = [
			{
				label: this.state.activeTabName === "todo" ? "开始" : "完成",
				value: '1'
			},
			{
				label: "删除",
				value: '2'
			},
			{
				label: "修改",
				value: '3'
			},
			{
				label: "查看备注",
				value: '4'
			},
			{
				label: "返回",
				value: '5'
			},

		]

		if(!this.state.isSelecting) {
			return null
		}
		return (
			<div>
				<SelectInput
					items = {data}
					onSelect={this._onSelectSelectItem}
				/>
			</div>
		)
	}

	render() {
		return (
			<div>
				<Divider width={100} padding={0} dividerChar="-" dividerColor="green"/>
				<Tabs onChange={this._onChangeTab}>
					<Tab name={"todo"}>todo</Tab>
					<Tab name={"doing"}>doing</Tab>
					<Tab name={"done"}>done</Tab>
					<Tab name={"release"}>release</Tab>
				</Tabs>
				<br/>
				<Divider width={100} padding={0} dividerChar="-" dividerColor="green"/>
				<div>
					{this._renderTable()}
				</div>
				<div>
					{this._renderDetail()}
				</div>
				<div>
					{this._renderSelect()}
				</div>
				<div>
					{this._renderInput()}
				</div>

			</div>

		);
	}
}

