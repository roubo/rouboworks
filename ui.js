import {
	h, Component, Color, Bold, Fragment
} from 'ink'

import {Tabs, Tab} from 'ink-tab'
import Divider from 'ink-divider'
import {Select} from 'ink-select'

export default class UI extends Component {

	constructor(props) {
		super(props)
		this.state = {
			activeTabName: null,
			todolist : [
				{
					label: "试用ink组件",
					value: 1,
				},
				{
					label: "基于终端的窗口",
					value: 2,
				}
			],
			doinglist : [
				{
					label: "搭建ink组件",
					value: 1,
				}
			],
			donelist : [
				{
					label: "安装ink组件",
					value: 1,
				}
			],
			releaselist : null

		}
	}

	_onChangeTab = (name, activeTab) => {
		this.setState({
			activeTabName: name
		})
	}

	_renderTable = () => {
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
					<Select options={tabledata}/>
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
			</div>

		);
	}
}

