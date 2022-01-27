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
				>
						<a-descriptions-item label="Product" :span="1">
                <a-input v-model:value="formState.name"/>
            </a-descriptions-item>
            
            <a-descriptions-item label="Category" :span="2">
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
            </a-descriptions-item>
						<a-descriptions-item label="status" :span="3">

				<a-radio-group v-model:value="formState.status" button-style="solid">
					<a-radio-button value="0">待上架</a-radio-button>
					<a-radio-button value="1">已上架</a-radio-button>
					<a-radio-button value="2">已下架</a-radio-button>
					<a-radio-button value="3">售罄</a-radio-button>
				</a-radio-group>
						</a-descriptions-item>
						<a-descriptions-item label="Detail Description" :span="3">
                <a-textarea v-model:value="formState.description" placeholder="input your description" :rows="4"/>
               </a-descriptions-item>
						<a-descriptions-item label="Main_Image" :span="3">
								<img style="width: 300px;height: 300px;" alt="picture load fail" :src="formState.main_image">
						</a-descriptions-item>
						<a-descriptions-item label="Price">
                <a-input-number
                v-model:value="formState.price"
                :formatter="value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="value => value.replace(/\¥\s?|(,*)/g, '')"
                :min="0.01"
                :step="0.01"
                string-mode
                style="width: 100px"
                />
</a-descriptions-item>
						<a-descriptions-item label="Amount">
                <a-input-number v-model:value="formState.amount">
                </a-input-number>
            </a-descriptions-item>
						<a-descriptions-item label="Sales">{{ formState.sales }}</a-descriptions-item>
						<a-descriptions-item :span="3" label="delivery">
                <a-input v-model:value="formState.delivery"/>
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="Assurance">
                <a-input v-model:value="formState.assurance"/>
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="Brand">
                <a-input v-model:value="formState.brand"/>
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="Origin">
                <a-input v-model:value="formState.origin"/>
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="ShelfLife">
                <a-input v-model:value="formState.shelf_life"/>
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="UseWay">
                <a-input v-model:value="formState.use_way"/>
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="PackingWay">
                <a-input v-model:value="formState.packing_way"/>
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="StorageCondition">
                <a-input v-model:value="formState.storage_condition"/>
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="Created">
                {{formState.updated}}
            </a-descriptions-item>
						<a-descriptions-item :span="3" label="Updated">
                {{formState.updated}}
            </a-descriptions-item>
				</a-descriptions>
		</a-modal>
</template>

<script>


import request from "../utils/request";
import {ref} from "vue";
import {Modal} from "ant-design-vue";
export default {
		name: "UpdateProductModal",
		data(){
				return {
						confirm_loading: false,
            treeData: this.$store.getters.getCategories,
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
				},
        
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
				handleCancel() {
						this.confirm_loading = false
            this.$emit('cancel')
				},
				handleOk() {
						this.confirm_loading = true;
            
            setTimeout(
            () => {
                let ur = '/admin/update_product/'+this.formState.product_id
                request({
                    url:ur,
                    method: 'post',
                    data: {
                        "category_id": this.formState.category_id,
                        "main_image": this.formState.main_image,
                        "status": this.formState.status,
                        "name": this.formState.name,
                        "description": this.formState.description,
                        "price": this.formState.price,
                        "amount": this.formState.amount,
                        "use_way":this.formState.use_way,
                        "packing_way":this.formState.packing_way,
                        "shelf_life":this.formState.shelf_life,
                        "storage_condition":this.formState.storage_condition,
                        "origin":this.formState.origin,
                        "brand":this.formState.brand,
                        "delivery":this.formState.delivery,
                        "assurance":this.formState.assurance,
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
                        Modal.success({
                            title:'Update Successful!',
                            content: res.data.message,
                        })
                    } else {
                        Modal.error({
                            title:'Update Fail',
                            content:res.data.message
                        })
                        console.log(res.data.message)
                    }
                }
                ).catch(
                err => console.log(err)
                )
            },
            500
            )
            this.confirm_loading = false
						this.$emit('ok')
				}
		}
}
</script>

<style scoped>

</style>
