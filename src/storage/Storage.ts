import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

/**
 * Storage. When setting you can prefer to use cookies.
 */
class StorageHelper {

	static set(key: string, value: any) {
		Storage.set({ key, value: JSON.stringify(value) });
	}

	static async get(key: string) {
		const data = await Storage.get({ key });
		return StorageHelper.decode(data.value);
	}

	static async keys() {
		return await Storage.keys();
	}

	static remove(key: string) {
		Storage.remove({ key });
	}

	static clear() {
		Storage.clear();
	}

	static decode(value: any) {
		try {
			return JSON.parse(value);
		} catch(e) {
			return value;
		}
	}

}

export default StorageHelper;
