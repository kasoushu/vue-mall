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
			:data-source="data"
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
					<a-textarea  v-model:value="formState.description" placeholder="input your description" :rows="4" />
				</a-form-item>
				
				<a-form-item name="category">
					<p>Category</p>
					<a-tree-select
						v-model:value="formState.category_id"
						tree-data-simple-mode
						style="width: 100%"
						:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
						:tree-data="treeData"
						placeholder="Please select"
						:load-data="onLoadData"
					>
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
						
						v-model:value="formState.amount"
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
import request from "../../utils/request";
import {computed} from "vue";
import { usePagination } from 'vue-request';

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
	title: 'Created',
		dataIndex: 'created'
	},
{
		title:'Operation',
		dataIndex: 'operation',
		// width:'10%',
		slots: { customRender: "operation" }
}
];


function requestPages(params){
	return request.get('/admin/get_page',{params})
}

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
			treeData:this.$store.getters.getCategories,
			modalVisible:false,
			selectedRowKeys:[],
			cnt:100000,
			columns,
			button_loading:false,
			confirm_loading:false,
		};
	},
	setup(){
		const {
			data,
			current,
			totalPage,
			loading,
			pageSize
		} = usePagination(requestPages, {
			defaultParams: [
				{
					page_size: 11,
				},
			],
			formatResult: res=> res.data.data.list,
			pagination: {
				currentKey: 'page_index',
				pageSizeKey: 'page_size',
			},
		});
		// const data = list.list
		// console.log(list.value);
		// console.log(current);
		// console.log(totalPage);
		// console.log(pageSize);
		const pagination = computed(() => ({
			total: 100,
			current: current.value,
			pageSize: pageSize.value,
		}));
		// console('p',pagination)
		// const list = computed(() =>
		// 	{
		// 		data.list
		// 	}
		//  );
		// pagination(){
		// 	return  {
		// 		total:this.totalPage,
		// 		current: this.current,
		// 		pageSize: this.pageSize,
		// 	}
		// },
		return {
			data,
			loading,
			current,
			totalPage,
			pageSize,
			pagination
		};
	},
	created() {
		//categories initiate
		//request
		this.$store.commit('initCategory')
		// this.treeData = this.$store.getters.getCategories
		// console.log(this.$store.getters.getCategories)
		
		// pages
		

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
			this.confirm_loading=false
		},
		handleAddOk(){
			this.confirm_loading=true
			console.log('state  ',this.formState)
			setTimeout(
				()=>{
					request({
				url: '/admin/create_product',
				method: 'post',
				data: {
					"category_id":this.formState.category_id,
					"main_image":this.formState.main_image,
					"status":this.formState.status,
					"name":this.formState.name,
					"description":this.formState.description,
					"price":this.formState.price,
					"amount":this.formState.amount,
				}
			}).then(
				res => {
					console.log(res)
					if (res.data.code === 401) {
						this.$store.commit('cleanToken')
						console.log(res.message)
					} else if (res.data.code === 200) {
						this.modalVisible=false
						this.confirm_loading=false
					} else {
						console.log(res.message)
					}
				}
			).catch(
				err => console.log(err)
			)
				},
				500
			)

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
		
		onLoadData() {
			return treeNode => {
				return new Promise(resolve => {
					const {
						id,
					} = treeNode.dataRef;
					setTimeout(() => {
						let url = '/admin/get_category_parent/'+id
						request({
							url:url,
							method: 'get',
						}).then(
							res=>{
								let c =[]
								console.log(res)
								if (res.data.code===401){
									this.$store.commit('cleanToken')
									console.log(res.message)
								}else if (res.data.code===200){
									let t= res.data.data.total
									// console.log(t)
									for (let i=0;i<t;i++){
										c.push({
											id: res.data.data.list[i].id,
											pId:res.data.data.list[i].parent_id ,
											value: res.data.data.list[i].id,
											title: res.data.data.list[i].name,
											// isLeaf:res.data.list[t].parent_id===0,
										})
									}
									this.$store.commit('addCategory',c)
									this.treeData.concat(c)
								}else {
									console.log(res.message)
								}
							}
						).catch(
							err=>console.log(err)
						)

						resolve(true);
					}, 300);
				});
			}
		},
		
		
		button_enable(){
			return this.selectedRowKeys.length === 0;
			
		},
		getData(){
			// return Array.from(this.data.values())
			return this.data
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