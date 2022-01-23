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
					
					<span >
            				<a @click="">Detail</a>
          				</span>
				</div>


			</template>
		</a-table>
		<a-modal v-model:visible="modalVisible"
				 :title="modalTitle"
				 @cancel="handleAddCancel"
				 @ok="handleAddOk"
				:confirm-loading="confirm_loading"
				 ok-text="Submit"
				 width="60%"
		>
<!--      <template #footer>-->
<!--        <a-button key="back" @click="handleCancel">Return</a-button>-->
<!--        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Submit</a-button>-->
<!--      </template>-->
			<a-form
				:model="formState"
				name="addProductForm"
				:label-col="{ span: 8 }"
				:wrapper-col="{ span: 16 }"
				@finish=""
				@finishFailed=""
			>
				<p>Name</p>
				<a-form-item
					name="name"
					:rules="[{ required: true, message: 'Please input your product name!' }]"
				>
					<a-input v-model:value="formState.name"/>
				</a-form-item>
				<p>description</p>
				<a-form-item
					name="description"
				>
					<a-textarea  v-model:value="formState.password" placeholder="input your description" :rows="4" />
				</a-form-item>
				
				<a-form-item name="category">
					<p>Category</p>
					<a-tree-select
						v-model:value="formState.category_id"
						show-search
						style="width: 100%"
						:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
						placeholder="Please select category"
						allow-clear
						tree-default-expand-all
						:tree-data="treeData"
					>
						<template #title="{ value: val, title }">
							<b v-if="val === 'parent 1-1'" style="color: #08c">sss</b>
							<template v-else>{{ title }}</template>
						</template>
					</a-tree-select>
				</a-form-item>
				
				
				<a-form-item
					name="main_image" >
					<p>MainImage</p>
					<img style="width: 300px;height: 300px;" :src="formState.main_image">
					<a-input placeholder="input your image link" v-model:value="formState.main_image"/>
				</a-form-item>
				
				<a-form-item>
					<p>Status</p>
					<a-radio-group v-model:value="formState.status" button-style="solid">
						<a-radio-button value="0" >待上架</a-radio-button>
						<a-radio-button value="1" >已上架</a-radio-button>
						<a-radio-button value="2" >已下架</a-radio-button>
						<a-radio-button value="3" >售罄</a-radio-button>
					</a-radio-group>
				</a-form-item>
				
				<a-form-item>
					<p>Price</p>
					<a-input-number
						
						v-model:value="formState.price"
						:formatter="value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
						:parser="value => value.replace(/\¥\s?|(,*)/g, '')"
						:min="0.01"
						:step="0.01"
						string-mode
						style="width: 100px"
					/>
				</a-form-item>
				
				<a-form-item>
					<p>Amount</p>
					<a-input-number
						
						v-model:value="formState.mount"
						:min="1"
						style="width: 100px"
					/>
				</a-form-item>
				
			</a-form>
    </a-modal>
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
		// width:'10%',
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
			formState:{
				id:0,
				category_id:0,
				category_name:"",
				title:"",
				main_image:"",
				detail_image:"",
				delivery:"",
				assurance:"",
				weight:0,
				brand:"",
				origin:"",
				shelf_life:"",
				use_way:"",
				packing_way:"",
				storage_condition:"",
				status:"",
				name:"",
				description:"",
				price:0,
				amount:0,
				sales:0,
				created:"",
				updated:"",
			},
			modalTitle:"",
			modalVisible:false,
			selectedRowKeys:[],
			data:new Map(),
			cnt:100000,
			loading:false,
			columns,
			cur:1,
			pageTotal:10,
			pageSize:11,
			button_loading:false,
			confirm_loading:false,
		};
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
		handleAddCancel(){
		
		},
		handleAddOk(){
			this.modalVisible=false
		},
		handleAdd (){
			// this.cnt++;
      		// const newData = {
        	// 	key: this.cnt,
        	// 	name: `Edward King `,
			// 	category: 'Male',
			// 	category_id: '',
			// 	price:19.9,
			// 	amount:this.cnt,
			// 	sales:9999,
        	// 	status: `on sale`,
			// 	operation:'',
      		// };
      		// this.data.set(this.cnt,newData);
			this.modalVisible=true;
			this.modalTitle="Add Product"
    	},
		onSelectChange (changeableRowKeys ){
      		console.log('selectedRowKeys changed: ', changeableRowKeys);
      		this.selectedRowKeys = changeableRowKeys;
		},
	},
	computed:{
		
		pagination(){
			return  {
				total:this.total,
				current: this.cur,
				pageSize: this.pageSize,
			}
		},
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