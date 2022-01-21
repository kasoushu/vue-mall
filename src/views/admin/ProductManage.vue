<template>
	<div>
		<a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">Add</a-button>
		<a-table
			bordered
			:columns="columns"
			:data-source="data"
			:loading="loading"
		>
			<template  v-if="column.dataIndex === 'operation'">
				<div class="editable-row-operations">
					hello
				</div>
			</template>
		</a-table>
	</div>
</template>
<script>
// import { usePagination } from 'vue-request';
import axios from 'axios';

const columns = [{
	title: 'Name',
	dataIndex: 'name',
	sorter: true,
	// width: '20%',
}, {
	title: 'Category',
	dataIndex: 'category',
	filters: [],
	// width: '20%',
}, {
	title: 'Price',
	dataIndex: 'price',
},{
	title: 'Amount',
	dataIndex: 'amount'
},
	{
	title: 'Sales',
	dataIndex: 'sales'
}, {
	title: 'Status',
	dataIndex: 'status'
},{
		title:'Operation',
		dataIndex: 'operation'
}
];

const queryData = params => {
	return axios.get('https://randomuser.me/api?noinfo', {
		params,
	});
};

export default {
	name:"ProductManage",
	data(){
		return {
			data:[
			],
			cnt:0,
			loading:false,
			columns,
			cur:0,
			pageTotal:0,
			pagination:{
				total:15,
				current: 1,
				pageSize:10,
			},
		};
	},
	methods:{
		// handlePageChange(pag,filters,sorter){
		// 	// this.pagination.current = this.cur
		// 	// this.pagination.total = this.pageTotal
		//
		// },
		handleAdd (){
			this.cnt++;
      		const newData = {
        		key: this.cnt,
        		name: `Edward King `,
				category: 'Male',
				price:19.9,
				amount:this.cnt,
				sales:9999,
        		status: `on sale`,
      		};
      		this.data.push(newData);
    	},
	},
	computed:{

	},
}
</script>
