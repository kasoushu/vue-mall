<template>
	<div>
		<a-button type="primary" class="editable-add-btn"
				  style="margin-bottom: 8px"
				  @click="handleAdd">Add
		</a-button>
		<a-button type="primary" danger :loading="button_loading"
				  :disabled="button_enable"
				  class="editable-add-btn"
				  style="margin-left: 25px"
				  @click="handleDelete">Delete
		</a-button>
		<a-table
			bordered
			:columns="columns"
			:data-source="getData"
			:loading="loading"
			:row-selection="rowSelection"
			:pagination="pagination"
		>
			<template v-slot:operation="{column,record}"	>
				<div class="editable-row-operations">
						<span >
            				<a @click="">Edit</a>
          				</span>
					<span >
            				<a @click="">Delete</a>
          				</span>
				</div>


			</template>
		</a-table>
		{{selectedRowKeys}}
	</div>
</template>
<script>
// import { usePagination } from 'vue-request';
import axios from 'axios';
import { Table } from 'ant-design-vue';

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
		dataIndex: 'operation',
		width:'10%',
		slots: { customRender: "operation" }
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
			selectedRowKeys:[],
			data:new Map(),
			cnt:100000,
			loading:false,
			columns,
			cur:0,
			pageTotal:0,
			pagination:{
				// total:15,
				// current: 1,
				pageSize:11,
			},
			button_loading:false,
		};
	},
	created() {
	
	},
	methods:{
		// handlePageChange(pag,filters,sorter){
		// 	// this.pagination.current = this.cur
		// 	// this.pagination.total = this.pageTotal
		//
		// },
		handleDelete(){
			this.button_loading = true;
			let cnt = 0;
			for (let v of this.selectedRowKeys) {
				this.data.delete(v)
			}
			this.selectedRowKeys=[]
			this.button_loading = false;
		},
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
				operation:'',

      		};
      		this.data.set(this.cnt,newData);
    	},
		onSelectChange (changeableRowKeys ){
      		console.log('selectedRowKeys changed: ', changeableRowKeys);
      		this.selectedRowKeys = changeableRowKeys;
		},
	},
	computed:{
		button_enable(){
			return this.selectedRowKeys.length === 0;
			
		},
		getData(){
			return Array.from(this.data.values())
		},
		rowSelection (){
			return {
        		selectedRowKeys: this.selectedRowKeys,
        		onChange: this.onSelectChange,
        		hideDefaultSelections: true,
        		selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE, {
          			key: 'odd',
          			text: 'Select Odd Row',
          			onSelect: changableRowKeys => {
					  let newSelectedRowKeys = [];
            			newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
							if (index % 2 !== 0) {
                				return false;
              				}
							return true;
            			});
            	this.selectedRowKeys = newSelectedRowKeys;
          		},},
					{
          			key: 'even',
          			text: 'Select Even Row',
          			onSelect: changableRowKeys => {
            		let newSelectedRowKeys = [];
					newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
              		if (index % 2 !== 0) {
                		return true;
              			} return false;
            		});
            		this.selectedRowKeys = newSelectedRowKeys;}, }],
      			};},
	},
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
	
}
.editable-row-operations{
}
</style>