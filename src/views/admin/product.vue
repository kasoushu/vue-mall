<template>
	<div class="pagination-container">
		<NSpin class="pagination-container__list" :show="loading">
			<NList bordered>
				<NListItem v-for="item in list" :key="item.id">
					<template #prefix>
						<NAvatar>{{ item.name[0] }}</NAvatar>
					</template>
					<template #suffix>
						<span class="pagination-container__list-suffix">{{ item.job }}</span>
					</template>
					{{ item.name }}
				</NListItem>
			</NList>
		</NSpin>
		
		<div class="pagination-container__page">
			<NPagination
				v-model:page="current"
				v-model:page-size="pageSize"
				:page-count="totalPage"
				:page-slot="5"
				:page-sizes="[5, 10, 20]"
				show-size-picker
			/>
		</div>
	</div>
</template>

<script lang="ts">
import axios from 'axios';
import { computed, defineComponent } from 'vue';
import { usePagination } from 'vue-request';

type Data = {
	data: {
		id: number;
		name: string;
		avatar: string;
		job: string;
	}[];
	total: number;
};

function testService(params: { page?: number; limit?: number }) {
	return axios.get<Data>('https://61273138c2e8920017bc0b3c.mockapi.io/api/users', {
		params,
	});
}

export default defineComponent({
	name: 'App',
	components: {

	},
	setup() {
		const { data, current, totalPage, loading, pageSize } = usePagination(testService, {
			defaultParams: [
				{
					limit: 5,
				},
			],
			pagination: {
				currentKey: 'page',
				pageSizeKey: 'limit',
				totalKey: 'data.total',
			},
		});
		
		const list = computed(() => data.value?.data.data || []);
		
		return {
			list,
			loading,
			current,
			totalPage,
			pageSize,
		};
	},
});
</script>
<style lang="scss">
.pagination-container {
	height: 420px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	&__list {
		height: 370px;
		overflow: auto;
		
		&-suffix {
			margin-right: 20px;
		}
	}
}
</style>
