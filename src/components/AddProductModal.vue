<template>
	<a-modal v-model:visible="modalVisible"
			 :title="modalTitle"
			 @cancel="handleAddCancel"
			 @ok="handleAddOk"
			 :confirm-loading="confirm_loading"
			 ok-text="Submit"
			 width="60%"
	>
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
				<a-textarea v-model:value="formState.description" placeholder="input your description" :rows="4"/>
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
				name="main_image">
				<p>MainImage</p>
				<img style="width: 300px;height: 300px;" :src="formState.main_image">
				<a-input placeholder="input your image link" v-model:value="formState.main_image"/>
			</a-form-item>
			
			<a-form-item>
				<p>Status</p>
				<a-radio-group v-model:value="formState.status" button-style="solid">
					<a-radio-button value="0">待上架</a-radio-button>
					<a-radio-button value="1">已上架</a-radio-button>
					<a-radio-button value="2">已下架</a-radio-button>
					<a-radio-button value="3">售罄</a-radio-button>
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
</template>

<script>


import request from "../utils/request";
export default {
	name: "AddProductModal",
	data(){
		return {
			confirm_loading: false,
			treeData: this.$store.getters.getCategories,
		}
	},
	emits:{
		getCurrent:null,
      cancel:null,
	},
	props:{
		formState:Object,
		modalTitle: "",
		modalVisible: false,
	},
	setup(props){
	
	},
	created() {
	},
	computed:{
		
		onLoadData() {
			return treeNode => {
				return new Promise(resolve => {
					const {
						id,
					} = treeNode.dataRef;
					setTimeout(() => {
						let url = '/admin/get_category_parent/' + id
						request({
							url: url,
							method: 'get',
						}).then(
							res => {
								let c = []
								console.log(res)
								if (res.data.code === 401) {
									this.$store.commit('cleanToken')
									alert("your token is unavailable ")
									this.$router.push("/admin_login")
									console.log(res.message)
									
								} else if (res.data.code === 200) {
									let t = res.data.data.total
									// console.log(t)
									for (let i = 0; i < t; i++) {
										c.push({
											id: res.data.data.list[i].id,
											pId: res.data.data.list[i].parent_id,
											value: res.data.data.list[i].id,
											title: res.data.data.list[i].name,
											// isLeaf:res.data.list[t].parent_id===0,
										})
									}
									this.$store.commit('addCategory', c)
									this.treeData.concat(c)
								} else {
									console.log(res.message)
								}
							}
						).catch(
							err => console.log(err)
						)
						
						resolve(true);
					}, 300);
				});
			}
		},
	},
	methods:{
		handleAddCancel() {
			this.confirm_loading = false
        this.$emit('cancel')
		},
		handleAddOk() {
			this.confirm_loading = true
			console.log('state  ', this.formState)
			setTimeout(
				() => {
					request({
						url: '/admin/create_product',
						method: 'post',
						data: {
							"category_id": this.formState.category_id,
							"main_image": this.formState.main_image,
							"status": this.formState.status,
							"name": this.formState.name,
							"description": this.formState.description,
							"price": this.formState.price,
							"amount": this.formState.amount,
						}
					}).then(
						res => {
							console.log(res)
							if (res.data.code === 401) {
								this.$store.commit('cleanToken')
								alert("your token is unavailable ")
								this.$router.push("/admin_login")
								console.log(res.data.message)
								
							} else if (res.data.code === 200) {
								this.confirm_loading = false
								// this.current = Math.ceil(this.total / 11)
								this.$emit('getCurrent')
							} else {
								console.log(res.data.message)
							}
						}
					).catch(
						err => console.log(err)
					)
				},
				500
			)
			
		},
	}
}
</script>

<style scoped>

</style>