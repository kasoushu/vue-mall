<template>
    <div>
        <a-table
        
        bordered
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :row-selection="rowSelection"
        :pagination="pagination"
        @change="handleTableChange"
        >
            
            
            <template v-slot:status="{record}">
                <div class="editable-row-operations">
                <span>
                    {{getStatus(record)}}
                </span>
                </div>
            </template>
            
            <template v-slot:operation="{column,record}">
                <div class="editable-row-operations">
						<span>
            				<a @click="handleUpdate(record)">Update</a>
          				</span>
                    <span>
            				<a @click="handleSingleDelete(record.key)">Delete</a>
          				</span>
                    
                    <span>
            				<a @click="handleDetail(record)">Detail</a>
          				</span>
                </div>
            </template>
        
        </a-table>
        
        <add-product-modal
        :form-state="formState"
        :modal-title="modalTitle"
        :modal-visible="modalVisible"
        @getCurrent="setcurrent"
        @cancel="this.modalVisible=false"
        >
        </add-product-modal>
        <detail-product-modal
        :form-state="formState"
        :modal-visible="detailVisible"
        @ok="this.detailVisible=false"
        
        @cancel="this.detailVisible=false"
        >
        
        </detail-product-modal>
        <update-product
        :form-state="formState"
        :modal-visible="updateVisible"
        @cancel="this.updateVisible=false"
        @ok="this.updateVisible=false"
        ></update-product>
    
    
    </div>
</template>
<script>
import {Modal, Table} from 'ant-design-vue';
import request from "../../utils/request";
import {computed} from "vue";
import {usePagination} from 'vue-request';
import AddProductModal from "@/components/AddProductModal";
import DetailProductModal from "@/components/DetailProductModal";
import UpdateProduct from "@/components/UpdateProduct";
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    // width: '20%',
}, {
    title: 'Category',
    dataIndex: 'category_name',
    filters: [],
    // width: '20%',
}, {
    title: 'Price',
    dataIndex: 'price',
}, {
    title: 'Amount',
    dataIndex: 'amount'
},
    {
        title: 'Sales',
        dataIndex: 'sales'
    }, {
        title: 'Status',
        dataIndex: 'st',
        slots: {customRender: "status"}
    }, {
        title: 'Created',
        dataIndex: 'created'
    },
    {
        title: 'Operation',
        dataIndex: 'operation',
        // width:'10%',
        slots: {customRender: "operation"}
    }
];


function requestPages(params) {
    return request.get('/admin/get_order_page', {params})
}

export default {
    name: "OrderManage",
    components:{
        AddProductModal,
        DetailProductModal,
        UpdateProduct,
    },
    data() {
        return {
            selectedRowKeys: [],
            columns,
            button_loading: false,
            modalTitle: "",
            modalVisible: false,
            detailVisible:false,
            updateVisible:false,
        };
    },
    
    
    setup() {
        const {
            data,
            run,
            loading,
            total,
            current,
            pageSize,
        } = usePagination(requestPages, {
            formatResult: res => res.data.data,
            defaultParams: [
                {
                    page_size:11,
                }
            ],
            pagination: {
                currentKey: 'page_index',
                pageSizeKey: 'page_size',
                // totalKey:'data.total',
            },
        });
        const pagination = computed(() => ({
            total: total.value,
            current: current.value,
            pageSize: 11,
        }));
        
        const dataSource = computed(() => {
            return data.value?.list;
        }
        );
        
        const handleTableChange = (pag, filters, sorter) => {
            run({
                page_size: 11,
                page_index: pag?.current,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters,
            });
        };
        
        return {
            dataSource,
            pagination,
            loading,
            total,
            current,
            handleTableChange,
        };
    },
    
    created() {
        this.$store.commit('initCategory')
    },
    methods: {
        // handlePageChange(pag,filters,sorter){
        // 	// this.pagination.current = this.cur
        // 	// this.pagination.total = this.pageTotal
        //
        // },
        setcurrent(){
            this.modalVisible = false
            this.current=  Math.ceil((this.total+1)/11)
            this.cleanFormSate()
        },
        
        handleDetail(record){
            this.formState=record
            this.detailVisible=true
        },
        handleSingleDelete(key){
            let u ='/admin/delete_product/'+key
            request({
                url:u,
                method:'post'
            }).then(
            res =>{
                if (res.data.code === 401) {
                    this.$store.commit('cleanToken')
                    alert("your token is unavailable ")
                    this.$router.push("/admin_login")
                    console.log(res.data.message)
                } else if (res.data.code === 200) {
                    this.current = 1
                    Modal.success({
                        title:res.data.message,
                    })
                } else {
                    alert(res.data.message)
                }
            }
            ).catch(
            err=> console.log(err)
            )
        },
        handleUpdate(record){
            
            this.formState=record
            this.updateVisible=true
        },
        cleanFormSate(){
            this.formState={
                id: 0,
                category_id: 0,
                category_name: "",
                title: "",
                main_image: "",
                detail_image: "",
                delivery: "",
                assurance: "",
                weight: 0,
                brand: "",
                origin: "",
                shelf_life: "",
                use_way: "",
                packing_way: "",
                storage_condition: "",
                status: "",
                name: "",
                description: "",
                price: 0.01,
                amount: 1,
                sales: 0,
                created: "",
                updated: "",
            }
        },
        handleDelete() {
            this.button_loading = true;
            for (let v of this.selectedRowKeys) {
                let u ='/admin/delete_product/'+v
                request({
                    url:u,
                    method:'post'
                }).then(
                res =>{
                    if (res.data.code === 401) {
                        this.$store.commit('cleanToken')
                        // alert("your token is unavailable ")
                        Modal.error({
                            title:'error',
                            content:res.data.message
                        })
                        this.$router.push("/admin_login")
                        console.log(res.data.message)
                    } else if (res.data.code === 200) {
                        this.current = 1
                        Modal.success({
                            title:'Delete successful!',
                        })
                    } else {
                        // alert(res.data.message)
                        Modal.error({
                            title:'error',
                            content:res.data.message
                        })
                    }
                }
                ).catch(
                err=> console.log(err)
                )
            }
            
            this.selectedRowKeys = []
            this.deleteCnt=0;
            this.button_loading = false;
        },
        
        
        handleAdd() {
            this.modalVisible = true;
            this.modalTitle = "Add Product"
        },
        onSelectChange(changeableRowKeys) {
            console.log('selectedRowKeys changed: ', changeableRowKeys);
            this.selectedRowKeys = changeableRowKeys;
        },
    },
    computed: {
        button_enable() {
            return this.selectedRowKeys.length === 0;
            
        },
        getStatus(){
            return (record)=>{
                
                switch (record.status) {
                    case '0' : return '待上架';
                    case '1' : return '已上架';
                    case '2' : return '已下架';
                    case '3' : return '售罄';
                }
                return  '状态不明'
            }
        },
        
        rowSelection() {
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
                    },
                },
                    {
                        key: 'even',
                        text: 'Select Even Row',
                        onSelect: changableRowKeys => {
                            let newSelectedRowKeys = [];
                            newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
                                if (index % 2 !== 0) {
                                    return true;
                                }
                                return false;
                            });
                            this.selectedRowKeys = newSelectedRowKeys;
                        },
                    }],
            };
        },
    },
}
</script>

<style scoped>
.editable-row-operations a {
    margin-right: 8px;
    
}

.editable-row-operations {
}
</style>
