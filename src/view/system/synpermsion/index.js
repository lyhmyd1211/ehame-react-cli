import React, { Component } from   'react';;
import { Row, Col, Button, Card, message } from 'antd';

// const FormItem = Form.Item;

class Synpermsion extends Component {

	constructor(props) {
		super(props);
		this.state = {
			date: [],
		};
	}

	componentWillMount() {
		$q.get($q.url + '/devops/service/permission', (data) => {
			this.setState({
				data: data,
			});
		});
	}

	updatePermission(item) {
		$q.get($q.url + '/devops/permission/sync/single/' + item, (data) => {
			if (data.code == 200) {
				message.success('权限码更新成功', 3);
			} else if (data.code == 404) {
				message.error('找不到对应的微服务实例');
			} else {
				message.error(data.result);
			}
		});
	}

	refreshCache(item) {
		$q.get($q.url + '/devops/dev/refesh/cache/' + item, (data) => {
			if (data.code == 200) {
				message.success('刷新缓存成功', 3);
			} else if (data.code == 404) {
				message.error('找不到对应的微服务实例');
			} else {
				message.error(data.result);
			}
		});
	}

	render() {
		const app = this;
		const { data } = this.state;
		return (
			<Row gutter={16}>
				{
					data && data.map(function (item, j) {
						return (
							<Col span={8} key={j} style={{ marginBottom: 10 }}>
								<Card title={item}>
									<div >
										<Button type="primary" htmlType="submit"
											onClick={app.updatePermission.bind(this, item)}
										>更新权限码</Button>
										<Button type="primary" htmlType="submit"
											onClick={app.refreshCache.bind(this, item)}
											style={{ margin: '0px 50px' }}
										>刷新缓存</Button>
									</div>
								</Card>
							</Col>
						);
					})
				}
			</Row>
		);
	}
}

export default Synpermsion;
