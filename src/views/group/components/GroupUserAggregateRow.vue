<template>
	<div class="group-user">
		{{ user.name }}<br>
		Successful Weeks: {{ successfulWeeks }}<br>
		Goals Hit: {{ totalGoalsMet }}, Missed: {{ totalGoalsMissed }}<br>
	</div>
</template>

<style>

.group-user{padding: 15px;}

</style>

<script lang="ts">

import { defineComponent, PropType } from 'vue';
import { GroupUserDetails } from '@/types';

export default defineComponent({

	props: {
		user: {
			type: Object as PropType<GroupUserDetails>,
			required: true,
		},
	},

	data(): {
		user: GroupUserDetails;
	} {
		return {} as {
			user: GroupUserDetails;
		};
	},

	computed: {

		successfulWeeks(): number {
			return Object.values(this.user.aggregate).filter(week => !!week.weekSuccess).length;
		},

		totalGoalsMet(): number {
			return Object.values(this.user.aggregate).reduce((aggregate, week) => {
				return aggregate + week.goalsMet;
			}, 0);
		},

		totalGoalsMissed(): number {
			return Object.values(this.user.aggregate).reduce((aggregate, week) => {
				return aggregate + week.goalsMissed;
			}, 0);
		},
	}

});

</script>
