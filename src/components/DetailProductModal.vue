<template>
	<a-modal v-model:visible="modalVisible"
			 @cancel="handleCancel"
			 @ok="handleOk"
			 :confirm-loading="confirm_loading"
			 ok-text="Ok"
			 width="60%"
	>
			<a-descriptions
					title="Product Details"
					bordered
					:column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
			>
					<a-descriptions-item label="Product">{{ formState.name }}</a-descriptions-item>
					<a-descriptions-item label="status">{{ mystatus }}</a-descriptions-item>
					<a-descriptions-item label="Category">{{ formState.category_name }}</a-descriptions-item>
					<a-descriptions-item label="Detail Description" :span="3">{{ formState.description }}</a-descriptions-item>
					<a-descriptions-item label="Main_Image" :span="3">
							<img style="width: 300px;height: 300px;" alt="picture load fail" :src="formState.main_image">
					</a-descriptions-item>
					<a-descriptions-item label="Price">{{ '¥' + formState.price }}</a-descriptions-item>
					<a-descriptions-item label="Amount">{{ formState.amount }}</a-descriptions-item>
					<a-descriptions-item label="Sales">{{ formState.sales }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="delivery">{{ formState.delivery }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="Assurance">{{ formState.assurance }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="Brand">{{ formState.brand }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="Origin">{{ formState.origin }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="ShelfLife">{{ formState.shelf_life }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="UseWay">{{ formState.use_way }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="PackingWay">{{ formState.packing_way }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="StorageCondition">{{ formState.storage_condition }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="Created">{{ formState.created }}</a-descriptions-item>
					<a-descriptions-item :span="3" label="Updated">{{ formState.updated }}</a-descriptions-item>
			</a-descriptions>
	</a-modal>
</template>

<script>


import request from "../utils/request";
export default {
	name: "DetailProductModal",
	data(){
		return {
			confirm_loading: false,
		}
	},
	emits:{
		ok:null,
      cancel:null,
	},
	props:{
		formState:Object,
		modalVisible: Boolean,
	},
	setup(props){
	
	},
	created() {

	},
	computed:{
		categoryName(){
			return this.$store.getters.getCategoryName(this.formState.category_id)
		},
		mystatus(){
				switch (this.formState.status) {
						case '0' : return '待上架';
						case '1' : return '已上架';
						case '2' : return '已下架';
						case '3' : return '售罄';
				}
				return  '状态不明'
		}
	},
	methods:{
		handleCancel() {
			this.confirm_loading = false
        this.$emit('cancel')
		},
		handleOk() {
				this.confirm_loading = true;
				this.$emit('ok')
				this.confirm_loading=false;
		}
	}
}
</script>

<style scoped>

</style>
