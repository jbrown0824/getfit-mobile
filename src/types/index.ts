export interface State {
	user: UserStore
}

export interface AuthUser {
	identityToken: string;
	authorizationCode?: string;
	user: string;
	email: string;
	givenName: string | null;
	familyName: string | null;
}

export interface User {
	id: number;
	name: string;
	email: string;
	email_verified_at: string;
	slack_id: string | null;
	apple_id?: string | null;
	created_at: string;
	updated_at: string;
	last_synced_at: string;
}

export interface Group {
	id: number;
	start_date: string;
	end_date: string;
	group_name: string;
	invite_code: string;
	weekly_goals: number | null;
	active_calories: number | null;
	active_minutes: number | null;
	active_stand_hours: number | null;
	daily_steps: number | null;
	free_skips: number | null;
	cost_per_skip: number | null;
	slack_channel: string | null;
	created_at: string;
	updated_at: string;
}

export interface UserAggregateStat {
	week: string;
	goalsMet: number;
	goalsMissed: number;
	weekSuccess: boolean;
}

export interface UserAggregateStats {
	[key: string]: UserAggregateStat
}

export interface GroupUserDetails extends User {
	aggregate: UserAggregateStats
}

export interface GroupDetails extends Group {
	users: GroupUserDetails[];
}

export interface UserStore {
	authUser: null | AuthUser;
	user: null | User;
	activeGroupId: null | number;
	groups: Group[];
	platform: string | null;
	lastCheckedAt: null | Date;
}
