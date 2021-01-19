import { Plugins } from '@capacitor/core';
const { CapacitorHealthkit } = Plugins;
import { parseISO } from 'date-fns';

export async function requestAccess() {
	console.log('requesting authorization');
	try {
		await CapacitorHealthkit.requestAuthorization({
			all: ['steps', 'stairs', 'distance', 'calories', 'activity'],
			read: ['steps', 'stairs', 'distance', 'duration', 'calories', 'activity'], // ask for Read Only permission
			write: [],
		});
		return true;
	} catch (e) {
		console.log('could not get access', e.message);
		return false;
	}
}

export async function queryActivitySummary(startDate: string, endDate?: string) {
	try {
		const hasAccess = await requestAccess();
		if (!hasAccess) {
			console.log('access to healthkit not provided');
			return false;
		}
	} catch (e) {
		console.log('failed to request access', e.message);
	}
	// sample name, start date (string), end Date (date), limit (0 to infinite)
	// let start = "2019/07/01" // YY/MM/DD
	// this.dataName = sampleName;
	// const startDate = new Date();
	// startDate.setHours(0, 0, 0, 0);
	//
	// const endDate = new Date();
	// this.stats = await CapacitorHealthkit.queryHKitSampleType({
	// 	sampleName,
	// 	startDate,
	// 	endDate,
	// 	limit: 0
	// });

	// TODO - Only request for days we don't have

	return await CapacitorHealthkit.queryHKActivitySummary({
		startDate: parseISO(startDate).toISOString(),
		endDate: (endDate ? parseISO(endDate) : new Date()).toISOString(),
	});
}

export function getSampleDataResponse() {
	return {
		"resultData": [
			{
				"activeEnergyBurnedGoal": 678.5160000000004,
				"appleExerciseTimeGoal": 30,
				"appleStandHours": 16,
				"activeEnergyBurned": 678.5160000000004,
				"appleExerciseTime": 49,
				"date": "2021-01-02T00:00:00Z",
				"appleStandHoursGoal": 10
			},
			{
				"date": "2021-01-03T00:00:00Z",
				"activeEnergyBurnedGoal": 829.8109999999998,
				"appleStandHours": 15,
				"appleExerciseTimeGoal": 30,
				"appleExerciseTime": 55,
				"appleStandHoursGoal": 8,
				"activeEnergyBurned": 829.8109999999998
			},
			{
				"appleExerciseTime": 64,
				"activeEnergyBurnedGoal": 810.5919999999995,
				"appleExerciseTimeGoal": 30,
				"appleStandHours": 12,
				"appleStandHoursGoal": 8,
				"date": "2021-01-04T00:00:00Z",
				"activeEnergyBurned": 810.5919999999995
			},
			{
				"appleStandHours": 14,
				"appleStandHoursGoal": 8,
				"activeEnergyBurned": 792.1939999999997,
				"date": "2021-01-05T00:00:00Z",
				"appleExerciseTime": 82,
				"activeEnergyBurnedGoal": 792.1939999999997,
				"appleExerciseTimeGoal": 30
			},
			{
				"date": "2021-01-06T00:00:00Z",
				"appleStandHoursGoal": 8,
				"appleExerciseTime": 97,
				"appleExerciseTimeGoal": 30,
				"activeEnergyBurnedGoal": 930.4169999999996,
				"appleStandHours": 15,
				"activeEnergyBurned": 930.4169999999996
			},
			{
				"appleExerciseTimeGoal": 30,
				"appleStandHoursGoal": 8,
				"appleExerciseTime": 61,
				"activeEnergyBurned": 863.3447449369647,
				"activeEnergyBurnedGoal": 863.3447449369647,
				"appleStandHours": 15,
				"date": "2021-01-07T00:00:00Z"
			},
			{
				"date": "2021-01-08T00:00:00Z",
				"activeEnergyBurnedGoal": 334.50100000000054,
				"appleExerciseTimeGoal": 30,
				"appleExerciseTime": 14,
				"activeEnergyBurned": 334.50100000000054,
				"appleStandHours": 11,
				"appleStandHoursGoal": 8
			},
			{
				"appleStandHours": 14,
				"activeEnergyBurnedGoal": 759.9099999999993,
				"activeEnergyBurned": 759.9099999999993,
				"appleExerciseTimeGoal": 30,
				"appleExerciseTime": 49,
				"date": "2021-01-09T00:00:00Z",
				"appleStandHoursGoal": 8
			},
			{
				"appleStandHours": 0,
				"activeEnergyBurnedGoal": 159.9099999999993,
				"activeEnergyBurned": 159.9099999999993,
				"appleExerciseTimeGoal": 30,
				"appleExerciseTime": 12,
				"date": "2021-01-10T00:00:00Z",
				"appleStandHoursGoal": 8
			},
		],
		"countReturn": 9
	};
}
